const validateGitHubRepository = require("../utils/validateRepository");
const generateScanId = require("../utils/generateScanId");
const { scanRepository } = require("../services/githubService");
const { saveScanResults } = require("../services/scanResultService");
const {
    createScanRecord,
    getScanReportByScanId,
    getAllScansFromSupabase,
    updateScanStatus,
} = require("../services/supabaseService");

// ======================================================
// Create Scan
// POST /api/scan
// ======================================================

const createScan = async (req, res) => {
    try {
        const { repositoryUrl } = req.body;

        // Validate input
        if (!repositoryUrl) {
            return res.status(400).json({
                success: false,
                message: "Repository URL is required.",
            });
        }

        if (typeof repositoryUrl !== "string") {
            return res.status(400).json({
                success: false,
                message: "Repository URL must be a string.",
            });
        }

        const trimmedUrl = repositoryUrl.trim();

        if (!validateGitHubRepository(trimmedUrl)) {
            return res.status(400).json({
                success: false,
                message: "Invalid GitHub Repository URL. Expected format: https://github.com/owner/repo",
            });
        }

        // Create scan record in Supabase
        const scanId = generateScanId();

        await createScanRecord({
            scanId,
            repositoryUrl: trimmedUrl,
            status: "Scanning",
            totalDependencies: 0,
            vulnerabilitiesFound: 0,
        });

        console.log("\n==================================");
        console.log("========== START SCAN ==========");
        console.log("==================================");
        console.log(`Scan ID: ${scanId}`);
        console.log(`Repository: ${trimmedUrl}`);

        // Run the scan
        console.log("1. Cloning repository...");

        const scanResult = await scanRepository(trimmedUrl);

        console.log("\n========== GITHUB SERVICE RESULT ==========");
        console.log(`Success: ${scanResult.success}`);

        if (!scanResult.success) {
            await updateScanStatus(scanId, "Failed");

            return res.status(500).json({
                success: false,
                message: scanResult.message || "Repository scan failed.",
            });
        }

        // Save results to Supabase
        console.log("3. Saving scan results to Supabase...");

        const saveResult = await saveScanResults(
            scanId,
            trimmedUrl,
            scanResult
        );

        if (!saveResult.success) {
            await updateScanStatus(scanId, "Failed");

            return res.status(500).json({
                success: false,
                message: saveResult.message || "Failed to save scan results to Supabase.",
            });
        }

        // Fetch the updated scan from Supabase
        const updatedReport = await getScanReportByScanId(scanId);

        console.log("==================================");
        console.log("SCAN COMPLETED");
        console.log(`Dependencies: ${updatedReport?.totalDependencies}`);
        console.log(`Vulnerabilities: ${updatedReport?.vulnerabilitiesFound}`);
        console.log(`Security Score: ${updatedReport?.securityScore}`);
        console.log("==================================");

        return res.status(201).json({
            success: true,
            message: "Repository scanned successfully.",
            data: updatedReport,
        });

    } catch (error) {
        console.error("Scan Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred during the scan.",
        });
    }
};

// ======================================================
// Get All Scans
// GET /api/scan
// ======================================================

const getAllScans = async (req, res) => {
    try {
        const scans = await getAllScansFromSupabase();

        return res.status(200).json({
            success: true,
            total: scans.length,
            data: scans,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve scans.",
        });
    }
};

// ======================================================
// Get Scan By Scan ID
// GET /api/scan/:scanId
// ======================================================

const getScanById = async (req, res) => {
    try {
        const scan = await getScanReportByScanId(req.params.scanId);

        if (!scan) {
            return res.status(404).json({
                success: false,
                message: "Scan not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: scan,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve scan.",
        });
    }
};

module.exports = {
    createScan,
    getAllScans,
    getScanById,
};