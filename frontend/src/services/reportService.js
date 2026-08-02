import api from "./apiService";

// ======================================================
// Get Complete Scan Report
// Uses existing Vulnerability/Scan API
// ======================================================

export const getReport = async (scanId) => {

    try {

        const response = await api.get(`/report/${scanId}`);

        return response.data;

    }

    catch (error) {

        throw (

            error.response?.data ||

            {

                success: false,

                message: "Unable to fetch report."

            }

        );

    }

};

// ======================================================
// Download Report (Future)
// ======================================================

export const downloadReport = async () => {

    console.warn(

        "Download report is not implemented yet."

    );

    return null;

};

// ======================================================
// AI Insights (Future)
// ======================================================

export const getAIInsights = async () => {

    console.warn(

        "AI Insights endpoint not implemented."

    );

    return null;

};

// ======================================================
// Patch Suggestions (Future)
// ======================================================

export const getPatchSuggestions = async () => {

    console.warn(

        "Patch Suggestions endpoint not implemented."

    );

    return null;

};