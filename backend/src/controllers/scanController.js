const Scan = require("../models/Scan");

const validateGitHubRepository = require("../utils/validateRepository");
const generateScanId = require("../utils/generateScanId");

const { scanRepository } = require("../services/githubService");
const { saveScanResults } = require("../services/scanResultService");

// ======================================================
// Create Scan
// ======================================================

const createScan = async (req, res) => {
    try {
        const { repositoryUrl } = req.body;

        if (!repositoryUrl) {
            return res.status(400).json({
                success: false,
                message: "Repository URL is required."
            });
        }

        if (!validateGitHubRepository(repositoryUrl)) {
            return res.status(400).json({
                success: false,
                message: "Invalid GitHub Repository URL."
            });
        }

        const scan = await Scan.create({
            scanId: generateScanId(),
            repositoryUrl,
            status: "Scanning",
            totalDependencies: 0,
            vulnerabilitiesFound: 0
        });

        console.log("\n==================================");
        console.log("========== START SCAN ==========");
        console.log("==================================");

        console.log("1. Cloning repository...");

        const scanResult = await scanRepository(repositoryUrl);

        console.log("\n========== GITHUB SERVICE RESULT ==========");
        console.log(JSON.stringify(scanResult, null, 2));

        if (!scanResult.success) {
            await Scan.findOneAndUpdate(
                { scanId: scan.scanId },
                { status: "Failed" }
            );

            return res.status(500).json({
                success: false,
                message: scanResult.message
            });
        }

        console.log("3. Saving scan...");

        console.log("\n========== OSV REPORT ==========");
        console.log(JSON.stringify({
            totalDependencies: scanResult.totalDependencies,
            vulnerabilitiesFound: scanResult.vulnerabilitiesFound,
            vulnerablePackages: scanResult.vulnerablePackages
        }, null, 2));

        const saveResult = await saveScanResults(
            scan.scanId,
            repositoryUrl,
            scanResult
        );

        if (!saveResult.success) {
            return res.status(500).json({
                success: false,
                message: saveResult.message
            });
        }

        const updatedScan = await Scan.findOne({
            scanId: scan.scanId
        });

        console.log("==================================");
        console.log("SCAN COMPLETED");
        console.log("==================================");

        return res.status(201).json({
            success: true,
            message: "Repository scanned successfully.",
            data: updatedScan
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// Get All Scans
// ======================================================

const getAllScans = async (req, res) => {
    try {
        const scans = await Scan.find().sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            total: scans.length,
            data: scans
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// Get Scan By Scan ID
// ======================================================

const getScanById = async (req, res) => {
    try {
        const scan = await Scan.findOne({
            scanId: req.params.scanId
        });

        if (!scan) {
            return res.status(404).json({
                success: false,
                message: "Scan not found."
            });
        }

        return res.json({
            success: true,
            data: scan
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createScan,
    getAllScans,
    getScanById
};