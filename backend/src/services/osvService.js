const axios = require("axios");

// ======================================================
// OSV API
// ======================================================

const OSV_API = "https://api.osv.dev/v1/query";

// ======================================================
// Scan Dependencies Against OSV (Concurrent)
// ======================================================

const scanSingleDependency = async (dependency) => {
    try {
        // Clean version string (e.g. ^4.17.21 -> 4.17.21)
        const cleanVersion = (dependency.version || "").replace(/^[^\d]*/, "");

        const queryPayload = {
            package: {
                name: dependency.name,
                ecosystem: "npm",
            },
        };

        if (cleanVersion) {
            queryPayload.version = cleanVersion;
        }

        const response = await axios.post(
            OSV_API,
            queryPayload,
            { timeout: 8000 }
        );

        const vulns = response.data?.vulns || [];

        if (vulns.length > 0) {
            return {
                packageName: dependency.name,
                version: dependency.version,
                vulnerabilities: vulns,
            };
        }

        return null;
    } catch (error) {
        // Silently skip or log individual dependency query errors
        return null;
    }
};

const scanDependencies = async (dependencies) => {
    try {
        if (!Array.isArray(dependencies) || dependencies.length === 0) {
            return {
                success: true,
                totalDependencies: 0,
                vulnerabilitiesFound: 0,
                vulnerablePackages: [],
            };
        }

        // Query OSV concurrently in parallel
        const results = await Promise.all(
            dependencies.map((dep) => scanSingleDependency(dep))
        );

        const vulnerablePackages = results.filter(Boolean);

        const vulnerabilitiesFound = vulnerablePackages.reduce(
            (sum, pkg) => sum + (pkg.vulnerabilities?.length || 0),
            0
        );

        return {
            success: true,
            totalDependencies: dependencies.length,
            vulnerabilitiesFound,
            vulnerablePackages,
        };
    } catch (error) {
        console.error("OSV Service Error:", error.message);

        return {
            success: false,
            message: error.message,
            totalDependencies: dependencies?.length || 0,
            vulnerabilitiesFound: 0,
            vulnerablePackages: [],
        };
    }
};

module.exports = {
    scanDependencies,
};