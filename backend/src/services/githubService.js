const cloneRepository = require("../github/cloneRepository");
const scanDependencies = require("../scanners/dependencyScanner");
const scanOSV = require("../scanners/osvScanner");
const { analyzeVulnerabilities } = require("./lyzrService");

// ======================================================
// Clone Repository → Dependency Scan → OSV Scan → Lyzr AI
// ======================================================

const scanRepository = async (repositoryUrl) => {

    try {

        console.log("==================================");
        console.log("========== START SCAN ==========");
        console.log("==================================");

        // -----------------------------------------
        // Clone Repository
        // -----------------------------------------

        console.log("1. Cloning repository...");

        const repositoryPath = await cloneRepository(repositoryUrl);

        console.log("✅ Clone completed");

        // -----------------------------------------
        // Dependency Scan
        // -----------------------------------------

        console.log("2. Scanning dependencies...");

        const dependencyResult =
            await scanDependencies(repositoryPath);

        console.log("✅ Dependency scan completed");

        if (!dependencyResult.success) {

            return dependencyResult;

        }

        // -----------------------------------------
        // OSV Scan
        // -----------------------------------------

        console.log("3. Running OSV Scan...");

        const osvResult = await scanOSV(dependencyResult);

        console.log("\n========== OSV RESULT ==========");
        console.log(JSON.stringify(osvResult, null, 2));

        console.log(
            `Found ${osvResult.vulnerabilitiesFound} vulnerabilities`
        );

        // -----------------------------------------
        // Lyzr AI Analysis
        // -----------------------------------------

        console.log("\n4. Running Lyzr AI Analysis...");

        const aiResult =
            await analyzeVulnerabilities(
                osvResult.vulnerablePackages
            );

            const fs = require("fs");

            fs.writeFileSync(
                "ai-result.json",
                JSON.stringify(aiResult, null, 2)
            );

            console.log("✅ AI Result saved to ai-result.json");

        if (aiResult.success) {

            console.log("✅ Lyzr AI Analysis Completed");

            console.log("\n========== AI ANALYSIS ==========");
            console.log(JSON.stringify(aiResult.analysis, null, 2));

        } else {

            console.log("⚠ Lyzr AI Analysis Failed");
            console.log("Reason:", aiResult.message);

        }

        // -----------------------------------------
        // Finish
        // -----------------------------------------

        console.log("==================================");
        console.log("SCAN COMPLETED");
        console.log("==================================");

        return {

            success: true,

            repositoryPath,

            projectType:
                dependencyResult.projectType,

            totalDependencies:
                dependencyResult.totalDependencies,

            dependencies:
                dependencyResult.dependencies,

            vulnerablePackages:
                osvResult.vulnerablePackages,

            vulnerabilitiesFound:
                osvResult.vulnerabilitiesFound,

            aiAnalysis:
                aiResult.success
                    ? aiResult.analysis
                    : null

        };

    }

    catch (error) {

        console.error("\n========== GITHUB SERVICE ERROR ==========");
        console.error(error);

        return {

            success: false,

            message: error.message

        };

    }

};

module.exports = {
    scanRepository,
};