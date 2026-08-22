// ==============================================================================
// PatchForge AI — Supabase Database Service Layer (with Resilient In-Memory Fallback)
// ==============================================================================
const { supabase } = require("../config/supabase");
const {
    normalizeSeverity,
    calculateSeverityCounts,
    calculateSecurityScore,
    getScoreLabel,
} = require("../utils/severityCalculator");

// In-Memory Fallback Store (Used seamlessly if Supabase tables are not yet initialized)
const memoryStore = {
    scans: new Map(),
    vulnerabilities: new Map(),
};

let tableWarningLogged = false;

const logTableWarningOnce = (table) => {
    if (!tableWarningLogged) {
        console.warn(`\n================================================================================`);
        console.warn(`💡 NOTICE: Table 'public.${table}' not found in Supabase.`);
        console.warn(`👉 To activate full cloud persistence, copy and run the SQL migration from:`);
        console.warn(`   backend/supabase_migration.sql`);
        console.warn(`   in your Supabase Dashboard -> SQL Editor.`);
        console.warn(`⚡ Operating in high-performance memory mode in the meantime.`);
        console.warn(`================================================================================\n`);
        tableWarningLogged = true;
    }
};

// ==============================================================================
// Helper: Map Database Scan Row to CamelCase API Object
// ==============================================================================
const mapScanRow = (row) => {
    if (!row) return null;

    return {
        scanId: row.scan_id || row.scanId,
        repositoryUrl: row.repository_url || row.repositoryUrl,
        repositoryId: row.repository_id || row.repositoryId || null,
        status: row.status || "Scanning",
        totalDependencies: row.total_dependencies ?? row.totalDependencies ?? 0,
        vulnerabilitiesFound: row.vulnerabilities_found ?? row.vulnerabilitiesFound ?? 0,
        criticalCount: row.critical_count ?? row.criticalCount ?? 0,
        highCount: row.high_count ?? row.highCount ?? 0,
        mediumCount: row.medium_count ?? row.mediumCount ?? 0,
        lowCount: row.low_count ?? row.lowCount ?? 0,
        severityCounts: row.severity_counts || row.severityCounts || {
            CRITICAL: row.critical_count ?? row.criticalCount ?? 0,
            HIGH: row.high_count ?? row.highCount ?? 0,
            MEDIUM: row.medium_count ?? row.mediumCount ?? 0,
            LOW: row.low_count ?? row.lowCount ?? 0,
        },
        securityScore: row.security_score ?? row.securityScore ?? 100,
        scoreLabel: row.score_label || row.scoreLabel || getScoreLabel(row.security_score ?? row.securityScore ?? 100),
        aiAnalysis: row.ai_analysis || row.aiAnalysis || null,
        startedAt: row.started_at || row.startedAt,
        completedAt: row.completed_at || row.completedAt,
        createdAt: row.created_at || row.createdAt,
        updatedAt: row.updated_at || row.updatedAt,
    };
};

// ==============================================================================
// Helper: Map Vulnerability Row to CamelCase API Object
// ==============================================================================
const mapVulnerabilityRow = (row, installedVersion = "") => {
    if (!row) return null;

    return {
        id: row.id,
        vulnerabilityId: row.vulnerability_id || row.vulnerabilityId,
        packageName: row.package_name || row.packageName,
        installedVersion: installedVersion || row.installed_version || row.installedVersion || "unknown",
        ecosystem: row.ecosystem || "npm",
        summary: row.summary || "",
        details: row.details || "",
        severity: normalizeSeverity(row.severity),
        cvssScore: Number(row.cvss_score ?? row.cvssScore ?? 0),
        fixedVersion: row.fixed_version || row.fixedVersion || "",
        references: Array.isArray(row.references) ? row.references : [],
        createdAt: row.created_at || row.createdAt,
    };
};

// ==============================================================================
// 1. Ensure Repository Exists in Database
// ==============================================================================
const ensureRepository = async (repositoryUrl) => {
    try {
        const cleanUrl = repositoryUrl.trim().replace(/\/+$/, "");
        const parts = cleanUrl.replace(/^https?:\/\/github\.com\//, "").split("/");
        const ownerName = parts[0] || "unknown";
        const repoName = parts[1] || "unknown";

        const { data: existingRepo } = await supabase
            .from("repositories")
            .select("id, repository_url, owner_name, repo_name")
            .eq("repository_url", cleanUrl)
            .maybeSingle();

        if (existingRepo) {
            return existingRepo;
        }

        const { data: newRepo } = await supabase
            .from("repositories")
            .insert({
                repository_url: cleanUrl,
                owner_name: ownerName,
                repo_name: repoName,
            })
            .select()
            .single();

        return newRepo || null;
    } catch (err) {
        return null;
    }
};

// ==============================================================================
// 2. Create Initial Scan Record
// ==============================================================================
const createScanRecord = async (scanData) => {
    const memoryScan = {
        scanId: scanData.scanId,
        repositoryUrl: scanData.repositoryUrl,
        status: scanData.status || "Scanning",
        totalDependencies: scanData.totalDependencies || 0,
        vulnerabilitiesFound: scanData.vulnerabilitiesFound || 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        severityCounts: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
        securityScore: 100,
        scoreLabel: "Excellent",
        aiAnalysis: null,
        startedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    memoryStore.scans.set(scanData.scanId, memoryScan);

    try {
        const repo = await ensureRepository(scanData.repositoryUrl);

        const newScan = {
            scan_id: scanData.scanId,
            repository_url: scanData.repositoryUrl,
            repository_id: repo?.id || null,
            status: scanData.status || "Scanning",
            total_dependencies: scanData.totalDependencies || 0,
            vulnerabilities_found: scanData.vulnerabilitiesFound || 0,
            security_score: 100,
            score_label: "Excellent",
            started_at: memoryScan.startedAt,
        };

        const { data, error } = await supabase
            .from("scans")
            .insert(newScan)
            .select()
            .single();

        if (error) {
            logTableWarningOnce("scans");
            return memoryScan;
        }

        return mapScanRow(data);
    } catch (err) {
        logTableWarningOnce("scans");
        return memoryScan;
    }
};

// ==============================================================================
// 3. Save Scan Results & Normalized Vulnerabilities
// ==============================================================================
const saveScanResultsToSupabase = async (scanId, repositoryUrl, scanReport) => {
    try {
        const vulnerablePackages = scanReport.vulnerablePackages || [];
        const normalizedVulns = [];

        // 1. Process and save vulnerabilities in catalog
        for (const pkg of vulnerablePackages) {
            const vulns = pkg.vulnerabilities || [];

            for (const vuln of vulns) {
                const severity = normalizeSeverity(
                    vuln?.database_specific?.severity ||
                    vuln?.severity ||
                    "UNKNOWN"
                );

                let cvssScore = 0;
                if (vuln?.database_specific?.cvssScore) {
                    cvssScore = vuln.database_specific.cvssScore;
                } else if (vuln?.severity_score) {
                    cvssScore = vuln.severity_score;
                } else if (vuln?.database_specific?.cvss?.score) {
                    cvssScore = vuln.database_specific.cvss.score;
                }

                let fixedVersion = "";
                if (vuln?.fixed_version) {
                    fixedVersion = vuln.fixed_version;
                } else if (vuln?.affected) {
                    for (const affected of vuln.affected) {
                        const ranges = affected?.ranges || [];
                        for (const range of ranges) {
                            const events = range?.events || [];
                            for (const event of events) {
                                if (event?.fixed) {
                                    fixedVersion = event.fixed;
                                    break;
                                }
                            }
                            if (fixedVersion) break;
                        }
                        if (fixedVersion) break;
                    }
                }

                const vulnId = vuln.id || vuln.vulnerabilityId || "UNKNOWN";
                const packageName = pkg.packageName || pkg.name || "unknown";
                const installedVersion = pkg.version || pkg.installedVersion || "unknown";

                const vulnRecord = {
                    id: `${scanId}-${vulnId}-${Date.now()}`,
                    vulnerability_id: vulnId,
                    package_name: packageName,
                    ecosystem: "npm",
                    summary: vuln.summary || vuln.details || "",
                    details: vuln.details || "",
                    severity,
                    cvss_score: cvssScore,
                    fixed_version: fixedVersion,
                    references: vuln.references
                        ? vuln.references.map((r) => r.url || r).filter(Boolean)
                        : [],
                    installed_version: installedVersion,
                };

                normalizedVulns.push(mapVulnerabilityRow(vulnRecord, installedVersion));

                // Upsert to Supabase if available
                try {
                    const { data: upsertedVuln } = await supabase
                        .from("vulnerabilities")
                        .upsert({
                            vulnerability_id: vulnRecord.vulnerability_id,
                            package_name: vulnRecord.package_name,
                            ecosystem: vulnRecord.ecosystem,
                            summary: vulnRecord.summary,
                            details: vulnRecord.details,
                            severity: vulnRecord.severity,
                            cvss_score: vulnRecord.cvss_score,
                            fixed_version: vulnRecord.fixed_version,
                            references: vulnRecord.references,
                        }, {
                            onConflict: "vulnerability_id, package_name",
                        })
                        .select("id")
                        .maybeSingle();

                    if (upsertedVuln?.id) {
                        await supabase
                            .from("scan_vulnerabilities")
                            .insert({
                                scan_id: scanId,
                                vulnerability_id: upsertedVuln.id,
                                installed_version: installedVersion,
                            });
                    }
                } catch (dbErr) {
                    // Suppress and use memory
                }
            }
        }

        memoryStore.vulnerabilities.set(scanId, normalizedVulns);

        // 2. Calculate Severity Counts & Security Score
        const severityCounts = calculateSeverityCounts(normalizedVulns);
        const securityScore = calculateSecurityScore(severityCounts);
        const scoreLabel = getScoreLabel(securityScore);

        // 3. Format AI Analysis
        let aiAnalysis = null;
        if (scanReport.aiAnalysis) {
            if (typeof scanReport.aiAnalysis === "string") {
                aiAnalysis = scanReport.aiAnalysis;
            } else if (scanReport.aiAnalysis?.response) {
                aiAnalysis = scanReport.aiAnalysis.response;
            } else if (scanReport.aiAnalysis?.message) {
                aiAnalysis = scanReport.aiAnalysis.message;
            } else {
                aiAnalysis = JSON.stringify(scanReport.aiAnalysis);
            }
        }

        const updatePayload = {
            scanId,
            repositoryUrl,
            status: "Completed",
            totalDependencies: scanReport.totalDependencies || 0,
            vulnerabilitiesFound: normalizedVulns.length,
            criticalCount: severityCounts.CRITICAL,
            highCount: severityCounts.HIGH,
            mediumCount: severityCounts.MEDIUM,
            lowCount: severityCounts.LOW,
            severityCounts: severityCounts,
            securityScore: securityScore,
            scoreLabel: scoreLabel,
            aiAnalysis: aiAnalysis || "AI analysis not available for this scan.",
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const existingMem = memoryStore.scans.get(scanId) || {};
        memoryStore.scans.set(scanId, {
            ...existingMem,
            ...updatePayload,
        });

        // 4. Update Scan row in Supabase
        try {
            const { data: updatedScan, error: updateError } = await supabase
                .from("scans")
                .update({
                    status: "Completed",
                    total_dependencies: scanReport.totalDependencies || 0,
                    vulnerabilities_found: normalizedVulns.length,
                    critical_count: severityCounts.CRITICAL,
                    high_count: severityCounts.HIGH,
                    medium_count: severityCounts.MEDIUM,
                    low_count: severityCounts.LOW,
                    severity_counts: severityCounts,
                    security_score: securityScore,
                    score_label: scoreLabel,
                    ai_analysis: updatePayload.aiAnalysis,
                    completed_at: updatePayload.completedAt,
                })
                .eq("scan_id", scanId)
                .select()
                .single();

            if (!updateError && updatedScan) {
                return {
                    success: true,
                    scan: mapScanRow(updatedScan),
                };
            }
        } catch (dbErr) {
            // Memory fallback
        }

        return {
            success: true,
            scan: updatePayload,
        };
    } catch (err) {
        console.error("saveScanResultsToSupabase error:", err.message);
        return {
            success: false,
            message: err.message,
        };
    }
};

// ==============================================================================
// 4. Get Scan & Vulnerabilities by Scan ID
// ==============================================================================
const getScanReportByScanId = async (scanId) => {
    // 1. Try Supabase
    try {
        const { data: scanRow, error: scanError } = await supabase
            .from("scans")
            .select("*")
            .eq("scan_id", scanId)
            .maybeSingle();

        if (!scanError && scanRow) {
            const { data: scanVulns } = await supabase
                .from("scan_vulnerabilities")
                .select(`
                    installed_version,
                    vulnerabilities (
                        id,
                        vulnerability_id,
                        package_name,
                        ecosystem,
                        summary,
                        details,
                        severity,
                        cvss_score,
                        fixed_version,
                        references,
                        created_at
                    )
                `)
                .eq("scan_id", scanId);

            const vulnerabilities = (scanVulns || [])
                .map((item) => mapVulnerabilityRow(item.vulnerabilities, item.installed_version))
                .filter(Boolean);

            return {
                ...mapScanRow(scanRow),
                vulnerabilities,
            };
        }
    } catch (err) {
        // Fall through to memory store
    }

    // 2. Memory Store fallback
    const memScan = memoryStore.scans.get(scanId);
    if (!memScan) return null;

    const memVulns = memoryStore.vulnerabilities.get(scanId) || [];

    return {
        ...memScan,
        vulnerabilities: memVulns,
    };
};

// ==============================================================================
// 5. Get All Scans List
// ==============================================================================
const getAllScansFromSupabase = async () => {
    try {
        const { data, error } = await supabase
            .from("scans")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
            return data.map(mapScanRow);
        }
    } catch (err) {
        // Memory fallback
    }

    const memList = Array.from(memoryStore.scans.values()).sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    return memList;
};

// ==============================================================================
// 6. Get Vulnerabilities List for Scan ID
// ==============================================================================
const getVulnerabilitiesForScan = async (scanId) => {
    const report = await getScanReportByScanId(scanId);
    return report?.vulnerabilities || [];
};

// ==============================================================================
// 7. Get Aggregated Platform Stats
// ==============================================================================
const getStatsFromSupabase = async () => {
    const scans = await getAllScansFromSupabase();
    const completedScans = scans.filter((s) => s.status === "Completed");

    let totalDependencies = 0;
    let totalVulnerabilities = 0;
    let totalCritical = 0;
    const severityCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };

    completedScans.forEach((scan) => {
        totalDependencies += scan.totalDependencies || 0;
        totalVulnerabilities += scan.vulnerabilitiesFound || 0;

        if (scan.severityCounts) {
            severityCounts.CRITICAL += scan.severityCounts.CRITICAL || 0;
            severityCounts.HIGH += scan.severityCounts.HIGH || 0;
            severityCounts.MEDIUM += scan.severityCounts.MEDIUM || 0;
            severityCounts.LOW += scan.severityCounts.LOW || 0;
        }
    });

    totalCritical = severityCounts.CRITICAL;

    let avgScore = 100;
    if (completedScans.length > 0) {
        const totalScore = completedScans.reduce(
            (sum, s) => sum + (s.securityScore ?? 100),
            0
        );
        avgScore = Math.round(totalScore / completedScans.length);
    }

    return {
        totalScans: scans.length,
        completedScans: completedScans.length,
        totalDependencies,
        totalVulnerabilities,
        totalCritical,
        severityCounts,
        securityScore: avgScore,
    };
};

// ==============================================================================
// 8. Update Scan Status (e.g. Failed)
// ==============================================================================
const updateScanStatus = async (scanId, status) => {
    const memScan = memoryStore.scans.get(scanId);
    if (memScan) {
        memScan.status = status;
        memScan.completedAt = new Date().toISOString();
    }

    try {
        const { data } = await supabase
            .from("scans")
            .update({
                status,
                completed_at: new Date().toISOString(),
            })
            .eq("scan_id", scanId)
            .select()
            .single();

        if (data) return mapScanRow(data);
    } catch (err) {
        // Suppress
    }

    return memScan;
};

module.exports = {
    createScanRecord,
    saveScanResultsToSupabase,
    getScanReportByScanId,
    getAllScansFromSupabase,
    getVulnerabilitiesForScan,
    getStatsFromSupabase,
    updateScanStatus,
};
