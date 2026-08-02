const fs = require("fs");
const path = require("path");

/**
 * Detect project type and extract dependencies.
 * Currently supports:
 * - Node.js (package.json)
 *
 * Future:
 * - Python (requirements.txt)
 * - Java (pom.xml)
 */

const scanDependencies = async (repositoryPath) => {
    try {

        const packageJsonPath = path.join(repositoryPath, "package.json");

        // -------------------------------
        // Node.js Project
        // -------------------------------

        if (fs.existsSync(packageJsonPath)) {

            const packageJson = JSON.parse(
                fs.readFileSync(packageJsonPath, "utf-8")
            );

            const dependencies = [];

            if (packageJson.dependencies) {

                for (const [name, version] of Object.entries(packageJson.dependencies)) {

                    dependencies.push({
                        name,
                        version,
                        type: "dependency"
                    });

                }

            }

            if (packageJson.devDependencies) {

                for (const [name, version] of Object.entries(packageJson.devDependencies)) {

                    dependencies.push({
                        name,
                        version,
                        type: "devDependency"
                    });

                }

            }

            return {
                success: true,
                projectType: "Node.js",
                totalDependencies: dependencies.length,
                dependencies
            };

        }

        // -------------------------------
        // Unsupported Project
        // -------------------------------

        return {
            success: false,
            message: "No supported dependency file found."
        };

    } catch (error) {

        console.error("Dependency Scanner Error:", error);

        return {
            success: false,
            message: error.message
        };

    }
};

module.exports = scanDependencies;