const { saveScanResultsToSupabase } = require("./supabaseService");

// ======================================================
// Save Scan Results to Database (Supabase)
// ======================================================

const saveScanResults = async (scanId, repositoryUrl, scanReport) => {
    try {
        console.log("\n========== SAVING SCAN REPORT TO SUPABASE ==========");
        console.log(`Scan ID: ${scanId}`);
        console.log(`Repository: ${repositoryUrl}`);

        const result = await saveScanResultsToSupabase(
            scanId,
            repositoryUrl,
            scanReport
        );

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to save results to Supabase.",
            };
        }

        console.log("✅ Scan results and vulnerabilities successfully persisted in Supabase");
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