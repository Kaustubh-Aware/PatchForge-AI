const axios = require("axios");

// ======================================================
// OSV API
// ======================================================

const OSV_API = "https://api.osv.dev/v1/query";

// ======================================================
// Scan Dependencies Against OSV
// ======================================================

const scanDependencies = async (dependencies) => {

    const vulnerablePackages = [];

    let vulnerabilitiesFound = 0;

    for (const dependency of dependencies) {

        try {

            const response = await axios.post(
                OSV_API,
                {
                    package: {
                        name: dependency.name,
                        ecosystem: "npm"
                    },
                    version: dependency.version
                }
            );

            const vulns = response.data.vulns || [];

            if (vulns.length > 0) {

                vulnerabilitiesFound += vulns.length;

                vulnerablePackages.push({

                    packageName: dependency.name,

                    version: dependency.version,

                    vulnerabilities: vulns

                });

            }

        }

        catch (error) {

            console.log(
                "OSV Error:",
                dependency.name
            );

        }

    }

    return {

        success: true,

        totalDependencies: dependencies.length,

        vulnerabilitiesFound,

        vulnerablePackages

    };

};

module.exports = {

    scanDependencies

};