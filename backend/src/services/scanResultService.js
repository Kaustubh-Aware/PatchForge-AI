const Scan = require("../models/Scan");
const Vulnerability = require("../models/Vulnerability");

// ======================================================
// Save Scan Results
// ======================================================

const saveScanResults = async (
    scanId,
    repositoryUrl,
    scanReport
) => {

    try {

        console.log("\n========== SAVING SCAN REPORT ==========");
        console.log(JSON.stringify(scanReport, null, 2));

        // ---------------------------------------
        // Save Vulnerabilities
        // ---------------------------------------

        for (const pkg of scanReport.vulnerablePackages) {

            for (const vuln of pkg.vulnerabilities) {

                await Vulnerability.create({

                    scanId,

                    packageName: pkg.packageName,

                    installedVersion: pkg.version,

                    ecosystem: "npm",

                    vulnerabilityId: vuln.id,

                    summary: vuln.summary || "",

                    severity:
                        vuln.database_specific?.severity ||
                        "UNKNOWN",

                    cvssScore:
                        vuln.database_specific?.cvssScore ||
                        0,

                    fixedVersion:
                        vuln.fixed_version || "",

                    references:
                        vuln.references
                            ? vuln.references.map(
                                  ref => ref.url
                              )
                            : []

                });

            }

        }

        console.log("\nUpdating Scan document with:");
        console.log({
            totalDependencies: scanReport.totalDependencies,
            vulnerabilitiesFound: scanReport.vulnerabilitiesFound
        });

        // ---------------------------------------
        // Update Scan Document
        // ---------------------------------------

        await Scan.findOneAndUpdate(

            { scanId },

            {

            repositoryUrl,
            status: "Completed",
            totalDependencies: scanReport.totalDependencies,
            vulnerabilitiesFound: scanReport.vulnerabilitiesFound,

                aiAnalysis:
                    scanReport.aiAnalysis?.response ||
                    scanReport.aiAnalysis ||
                    "AI analysis not available"

            }

        );

        const updated = await Scan.findOne({ scanId });

        console.log("\n========== UPDATED SCAN ==========");
        console.log(updated);

        return {

            success: true

        };

    } catch (error) {

        console.error(
            "Scan Result Service Error:",
            error
        );

        return {

            success: false,

            message: error.message

        };

    }

};

module.exports = {

    saveScanResults

};