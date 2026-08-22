const axios = require("axios");

// ======================================================
// Analyze Vulnerabilities using Lyzr AI
// ======================================================

const analyzeVulnerabilities = async (vulnerablePackages) => {
    try {
        // Skip if no vulnerable packages
        if (!vulnerablePackages || vulnerablePackages.length === 0) {
            return {
                success: true,
                analysis: "No vulnerabilities detected. The repository appears to be secure.",
            };
        }

        // Check if Lyzr config exists
        if (!process.env.LYZR_API_URL || !process.env.LYZR_AGENT_ID || !process.env.LYZR_API_KEY) {
            console.log("⚠ Lyzr AI not configured. Skipping AI analysis.");
            return {
                success: false,
                message: "AI service is not configured.",
            };
        }

        const prompt = `
You are PatchForge AI Security Assistant.

Analyze these vulnerabilities:

${JSON.stringify(vulnerablePackages, null, 2)}

Return:
- Package
- Severity
- Risk
- Safe Version
- Remediation
- Priority
`;

        const body = {
            user_id: "patchforge@patchforge.ai",
            agent_id: process.env.LYZR_AGENT_ID,
            session_id: `${process.env.LYZR_AGENT_ID}-patchforge`,
            message: prompt,
        };

        const response = await axios.post(
            process.env.LYZR_API_URL,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.LYZR_API_KEY,
                },
                timeout: 8000, // 8 second timeout
            }
        );

        // Safely extract analysis
        const analysis = response?.data?.response ||
                         response?.data?.message ||
                         response?.data ||
                         null;

        if (!analysis) {
            return {
                success: false,
                message: "AI service returned empty response.",
            };
        }

        console.log("✅ Lyzr AI Analysis completed successfully");

        return {
            success: true,
            analysis,
        };

    } catch (error) {
        console.log("⚠ Lyzr AI Analysis failed:", error?.message || "Unknown error");

        // Log detailed error for debugging but don't crash
        if (error?.response) {
            console.log("   Status:", error.response.status);
        }

        return {
            success: false,
            message: error?.message || "AI analysis service is temporarily unavailable.",
        };
    }
};

module.exports = {
    analyzeVulnerabilities,
};