// ======================================================
// Build Dependency Tree
// Converts raw dependencies into a standardized structure
// ======================================================

const buildDependencyTree = async (scanResult) => {
    try {

        if (!scanResult.success) {
            return scanResult;
        }

        const dependencyTree = scanResult.dependencies.map((dependency) => ({

            packageName: dependency.name,

            // Remove symbols like ^ ~ >= <= etc.
            installedVersion: dependency.version.replace(/^[^\d]*/, ""),

            dependencyType: dependency.type,

            ecosystem: "npm"

        }));

        return {

            success: true,

            projectType: scanResult.projectType,

            totalDependencies: dependencyTree.length,

            packages: dependencyTree

        };

    } catch (error) {

        console.error("Dependency Tree Error:", error);

        return {

            success: false,

            message: error.message

        };

    }
};

module.exports = buildDependencyTree;