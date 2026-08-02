<<<<<<< HEAD
import API from "./apiServices";

// Create a new scan
export const createScan = async (repositoryUrl) => {
  const response = await API.post("/scan", {
    repositoryUrl,
  });

  return response.data;
};

// Get scan details
export const getScanById = async (scanId) => {
  const response = await API.get(`/scan/${scanId}`);
  return response.data;
=======
import api from "./apiService";

// ======================================================
// Start Repository Scan
// POST /api/scan
// ======================================================

export const createScan = async (repositoryUrl) => {

    try {

        const response = await api.post("/scan", {

            repositoryUrl

        });

        return response.data;

    }

    catch (error) {

        throw (

            error.response?.data ||

            {

                success: false,

                message: "Failed to start repository scan."

            }

        );

    }

};


// ======================================================
// Get All Scans
// GET /api/scan
// ======================================================

export const getAllScans = async () => {

    try {

        const response = await api.get("/scan");

        return response.data;

    }

    catch (error) {

        throw (

            error.response?.data ||

            {

                success: false,

                message: "Unable to fetch scan history."

            }

        );

    }

};


// ======================================================
// Get Scan By ID
// GET /api/scan/:scanId
// ======================================================

export const getScanById = async (scanId) => {

    try {

        const response = await api.get(

            `/scan/${scanId}`

        );

        return response.data;

    }

    catch (error) {

        throw (

            error.response?.data ||

            {

                success: false,

                message: "Unable to fetch scan details."

            }

        );

    }

};


// ======================================================
// Delete Scan (Future Ready)
// ======================================================

export const deleteScan = async (scanId) => {

    try {

        const response = await api.delete(

            `/scan/${scanId}`

        );

        return response.data;

    }

    catch (error) {

        throw (

            error.response?.data ||

            {

                success: false,

                message: "Unable to delete scan."

            }

        );

    }

};

export const getVulnerabilities = async (scanId) => {
  try {
    const response = await api.get(`/vulnerabilities/${scanId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch vulnerabilities.",
      }
    );
  }
>>>>>>> d00d74bb08a6a606256f3287d19cf131e9ab6b4d
};