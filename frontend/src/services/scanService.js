import api from "./apiService";

/* ===========================================================
   PATCHFORGE AI
   Scan Service
=========================================================== */

/**
 * Start Repository Scan
 * POST /api/scan
 */
export const createScan = async (repositoryUrl) => {
  try {
    const { data } = await api.post("/scan", {
      repositoryUrl,
    });

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to start repository scan.",
      }
    );
  }
};

/**
 * Get All Previous Scans
 * GET /api/scan
 */
export const getAllScans = async () => {
  try {
    const { data } = await api.get("/scan");

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch scan history.",
      }
    );
  }
};

/**
 * Get Scan Details
 * GET /api/scan/:scanId
 */
export const getScanById = async (scanId) => {
  try {
    const { data } = await api.get(`/scan/${scanId}`);

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch scan details.",
      }
    );
  }
};

/**
 * Get Vulnerabilities
 * GET /api/vulnerabilities/:scanId
 */
export const getVulnerabilities = async (scanId) => {
  try {
    const { data } = await api.get(`/vulnerabilities/${scanId}`);

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch vulnerabilities.",
      }
    );
  }
};

/**
 * Get Report
 * GET /api/report/:scanId
 */
export const getReport = async (scanId) => {
  try {
    const { data } = await api.get(`/report/${scanId}`);

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch report.",
      }
    );
  }
};

/**
 * Get Dashboard Stats
 * GET /api/stats
 */
export const getStats = async () => {
  try {
    const { data } = await api.get("/stats");

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch stats.",
      }
    );
  }
};