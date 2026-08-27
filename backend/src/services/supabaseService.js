const fs = require("fs");
const path = require("path");

// =========================================================================
// SAFE RELATIVE IMPORT HANDLER
// Dynamically verifies file variations to prevent MODULE_NOT_FOUND crashes
// =========================================================================
let supabase;
const possiblePaths = [
    path.join(__dirname, "../config/supabaseClient.js"),
    path.join(__dirname, "../config/supabase.js"),
    path.join(__dirname, "../config/supabaseClient"),
    path.join(__dirname, "../config/supabase")
];

for (const targetPath of possiblePaths) {
    if (fs.existsSync(targetPath) || fs.existsSync(targetPath + ".js")) {
        supabase = require(targetPath);
        break;
    }
}

// Fallback safety try-catch block if file extension checking maps oddly on Windows
if (!supabase) {
    try {
        supabase = require("../config/supabase");
    } catch (e) {
        try {
            supabase = require("../config/supabaseClient");
        } catch (err) {
            console.error("❌ CRITICAL: Could not find your Supabase client configuration file inside src/config/ directory!");
            console.error("Please verify if the file is named 'supabase.js' or 'supabaseClient.js'.");
        }
    }
}

/**
 * Creates the initial tracking record for a repository scan in the Supabase database.
 * Safeguarded with naming fallbacks to match the schema layout precisely.
 */
const createScanRecord = async (scanData) => {
    try {
        console.log(`Supabase Service: Creating initial scan tracking row for ID: ${scanData.scanId}`);

        // Standardize properties to match your exact Supabase PostgreSQL column layout
        const payload = {
            scan_id: scanData.scanId,
            repository_url: scanData.repositoryUrl,
            status: scanData.status || "Scanning",
            total_dependencies: scanData.totalDependencies || 0,
            vulnerabilities_found: scanData.vulnerabilitiesFound || 0
        };

        const { data, error } = await supabase
            .from("scans")
            .insert([payload])
            .select();

        if (error) {
            console.error("❌ Supabase table insertion rejected the schema payload:", error.message);
            throw new Error(`Database insert error: ${error.message}`);
        }

        console.log("✔ Initial scan record successfully generated inside database tracking layers.");
        return data;

    } catch (error) {
        console.error("❌ createScanRecord exception:", error.message);
        throw new Error(`Failed to create scan in Supabase: ${error.message}`);
    }
};

/**
 * Updates the status column of an existing scan record dynamically.
 */
const updateScanStatus = async (scanId, status) => {
    try {
        const { data, error } = await supabase
            .from("scans")
            .update({ status })
            .eq("scan_id", scanId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error(`❌ Failed to update scan status for ID ${scanId}:`, error.message);
        return { success: false, message: error.message };
    }
};

/**
 * Fetches a single completed scan report and its parsed statistics by its Scan ID.
 */
const getScanReportByScanId = async (scanId) => {
    try {
        const { data, error } = await supabase
            .from("scans")
            .select("*")
            .eq("scan_id", scanId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`❌ Failed to retrieve scan report for ID ${scanId}:`, error.message);
        return null;
    }
};

/**
 * Retrieves all stored scan logs from the Supabase cluster.
 */
const getAllScansFromSupabase = async () => {
    try {
        const { data, error } = await supabase
            .from("scans")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("❌ Failed to retrieve all scans from Supabase:", error.message);
        throw error;
    }
};

module.exports = {
    createScanRecord,
    updateScanStatus,
    getScanReportByScanId,
    getAllScansFromSupabase,
};
