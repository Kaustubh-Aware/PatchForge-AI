const Scan = require("../models/Scan");
const Vulnerability = require("../models/Vulnerability");

// ======================================
// Get Complete Report
// ======================================

const getReportByScanId = async (req, res) => {
    try {

        const { scanId } = req.params;

        // Get Scan
        const scan = await Scan.findOne({ scanId });

        if (!scan) {
            return res.status(404).json({
                success: false,
                message: "Scan not found."
            });
        }

        // Get Vulnerabilities
        const vulnerabilities = await Vulnerability.find({ scanId });

        return res.status(200).json({
            success: true,

            report: {
                scanId: scan.scanId,
                repositoryUrl: scan.repositoryUrl,
                status: scan.status,
                totalDependencies: scan.totalDependencies,
                vulnerabilitiesFound: scan.vulnerabilitiesFound,
                aiAnalysis: scan.aiAnalysis,
                vulnerabilities
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getReportByScanId
};