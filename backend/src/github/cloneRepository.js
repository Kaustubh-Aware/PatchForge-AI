const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

// ======================================================
// Clone GitHub Repository (Speed Optimized for Massive Repos)
// ======================================================
const cloneRepository = async (repositoryUrl) => {

    try {

        // ---------------------------------------
        // Create temp folder safely
        // ---------------------------------------
        const cloneRoot = path.join(__dirname, "../../temp");

        if (!fs.existsSync(cloneRoot)) {
            fs.mkdirSync(cloneRoot, { recursive: true });
        }

        // ---------------------------------------
        // Create unique repository folder
        // ---------------------------------------
        const repositoryName = "repo-" + Date.now();

        const clonePath = path.join(
            cloneRoot,
            repositoryName
        );

        console.log("==================================");
        console.log("Clone Path:", clonePath);
        console.log("Repository:", repositoryUrl);

        // ---------------------------------------
        // Initialize Git Engine
        // ---------------------------------------
        const git = simpleGit();

        console.log("Starting optimized shallow clone...");

        // ---------------------------------------
        // Shallow Clone Configuration
        // Prevents server freezes on massive repositories 
        // by discarding tags, branches, and historical logs.
        // ---------------------------------------
        await git.clone(
            repositoryUrl,
            clonePath,
            [
                "--depth", "1",           // Only pull down the latest absolute commit
                "--single-branch",        // Completely ignore secondary branches
                "--no-tags"               // Discard historical release release tags footprint
            ]
        );

        console.log("✅ Repository cloned successfully.");
        console.log("==================================");

        return clonePath;

    }

    catch (error) {

        console.error("==================================");
        console.error("Clone Repository Error");
        console.error(error.message || error);
        console.error("==================================");

        throw error;

    }

};

module.exports = cloneRepository;
