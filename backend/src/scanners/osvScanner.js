const { scanDependencies } = require("../services/osvService");

// ======================================================
// Scan Dependency Tree using OSV API
// ======================================================

const scanOSVVulnerabilities = async (dependencyTree) => {
    try {
        if (!dependencyTree.success) {
            return dependencyTree;
        }

        const osvResult = await scanDependencies(
            dependencyTree.dependencies,
            dependencyTree.ecosystem || "npm"
        );

        return {
            success: true,
            projectType: dependencyTree.projectType,
            ecosystem: dependencyTree.ecosystem || "npm",
            totalDependencies: dependencyTree.totalDependencies,
            vulnerabilitiesFound: osvResult.vulnerabilitiesFound,
            vulnerablePackages: osvResult.vulnerablePackages
        };
    } catch (error) {
        console.error("OSV Scanner Error:", error.message);
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = scanOSVVulnerabilities;