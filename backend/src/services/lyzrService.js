const axios = require("axios");
const fs = require("fs");

const analyzeVulnerabilities = async (vulnerablePackages) => {

    try {

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
            user_id: "rohandave1102@gmail.com",
            agent_id: process.env.LYZR_AGENT_ID,
            session_id: "6a6f077197956da4271a0556-n753pzyl",
            message: prompt
        };

        const response = await axios.post(
            process.env.LYZR_API_URL,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.LYZR_API_KEY
                }
            }
        );

        fs.writeFileSync(
            "./lyzr-success.json",
            JSON.stringify(response.data, null, 2)
        );

        return {
            success: true,
            analysis: response.data
        };

    } catch (error) {

        const errorData = {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        };

        fs.writeFileSync(
            "./lyzr-error.json",
            JSON.stringify(errorData, null, 2)
        );

        return {
            success: false,
            message: error.message
        };

    }

};

module.exports = {
    analyzeVulnerabilities
};