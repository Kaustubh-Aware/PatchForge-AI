const Scan = require("../models/Scan");
const validateGitHubRepository = require("../utils/validateRepository");
const generateScanId = require("../utils/generateScanId");

// ======================================================
// Create a New Scan
// ======================================================

const createScan = async (req, res) => {
    try {
        const { repositoryUrl } = req.body;

        // Check if repository URL is provided
        if (!repositoryUrl) {
            return res.status(400).json({
                success: false,
                message: "Repository URL is required",
            });
        }

        // Validate GitHub Repository URL
        if (!validateGitHubRepository(repositoryUrl)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid GitHub repository URL.",
            });
        }

        // Save scan in MongoDB
        const scan = await Scan.create({
            scanId: generateScanId(),
            repositoryUrl,
        });

        return res.status(201).json({
            success: true,
            message: "Scan created successfully",
            data: scan,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// ======================================================
// Get All Scans
// ======================================================

const getAllScans = async (req, res) => {
    try {

        const scans = await Scan.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: scans.length,
            data: scans,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

// ======================================================
// Get Scan By Scan ID
// ======================================================

const getScanById = async (req, res) => {
    try {

        const { scanId } = req.params;

        const scan = await Scan.findOne({ scanId });

        if (!scan) {
            return res.status(404).json({
                success: false,
                message: "Scan not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Scan fetched successfully",
            data: scan,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

// ======================================================
// Export Controllers
// ======================================================

module.exports = {
    createScan,
    getAllScans,
    getScanById,
};