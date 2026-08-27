/**
 * Strict GitHub Repository URL Validator and Sanitizer
 * Blocks root links like https://github.com from crashing the backend.
 * 
 * @param {string} url - Raw URL string from user input
 * @returns {string|null} Standardized clean URL or null if invalid
 */
const validateGitHubRepository = (url) => {
    if (!url || typeof url !== "string") return null;

    try {
        // Remove trailing slashes completely
        let cleanedUrl = url.trim().replace(/\/+$/, "");

        // Auto-add protocol if missing
        if (!cleanedUrl.startsWith("http://") && !cleanedUrl.startsWith("https://")) {
            cleanedUrl = "https://" + cleanedUrl;
        }

        const parsedUrl = new URL(cleanedUrl);

        // Ensure host is exactly github.com or www.github.com
        const host = parsedUrl.hostname.toLowerCase();
        if (host !== "github.com" && host !== "www.github.com") {
            return null;
        }

        // Split the path to check the segments
        // Example: "/facebook/react" -> ["facebook", "react"]
        const pathSegments = parsedUrl.pathname.split("/").filter(s => s.length > 0);

        // A valid repository target must have at least 2 path segments (owner and repo).
        // If it has .git suffix, strip it
        if (pathSegments.length < 2) {
            return null;
        }

        const owner = pathSegments[0];
        const repo = pathSegments[1].replace(/\.git$/, "");

        if (!owner || !repo) {
            return null;
        }

        // Return a perfectly formatted URL
        return `https://github.com/${owner}/${repo}`;
    } catch (e) {
        return null;
    }
};

module.exports = validateGitHubRepository;
