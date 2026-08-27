const fs = require("fs"); 
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
// 1. Create Scan (Standard Synchronous Endpoint)
// POST /api/scan
// ======================================================
const createScan = async (req, res) => {
    let folderToCleanup = null; 

    try {
        const { repositoryUrl } = req.body;

        if (!repositoryUrl) {
            return res.status(400).json({ success: false, message: "Repository URL is required." });
        }

        if (typeof repositoryUrl !== "string") {
            return res.status(400).json({ success: false, message: "Repository URL must be a string." });
        }

        const trimmedUrl = repositoryUrl.trim();
        const sanitizedUrl = validateGitHubRepository(trimmedUrl);

        if (!sanitizedUrl) {
            return res.status(400).json({
                success: false,
                message: "Invalid GitHub Repository URL. Expected format: https://github.com",
            });
        }

        const scanId = generateScanId();

        await createScanRecord({
            scanId,
            repositoryUrl: sanitizedUrl,
            status: "Scanning",
            totalDependencies: 0,
            vulnerabilitiesFound: 0,
        });

        console.log("\n==================================");
        console.log("========== START SCAN ==========");
        console.log("==================================");
        console.log(`Scan ID: ${scanId}`);
        console.log(`Repository: ${sanitizedUrl}`);

        console.log("1. Cloning repository...");
        const scanResult = await scanRepository(sanitizedUrl);

        console.log("\n========== GITHUB SERVICE RESULT ==========");
        console.log(`Success: ${scanResult.success}`);

        if (!scanResult.success) {
            await updateScanStatus(scanId, "Failed");
            return res.status(500).json({
                success: false,
                message: scanResult.message || "Repository scan failed.",
            });
        }

        if (scanResult.repositoryPath) {
            folderToCleanup = scanResult.repositoryPath;
        }

        const standardizedResult = {
            ...scanResult,
            vulnerablePackages: scanResult.vulnerablePackages || [],
            dependencies: scanResult.dependencies || [],
            vulnerabilitiesFound: scanResult.vulnerabilitiesFound || 0
        };

        console.log("3. Saving scan results to Supabase...");
        const saveResult = await saveScanResults(scanId, sanitizedUrl, standardizedResult);

        if (!saveResult.success) {
            await updateScanStatus(scanId, "Failed");
            return res.status(500).json({
                success: false,
                message: saveResult.message || "Failed to save scan results to Supabase.",
            });
        }

        const updatedReport = await getScanReportByScanId(scanId);

        console.log("==================================");
        console.log("SCAN COMPLETED");
        console.log(`Dependencies: ${updatedReport?.totalDependencies}`);
        console.log(`Vulnerabilities: ${updatedReport?.vulnerabilitiesFound}`);
        console.log("==================================");

        if (folderToCleanup && fs.existsSync(folderToCleanup)) {
            try {
                console.log(`自动清理: Deleting temporary folder: ${folderToCleanup}`);
                fs.rmSync(folderToCleanup, { recursive: true, force: true });
            } catch (err) {
                console.error("⚠ Cleanup warning:", err.message);
            }
        }

        return res.status(201).json({
            success: true,
            message: "Repository scanned successfully.",
            data: updatedReport,
        });

    } catch (error) {
        console.error("Scan Error:", error.message);
        if (folderToCleanup && fs.existsSync(folderToCleanup)) {
            try { fs.rmSync(folderToCleanup, { recursive: true, force: true }); } catch (e){}
        }
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred during the scan.",
        });
    }
};

// ======================================================
// 2. Real-Time Asynchronous Stream Scan Hub (SSE)
// GET /api/scan/stream?repositoryUrl=...
// ======================================================
const streamScan = async (req, res) => {
    const { repositoryUrl } = req.query;
    let folderToCleanup = null;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const sendProgress = (status, progress, message, payload = null) => {
        res.write(`data: ${JSON.stringify({ success: true, status, progress, message, ...payload })}\n\n`);
    };

    try {
        if (!repositoryUrl) {
            res.write(`data: ${JSON.stringify({ success: false, message: "Repository URL is required." })}\n\n`);
            return res.end();
        }

        const trimmedUrl = repositoryUrl.trim();
        const sanitizedUrl = validateGitHubRepository(trimmedUrl);

        if (!sanitizedUrl) {
            res.write(`data: ${JSON.stringify({ success: false, message: "Invalid or unsupported format. Expected: https://github.com" })}\n\n`);
            return res.end();
        }

        sendProgress("Initializing", 10, "Setting up real-time secure scanning sandbox workspace...");
        const scanId = generateScanId();

        await createScanRecord({
            scanId,
            repositoryUrl: sanitizedUrl,
            status: "Scanning",
            totalDependencies: 0,
            vulnerabilitiesFound: 0,
        });

        sendProgress("Cloning", 30, "Performing optimized shallow clone from GitHub repository endpoints...");
        const scanResult = await scanRepository(sanitizedUrl);

        if (!scanResult || !scanResult.success) {
            await updateScanStatus(scanId, "Failed");
            res.write(`data: ${JSON.stringify({ success: false, message: scanResult?.message || "Repository clone failed." })}\n\n`);
            return res.end();
        }

        if (scanResult.repositoryPath) {
            folderToCleanup = scanResult.repositoryPath;
        }

        const standardizedResult = {
            ...scanResult,
            vulnerablePackages: scanResult.vulnerablePackages || [],
            dependencies: scanResult.dependencies || [],
            vulnerabilitiesFound: scanResult.vulnerabilitiesFound || 0
        };

        sendProgress("Parsing", 60, `Deep checking dependency structures (${standardizedResult.projectType || 'Ecosystem'})...`);
        
        sendProgress("Persisting", 85, "Uploading vulnerability database logs directly to Supabase storage...");
        const saveResult = await saveScanResults(scanId, sanitizedUrl, standardizedResult);

        if (!saveResult || !saveResult.success) {
            await updateScanStatus(scanId, "Failed");
            res.write(`data: ${JSON.stringify({ success: false, message: "Failed to persist security records." })}\n\n`);
            return res.end();
        }

        const updatedReport = await getScanReportByScanId(scanId);

        sendProgress("Completed", 100, "Scan finished successfully!", { data: updatedReport });
        res.end();

    } catch (error) {
        console.error("Stream Connection Error Loop:", error.message);
        res.write(`data: ${JSON.stringify({ success: false, message: `Streaming processing error: ${error.message}` })}\n\n`);
        res.end();
    } finally {
        if (folderToCleanup && fs.existsSync(folderToCleanup)) {
            try {
                console.log(`🧹 Stream Cleanup: Evicting storage footprint at: ${folderToCleanup}`);
                fs.rmSync(folderToCleanup, { recursive: true, force: true });
            } catch (err) {}
        }
    }
};

// ======================================================
// 3. Get All Scans
// GET /api/scan
// ======================================================
const getAllScans = async (req, res) => {
    try {
        const scans = await getAllScansFromSupabase();
        return res.status(200).json({ success: true, total: scans.length, data: scans });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to retrieve scans." });
    }
};

// ======================================================
// 4. Get Scan By Scan ID
// GET /api/scan/:scanId
// ======================================================
const getScanById = async (req, res) => {
    try {
        const scan = await getScanReportByScanId(req.params.scanId);
        if (!scan) return res.status(404).json({ success: false, message: "Scan not found." });
        return res.status(200).json({ success: true, data: scan });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to retrieve scan." });
    }
};

module.exports = {
    createScan,
    streamScan,
    getAllScans,
    getScanById,
};
