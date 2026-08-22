// ==============================================================================
// PatchForge AI — Supabase Database Service Layer (Cloud-First)
// ==============================================================================
// Tables are live in Supabase. This module is the sole persistence layer.
// All reads/writes go directly to Supabase PostgreSQL.
// ==============================================================================

const { supabase } = require("../config/supabase");
const {
    normalizeSeverity,
    calculateSeverityCounts,
    calculateSecurityScore,
    getScoreLabel,
} = require("../utils/severityCalculator");

// ==============================================================================
// Helper: Map Database Scan Row → CamelCase API Object
// ==============================================================================
const mapScanRow = (row) => {
    if (!row) return null;

    return {
        scanId: row.scan_id,
        repositoryUrl: row.repository_url,
        repositoryId: row.repository_id || null,
        status: row.status || "Scanning",
        totalDependencies: row.total_dependencies ?? 0,
        vulnerabilitiesFound: row.vulnerabilities_found ?? 0,
        criticalCount: row.critical_count ?? 0,
        highCount: row.high_count ?? 0,
        mediumCount: row.medium_count ?? 0,
        lowCount: row.low_count ?? 0,
        severityCounts: row.severity_counts || {
            CRITICAL: row.critical_count ?? 0,
            HIGH: row.high_count ?? 0,
            MEDIUM: row.medium_count ?? 0,
            LOW: row.low_count ?? 0,
        },
        securityScore: row.security_score ?? 100,
        scoreLabel: row.score_label || getScoreLabel(row.security_score ?? 100),
        aiAnalysis: row.ai_analysis || null,
        startedAt: row.started_at,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

// ==============================================================================
// Helper: Map Vulnerability Row → CamelCase API Object
// ==============================================================================
const mapVulnerabilityRow = (row, installedVersion = "") => {
    if (!row) return null;

    return {
        id: row.id,
        vulnerabilityId: row.vulnerability_id,
        packageName: row.package_name,
        installedVersion: installedVersion || row.installed_version || "unknown",
        ecosystem: row.ecosystem || "npm",
        summary: row.summary || "",
        details: row.details || "",
        severity: normalizeSeverity(row.severity),
        cvssScore: Number(row.cvss_score ?? 0),
        fixedVersion: row.fixed_version || "",
        references: Array.isArray(row.references) ? row.references : [],
        createdAt: row.created_at,
    };
};

// ==============================================================================
// 1. Ensure Repository Exists in Supabase
// ==============================================================================
const ensureRepository = async (repositoryUrl) => {
    try {
        const cleanUrl = repositoryUrl.trim().replace(/\/+$/, "");
        const parts = cleanUrl.replace(/^https?:\/\/github\.com\//, "").split("/");
        const ownerName = parts[0] || "unknown";
        const repoName = parts[1] || "unknown";

        // Check if repository already exists
        const { data: existingRepo, error: findError } = await supabase
            .from("repositories")
            .select("id, repository_url, owner_name, repo_name")
            .eq("repository_url", cleanUrl)
            .maybeSingle();

        if (findError) {
            console.error("❌ Supabase findRepo error:", findError.message);
        }

        if (existingRepo) {
            console.log(`✅ Repository found in Supabase: ${cleanUrl} (id: ${existingRepo.id})`);
            return existingRepo;
        }

        // Insert new repository
        const { data: newRepo, error: insertError } = await supabase
            .from("repositories")
            .insert({
                repository_url: cleanUrl,
                owner_name: ownerName,
                repo_name: repoName,
            })
            .select()
            .single();

        if (insertError) {
            console.error("❌ Supabase insertRepo error:", insertError.message);
            return null;
        }

        console.log(`✅ Repository inserted into Supabase: ${cleanUrl} (id: ${newRepo.id})`);
        return newRepo;
    } catch (err) {
        console.error("❌ ensureRepository exception:", err.message);
        return null;
    }
};

// ==============================================================================
// 2. Create Initial Scan Record in Supabase
// ==============================================================================
const createScanRecord = async (scanData) => {
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
            started_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("scans")
            .insert(newScan)
            .select()
            .single();

        if (error) {
            console.error("❌ Supabase createScan error:", error.message);
            throw new Error(`Failed to create scan in Supabase: ${error.message}`);
        }

        console.log(`✅ Scan record created in Supabase: ${scanData.scanId}`);
        return mapScanRow(data);
    } catch (err) {
        console.error("❌ createScanRecord exception:", err.message);
        throw err;
    }
};

// ==============================================================================
// 3. Save Scan Results & Normalized Vulnerabilities to Supabase
// ==============================================================================
const saveScanResultsToSupabase = async (scanId, repositoryUrl, scanReport) => {
    try {
        const vulnerablePackages = scanReport.vulnerablePackages || [];
        const normalizedVulns = [];

        // ── Step 1: Process each vulnerability ──
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
                    vulnerability_id: vulnId,
                    package_name: packageName,
                    ecosystem: "npm",
                    summary: vuln.summary || "",
                    details: vuln.details || "",
                    severity,
                    cvss_score: cvssScore,
                    fixed_version: fixedVersion,
                    references: vuln.references
                        ? vuln.references.map((r) => r.url || r).filter(Boolean)
                        : [],
                };

                // ── Upsert vulnerability into catalog table ──
                const { data: upsertedVuln, error: vulnError } = await supabase
                    .from("vulnerabilities")
                    .upsert(vulnRecord, {
                        onConflict: "vulnerability_id,package_name",
                    })
                    .select("id")
                    .single();

                if (vulnError) {
                    console.error(`❌ Supabase vuln upsert error for ${vulnId}:`, vulnError.message);
                } else {
                    console.log(`✅ Vulnerability upserted: ${vulnId} (uuid: ${upsertedVuln.id})`);

                    // ── Link to scan_vulnerabilities join table ──
                    const { error: linkError } = await supabase
                        .from("scan_vulnerabilities")
                        .insert({
                            scan_id: scanId,
                            vulnerability_id: upsertedVuln.id,
                            installed_version: installedVersion,
                        });

                    if (linkError) {
                        console.error(`❌ Supabase scan_vulnerabilities link error:`, linkError.message);
                    } else {
                        console.log(`✅ Linked vulnerability ${vulnId} → scan ${scanId}`);
                    }
                }

                normalizedVulns.push({
                    ...vulnRecord,
                    installedVersion,
                });
            }
        }

        // ── Step 2: Calculate severity counts & security score ──
        const severityCounts = calculateSeverityCounts(normalizedVulns);
        const securityScore = calculateSecurityScore(severityCounts);
        const scoreLabel = getScoreLabel(securityScore);

        console.log("\nSeverity Counts:", severityCounts);
        console.log("Security Score:", securityScore);

        // ── Step 3: Format AI Analysis ──
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

        // ── Step 4: Update scan row in Supabase with final results ──
        const updatePayload = {
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
            ai_analysis: aiAnalysis || "AI analysis not available for this scan.",
            completed_at: new Date().toISOString(),
        };

        const { data: updatedScan, error: updateError } = await supabase
            .from("scans")
            .update(updatePayload)
            .eq("scan_id", scanId)
            .select()
            .single();

        if (updateError) {
            console.error("❌ Supabase scan update error:", updateError.message);
            return { success: false, message: updateError.message };
        }

        console.log(`✅ Scan ${scanId} updated to Completed in Supabase`);

        return {
            success: true,
            scan: mapScanRow(updatedScan),
        };
    } catch (err) {
        console.error("❌ saveScanResultsToSupabase exception:", err.message);
        return {
            success: false,
            message: err.message,
        };
    }
};

// ==============================================================================
// 4. Get Scan Report & Joined Vulnerabilities by Scan ID
// ==============================================================================
const getScanReportByScanId = async (scanId) => {
    try {
        // Fetch scan row
        const { data: scanRow, error: scanError } = await supabase
            .from("scans")
            .select("*")
            .eq("scan_id", scanId)
            .maybeSingle();

        if (scanError) {
            console.error("❌ Supabase getScan error:", scanError.message);
            return null;
        }

        if (!scanRow) {
            return null;
        }

        // Fetch joined vulnerabilities via scan_vulnerabilities → vulnerabilities
        const { data: scanVulns, error: vulnsError } = await supabase
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

        if (vulnsError) {
            console.error("❌ Supabase getVulns error:", vulnsError.message);
        }

        const vulnerabilities = (scanVulns || [])
            .map((item) => mapVulnerabilityRow(item.vulnerabilities, item.installed_version))
            .filter(Boolean);

        return {
            ...mapScanRow(scanRow),
            vulnerabilities,
        };
    } catch (err) {
        console.error("❌ getScanReportByScanId exception:", err.message);
        return null;
    }
};

// ==============================================================================
// 5. Get All Scans (ordered by most recent)
// ==============================================================================
const getAllScansFromSupabase = async () => {
    try {
        const { data, error } = await supabase
            .from("scans")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("❌ Supabase getAllScans error:", error.message);
            return [];
        }

        return (data || []).map(mapScanRow);
    } catch (err) {
        console.error("❌ getAllScansFromSupabase exception:", err.message);
        return [];
    }
};

// ==============================================================================
// 6. Get Vulnerabilities List for a Scan ID
// ==============================================================================
const getVulnerabilitiesForScan = async (scanId) => {
    try {
        const report = await getScanReportByScanId(scanId);
        return report?.vulnerabilities || [];
    } catch (err) {
        console.error("❌ getVulnerabilitiesForScan exception:", err.message);
        return [];
    }
};

// ==============================================================================
// 7. Get Aggregated Platform Stats (Dashboard)
// ==============================================================================
const getStatsFromSupabase = async () => {
    try {
        const scans = await getAllScansFromSupabase();
        const completedScans = scans.filter((s) => s.status === "Completed");

        let totalDependencies = 0;
        let totalVulnerabilities = 0;
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
            totalCritical: severityCounts.CRITICAL,
            severityCounts,
            securityScore: avgScore,
        };
    } catch (err) {
        console.error("❌ getStatsFromSupabase exception:", err.message);
        return {
            totalScans: 0,
            completedScans: 0,
            totalDependencies: 0,
            totalVulnerabilities: 0,
            totalCritical: 0,
            severityCounts: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
            securityScore: 100,
        };
    }
};

// ==============================================================================
// 8. Update Scan Status (e.g. Failed)
// ==============================================================================
const updateScanStatus = async (scanId, status) => {
    try {
        const { data, error } = await supabase
            .from("scans")
            .update({
                status,
                completed_at: new Date().toISOString(),
            })
            .eq("scan_id", scanId)
            .select()
            .single();

        if (error) {
            console.error("❌ Supabase updateScanStatus error:", error.message);
            return null;
        }

        return mapScanRow(data);
    } catch (err) {
        console.error("❌ updateScanStatus exception:", err.message);
        return null;
    }
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
