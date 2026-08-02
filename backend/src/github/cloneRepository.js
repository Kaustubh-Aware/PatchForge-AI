const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

// ======================================================
// Clone GitHub Repository
// ======================================================

const cloneRepository = async (repositoryUrl) => {

    try {

        // ---------------------------------------
        // Create temp folder
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
        // Initialize Git
        // ---------------------------------------

        const git = simpleGit();

        console.log("Starting shallow clone...");

        // ---------------------------------------
        // Shallow Clone (Much Faster)
        // ---------------------------------------

        await git.clone(
            repositoryUrl,
            clonePath,
            [
                "--depth",
                "1"
            ]
        );

        console.log("✅ Repository cloned successfully.");
        console.log("==================================");

        return clonePath;

    }

    catch (error) {

        console.error("==================================");
        console.error("Clone Repository Error");
        console.error(error);
        console.error("==================================");

        throw error;

    }

};

module.exports = cloneRepository;