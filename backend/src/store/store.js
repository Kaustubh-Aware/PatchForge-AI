// ======================================================
// PatchForge AI — In-Memory Storage Abstraction
// ======================================================
// This module replaces MongoDB/Mongoose with a simple
// in-memory store. The API surface mirrors Mongoose so
// that replacing with a real database later requires
// only changing this import.
// ======================================================

const scans = new Map();
const vulnerabilities = new Map(); // scanId → [vulnerability]

// ======================================================
// Scan Operations
// ======================================================

const createScan = (scanData) => {
    const now = new Date();
    const scan = {
        scanId: scanData.scanId,
        repositoryUrl: scanData.repositoryUrl,
        status: scanData.status || "Queued",
        totalDependencies: scanData.totalDependencies || 0,
        vulnerabilitiesFound: scanData.vulnerabilitiesFound || 0,
        severityCounts: scanData.severityCounts || {
            CRITICAL: 0,
            HIGH: 0,
            MEDIUM: 0,
            LOW: 0,
        },
        securityScore: scanData.securityScore || 100,
        aiAnalysis: scanData.aiAnalysis || null,
        startedAt: scanData.startedAt || now,
        completedAt: scanData.completedAt || null,
        createdAt: now,
        updatedAt: now,
    };

    scans.set(scan.scanId, scan);

    return { ...scan };
};

const findScan = (scanId) => {
    const scan = scans.get(scanId);
    return scan ? { ...scan } : null;
};

const findAllScans = () => {
    return Array.from(scans.values())
        .map((s) => ({ ...s }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const updateScan = (scanId, updates) => {
    const scan = scans.get(scanId);

    if (!scan) return null;

    const updated = {
        ...scan,
        ...updates,
        updatedAt: new Date(),
    };

    scans.set(scanId, updated);

    return { ...updated };
};

// ======================================================
// Vulnerability Operations
// ======================================================

const createVulnerability = (vulnData) => {
    const now = new Date();
    const vuln = {
        id: `${vulnData.scanId}-${vulnData.vulnerabilityId}-${Date.now()}`,
        scanId: vulnData.scanId,
        packageName: vulnData.packageName,
        installedVersion: vulnData.installedVersion,
        ecosystem: vulnData.ecosystem || "npm",
        vulnerabilityId: vulnData.vulnerabilityId,
        summary: vulnData.summary || "",
        severity: vulnData.severity || "UNKNOWN",
        cvssScore: vulnData.cvssScore || 0,
        fixedVersion: vulnData.fixedVersion || "",
        references: vulnData.references || [],
        createdAt: now,
        updatedAt: now,
    };

    if (!vulnerabilities.has(vulnData.scanId)) {
        vulnerabilities.set(vulnData.scanId, []);
    }

    vulnerabilities.get(vulnData.scanId).push(vuln);

    return { ...vuln };
};

const findVulnerabilities = (scanId) => {
    const vulns = vulnerabilities.get(scanId) || [];
    return vulns.map((v) => ({ ...v }));
};

const getAllVulnerabilities = () => {
    const all = [];
    for (const vulns of vulnerabilities.values()) {
        all.push(...vulns.map((v) => ({ ...v })));
    }
    return all;
};

// ======================================================
// Aggregate Helpers
// ======================================================

const getStats = () => {
    const allScans = findAllScans();
    const completedScans = allScans.filter((s) => s.status === "Completed");

    let totalDependencies = 0;
    let totalVulnerabilities = 0;
    let totalCritical = 0;
    const severityCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };

    completedScans.forEach((scan) => {
        totalDependencies += scan.totalDependencies || 0;
        totalVulnerabilities += scan.vulnerabilitiesFound || 0;

        if (scan.severityCounts) {
            severityCounts.CRITICAL += scan.severityCounts.CRITICAL || 0;
            severityCounts.HIGH += scan.severityCounts.HIGH || 0;
            severityCounts.MEDIUM += scan.severityCounts.MEDIUM || 0;
            severityCounts.LOW += scan.severityCounts.LOW || 0;
        }
    });

    totalCritical = severityCounts.CRITICAL;

    // Average security score across completed scans
    let avgScore = 100;
    if (completedScans.length > 0) {
        const totalScore = completedScans.reduce(
            (sum, s) => sum + (s.securityScore ?? 100),
            0
        );
        avgScore = Math.round(totalScore / completedScans.length);
    }

    return {
        totalScans: allScans.length,
        completedScans: completedScans.length,
        totalDependencies,
        totalVulnerabilities,
        totalCritical,
        severityCounts,
        securityScore: avgScore,
    };
};

// ======================================================
// Export
// ======================================================

module.exports = {
    createScan,
    findScan,
    findAllScans,
    updateScan,
    createVulnerability,
    findVulnerabilities,
    getAllVulnerabilities,
    getStats,
};
