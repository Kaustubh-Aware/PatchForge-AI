const store = require("../store/store");
const {
    normalizeSeverity,
    calculateSecurityScore,
    getScoreLabel,
} = require("../utils/severityCalculator");

// ======================================
// Get Complete Report
// GET /api/report/:scanId
// ======================================

const getReportByScanId = async (req, res) => {
    try {
        const { scanId } = req.params;

        // Get Scan
        const scan = store.findScan(scanId);

        if (!scan) {
            return res.status(404).json({
                success: false,
                message: "Scan not found.",
            });
        }

        // Get Vulnerabilities
        const vulnerabilities = store.findVulnerabilities(scanId);

        // Normalize severity on all vulnerabilities
        const normalizedVulnerabilities = vulnerabilities.map((v) => ({
            ...v,
            severity: normalizeSeverity(v.severity),
        }));

        return res.status(200).json({
            success: true,
            report: {
                scanId: scan.scanId,
                repositoryUrl: scan.repositoryUrl,
                status: scan.status,
                totalDependencies: scan.totalDependencies,
                vulnerabilitiesFound: scan.vulnerabilitiesFound,
                severityCounts: scan.severityCounts,
                securityScore: scan.securityScore,
                scoreLabel: getScoreLabel(scan.securityScore),
                aiAnalysis: scan.aiAnalysis,
                startedAt: scan.startedAt,
                completedAt: scan.completedAt,
                createdAt: scan.createdAt,
                vulnerabilities: normalizedVulnerabilities,
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