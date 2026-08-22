const store = require("../store/store");
const {
    normalizeSeverity,
    calculateSeverityCounts,
    calculateSecurityScore,
} = require("../utils/severityCalculator");

// ======================================================
// Save Scan Results
// ======================================================

const saveScanResults = async (scanId, repositoryUrl, scanReport) => {
    try {
        console.log("\n========== SAVING SCAN REPORT ==========");

        // Collect all normalized vulnerabilities for counting
        const allVulns = [];

        // ---------------------------------------
        // Save Vulnerabilities
        // ---------------------------------------

        const vulnerablePackages = scanReport.vulnerablePackages || [];

        for (const pkg of vulnerablePackages) {
            const vulns = pkg.vulnerabilities || [];

            for (const vuln of vulns) {
                const severity = normalizeSeverity(
                    vuln?.database_specific?.severity ||
                    vuln?.severity ||
                    "UNKNOWN"
                );

                // Extract CVSS score safely
                let cvssScore = 0;
                if (vuln?.database_specific?.cvssScore) {
                    cvssScore = vuln.database_specific.cvssScore;
                } else if (vuln?.severity_score) {
                    cvssScore = vuln.severity_score;
                } else if (vuln?.database_specific?.cvss?.score) {
                    cvssScore = vuln.database_specific.cvss.score;
                }

                // Extract fixed version safely
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

                const vulnData = {
                    scanId,
                    packageName: pkg.packageName || pkg.name || "unknown",
                    installedVersion: pkg.version || pkg.installedVersion || "unknown",
                    ecosystem: "npm",
                    vulnerabilityId: vuln.id || vuln.vulnerabilityId || "UNKNOWN",
                    summary: vuln.summary || vuln.details || "",
                    severity,
                    cvssScore,
                    fixedVersion,
                    references: vuln.references
                        ? vuln.references.map((ref) => ref.url || ref).filter(Boolean)
                        : [],
                };

                store.createVulnerability(vulnData);
                allVulns.push(vulnData);
            }
        }

        // ---------------------------------------
        // Calculate Severity Counts & Score
        // ---------------------------------------

        const severityCounts = calculateSeverityCounts(allVulns);
        const securityScore = calculateSecurityScore(severityCounts);

        console.log("\nSeverity Counts:", severityCounts);
        console.log("Security Score:", securityScore);

        // ---------------------------------------
        // Process AI Analysis safely
        // ---------------------------------------

        let aiAnalysis = null;

        if (scanReport.aiAnalysis) {
            // Handle various formats the Lyzr API might return
            if (typeof scanReport.aiAnalysis === "string") {
                aiAnalysis = scanReport.aiAnalysis;
            } else if (scanReport.aiAnalysis?.response) {
                aiAnalysis = scanReport.aiAnalysis.response;
            } else if (scanReport.aiAnalysis?.message) {
                aiAnalysis = scanReport.aiAnalysis.message;
            } else {
                aiAnalysis = scanReport.aiAnalysis;
            }
        }

        // ---------------------------------------
        // Update Scan Document
        // ---------------------------------------

        const totalVulns = allVulns.length;

        store.updateScan(scanId, {
            repositoryUrl,
            status: "Completed",
            totalDependencies: scanReport.totalDependencies || 0,
            vulnerabilitiesFound: totalVulns,
            severityCounts,
            securityScore,
            aiAnalysis: aiAnalysis || "AI analysis not available for this scan.",
            completedAt: new Date(),
        });

        const updated = store.findScan(scanId);

        console.log("\n========== UPDATED SCAN ==========");
        console.log(`Scan ID: ${updated?.scanId}`);
        console.log(`Status: ${updated?.status}`);
        console.log(`Dependencies: ${updated?.totalDependencies}`);
        console.log(`Vulnerabilities: ${updated?.vulnerabilitiesFound}`);

        return { success: true };

    } catch (error) {
        console.error("Scan Result Service Error:", error.message);

        return {
            success: false,
            message: error.message || "Failed to save scan results.",
        };
    }
};

module.exports = {
    saveScanResults,
};