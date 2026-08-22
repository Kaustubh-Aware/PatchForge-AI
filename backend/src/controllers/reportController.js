const { getScanReportByScanId } = require("../services/supabaseService");
const { getScoreLabel } = require("../utils/severityCalculator");

// ======================================
// Get Complete Report
// GET /api/report/:scanId
// ======================================

const getReportByScanId = async (req, res) => {
    try {
        const { scanId } = req.params;

        // Fetch Complete Report from Supabase
        const report = await getScanReportByScanId(scanId);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Scan not found.",
            });
        }

        return res.status(200).json({
            success: true,
            report: {
                scanId: report.scanId,
                repositoryUrl: report.repositoryUrl,
                status: report.status,
                totalDependencies: report.totalDependencies,
                vulnerabilitiesFound: report.vulnerabilitiesFound,
                severityCounts: report.severityCounts,
                securityScore: report.securityScore,
                scoreLabel: report.scoreLabel || getScoreLabel(report.securityScore),
                aiAnalysis: report.aiAnalysis,
                startedAt: report.startedAt,
                completedAt: report.completedAt,
                createdAt: report.createdAt,
                vulnerabilities: report.vulnerabilities || [],
            },
        });

    } catch (error) {
        console.error("Report Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve report.",
        });
    }
};

module.exports = {
    getReportByScanId,
};