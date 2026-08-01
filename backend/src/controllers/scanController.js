const Scan = require("../models/Scan");
const validateGitHubRepository = require("../utils/validateRepository");

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

module.exports = {
    createScan,
};