const Scan = require("../models/Scan");

const createScan = async (req, res) => {
    try {
        const { repositoryUrl } = req.body;

        if (!repositoryUrl) {
            return res.status(400).json({
                success: false,
                message: "Repository URL is required",
            });
        }

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