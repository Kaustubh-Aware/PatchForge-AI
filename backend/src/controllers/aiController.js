const store = require("../store/store");

// ============================================
// Get AI Analysis by Scan ID
// GET /api/ai/:scanId
// ============================================

const getAIAnalysis = async (req, res) => {
    try {
        const { scanId } = req.params;

        const scan = store.findScan(scanId);

        if (!scan) {
            return res.status(404).json({
                success: false,
                message: "Scan not found.",
            });
        }

        return res.status(200).json({
            success: true,
            scanId: scan.scanId,
            repositoryUrl: scan.repositoryUrl,
            aiAnalysis: scan.aiAnalysis || null,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve AI analysis.",
        });
    }
};

module.exports = {
    getAIAnalysis,
};