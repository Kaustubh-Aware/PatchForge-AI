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

        // Ensure host is exactly github.com
        if (parsedUrl.hostname !== "github.com" && parsedUrl.hostname !== "://github.com") {
            return null;
        }

        // Split the path to check the segments
        // Example: "/facebook/react" -> ["facebook", "react"]
        const pathSegments = parsedUrl.pathname.split("/").filter(s => s.length > 0);

        // CRITICAL FIX: A valid repository target must have exactly 2 path segments.
        // 0 segments (https://github.com) or 1 segment (https://github.com) will return null.
        if (pathSegments.length !== 2) {
            return null;
        }

        const owner = pathSegments[0];
        const repo = pathSegments[1];

        // Return a perfectly formatted URL
        return `https://github.com{owner}/${repo}`;
    } catch (e) {
        return null;
    }
};

module.exports = validateGitHubRepository;
