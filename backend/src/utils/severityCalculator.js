// ======================================================
// PatchForge AI — Severity Calculator
// ======================================================
// Normalizes severity levels and calculates security scores
// from actual vulnerability data.
// ======================================================

// ======================================================
// Normalize Severity
// ======================================================
// OSV returns "MODERATE" but we standardize to "MEDIUM".
// Also handles case variations.
// ======================================================

const normalizeSeverity = (severity) => {
    if (!severity || typeof severity !== "string") return "UNKNOWN";

    const upper = severity.toUpperCase().trim();

    const mapping = {
        CRITICAL: "CRITICAL",
        HIGH: "HIGH",
        MODERATE: "MEDIUM",
        MEDIUM: "MEDIUM",
        LOW: "LOW",
        UNKNOWN: "UNKNOWN",
    };

    return mapping[upper] || "UNKNOWN";
};

// ======================================================
// Calculate Severity Counts
// ======================================================
// Counts vulnerabilities per normalized severity level.
// ======================================================

const calculateSeverityCounts = (vulnerabilities) => {
    const counts = {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
    };

    if (!Array.isArray(vulnerabilities)) return counts;

    vulnerabilities.forEach((vuln) => {
        const severity = normalizeSeverity(
            vuln?.severity ||
            vuln?.database_specific?.severity
        );

        if (counts[severity] !== undefined) {
            counts[severity]++;
        }
    });

    return counts;
};

// ======================================================
// Calculate Security Score
// ======================================================
// Computes a 0–100 score based on vulnerability severity.
//
// Formula:
//   penalty = (CRITICAL × 15) + (HIGH × 10) + (MEDIUM × 5) + (LOW × 2)
//   score = max(0, 100 - penalty)
//
// A repository with zero vulnerabilities scores 100.
// Each critical finding reduces the score by 15 points.
// ======================================================

const calculateSecurityScore = (severityCounts) => {
    if (!severityCounts) return 100;

    const penalty =
        (severityCounts.CRITICAL || 0) * 15 +
        (severityCounts.HIGH || 0) * 10 +
        (severityCounts.MEDIUM || 0) * 5 +
        (severityCounts.LOW || 0) * 2;

    return Math.max(0, 100 - penalty);
};

// ======================================================
// Get Score Label
// ======================================================

const getScoreLabel = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 50) return "Fair";
    if (score >= 25) return "Poor";
    return "Critical";
};

// ======================================================
// Export
// ======================================================

module.exports = {
    normalizeSeverity,
    calculateSeverityCounts,
    calculateSecurityScore,
    getScoreLabel,
};
