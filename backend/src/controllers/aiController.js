const Scan = require("../models/Scan");

const getAIAnalysis = async (req, res) => {
    try {

        const { scanId } = req.params;

        const scan = await Scan.findOne({ scanId });

        if (!scan) {
            return res.status(404).json({
                success: false,
                message: "Scan not found."
            });
        }

        return res.status(200).json({
            success: true,
            scanId: scan.scanId,
            repositoryUrl: scan.repositoryUrl,
            aiAnalysis: scan.aiAnalysis
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getAIAnalysis
};