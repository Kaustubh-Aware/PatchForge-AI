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
};