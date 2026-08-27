import api from "./apiService";

// ======================================================
// Get Complete Scan Report
// ======================================================
export const getReport = async (scanId) => {
  try {
    const response = await api.get(`/report/${scanId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch report.",
      }
    );
  }
};

// ======================================================
// Download Report (JSON Export Framework)
// ======================================================
export const downloadReport = async (scanId, repoUrl, vulnerabilities = []) => {
  try {
    if (!vulnerabilities || vulnerabilities.length === 0) {
      alert("No vulnerabilities found to export for this report.");
      return false;
    }

    // Isolate repo name from URL string
    const cleanRepoName = repoUrl
      ? repoUrl.replace(/\/+$/, "").split("/").pop()
      : "repository";

    // Build the structured security context object
    const reportExportPayload = {
      platform: "PatchForge AI Cybersecurity Platform",
      scanId: scanId,
      repositoryUrl: repoUrl,
      exportedAt: new Date().toLocaleString(),
      totalVulnerabilitiesCount: vulnerabilities.length,
      vulnerabilitiesList: vulnerabilities.map((v) => ({
        vulnerabilityId: v.vulnerabilityId || "UNKNOWN-CVE",
        packageName: v.packageName || "unknown",
        installedVersion: v.installedVersion || "unknown",
        fixedVersion: v.fixedVersion || "N/A",
        severityLevel: v.severity || "UNKNOWN",
        cvssBaseScore: v.cvssScore || "—",
        executiveSummary: v.summary || "No summary profile generated.",
      })),
    };

    // Serialize payload and generate instant client-side download anchor
    const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportExportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    
    downloadAnchor.setAttribute("href", dataString);
    downloadAnchor.setAttribute("download", `PatchForge_Report_${cleanRepoName}_${scanId}.json`);
    document.body.appendChild(downloadAnchor);
    
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  } catch (err) {
    console.error("Critical failure during scan report extraction:", err);
    alert("Failed to export security report files.");
    return false;
  }
};

// ======================================================
// AI Insights & Patch Suggestions (Future fallbacks)
// ======================================================
export const getAIInsights = async () => {
  console.warn("AI Insights standalone hook not implemented.");
  return null;
};

export const getPatchSuggestions = async () => {
  console.warn("Patch Suggestions standalone hook not implemented.");
  return null;
};
