const fs = require("fs");
const path = require("path");

// =========================================================================
// 1. ECOSYSTEM FILE PARSERS (Go, Python, Rust strings logic remains safe)
// =========================================================================
const parsePythonRequirements = (content) => {
    const dependencies = [];
    const lines = content.split("\n");
    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith("#") || line.startsWith("-r")) continue;
        const match = line.split(/[==|>=|<=|~=|>]/)[0];
        const name = match ? match.trim() : null;
        let version = "0.0.0";
        if (line.includes("==")) {
            version = line.split("==")[1]?.split(/[#\s]/)[0]?.trim() || "0.0.0";
        }
        if (name) dependencies.push({ name, version });
    }
    return dependencies;
};

const parseGoModules = (content) => {
    const dependencies = [];
    const lines = content.split("\n");
    let inRequireBlock = false;
    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith("//")) continue;
        if (line.startsWith("require (")) { inRequireBlock = true; continue; }
        if (inRequireBlock && line.startsWith(")")) { inRequireBlock = false; continue; }
        if (line.startsWith("require ") && !line.includes("(")) {
            const parts = line.replace("require ", "").split(/\s+/);
            if (parts[0] && parts[1]) dependencies.push({ name: parts[0].trim(), version: parts[1].replace(/^v/, "").trim() });
            continue;
        }
        if (inRequireBlock) {
            const parts = line.split(/\s+/);
            if (parts[0] && parts[1]) dependencies.push({ name: parts[0].trim(), version: parts[1].replace(/^v/, "").trim() });
        }
    }
    return dependencies;
};

const parseRustCargo = (content) => {
    const dependencies = [];
    const lines = content.split("\n");
    let inDeps = false;
    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith("#")) continue;
        if (line.startsWith("[") && line.endsWith("]")) { inDeps = line === "[dependencies]"; continue; }
        if (inDeps && line.includes("=")) {
            const parts = line.split("=");
            const name = parts[0]?.trim();
            let versionRaw = parts[1]?.trim().replace(/['"]/g, "") || "0.0.0";
            if (versionRaw.startsWith("{")) {
                const versionMatch = versionRaw.match(/version\s*=\s*["']([^"']+)["']/);
                versionRaw = versionMatch ? versionMatch[1] : "0.0.0";
            }
            if (name) dependencies.push({ name, version: versionRaw });
        }
    }
    return dependencies;
};

// =========================================================================
// 2. 🔥 NEW CORE UPGRADE: RECURSIVE DEEP DIRECTORY DISCOVERY PROTOCOL
// =========================================================================
const findManifestFiles = (dir, currentDepth = 0, maxDepth = 4) => {
    let discoveredFiles = [];
    
    // Safety guard against runaway loops or infinitely huge structures
    if (currentDepth > maxDepth) return discoveredFiles;

    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });

        for (const item of items) {
            const itemPath = path.join(dir, item.name);

            // Skip heavy, unhelpful system folders instantly to preserve blazing fast speeds
            if (item.isDirectory()) {
                if (["node_modules", ".git", "dist", "build", "target", "vendor", "temp"].includes(item.name)) {
                    continue;
                }
                // Recursively walk deeper down the subfolder pathing layouts
                discoveredFiles = discoveredFiles.concat(findManifestFiles(itemPath, currentDepth + 1, maxDepth));
            } else if (item.isFile()) {
                // Register tracking indicators if structural matches check out
                if (["package.json", "requirements.txt", "go.mod", "Cargo.toml"].includes(item.name)) {
                    discoveredFiles.push({
                        fileName: item.name,
                        filePath: itemPath
                    });
                }
            }
        }
    } catch (err) {
        console.warn(`⚠ Deep Walker skipped path reading due to local restrictions: ${dir}`);
    }

    return discoveredFiles;
};

// =========================================================================
// 3. MAIN DYNAMIC DEPENDENCY SCANNER HANDLER
// =========================================================================
const scanDependencies = async (repositoryPath) => {
    try {
        console.log(`🔍 Mapping deep files across repository root: ${repositoryPath}`);

        // Fire the file crawler strategy to pull all targets in nested environments
        const foundManifests = findManifestFiles(repositoryPath);

        if (foundManifests.length === 0) {
            console.log("❌ Execution Aborted: No matching manifest file discovered anywhere in repository path tree.");
            return {
                success: false,
                message: "No supported dependency file found. (package.json, requirements.txt, go.mod, or Cargo.toml required anywhere in repository layout)."
            };
        }

        // Prioritize what we process if multiple configurations leak through (NPM -> Python -> Go -> Rust)
        const priorityOrder = ["package.json", "requirements.txt", "go.mod", "Cargo.toml"];
        foundManifests.sort((a, b) => priorityOrder.indexOf(a.fileName) - priorityOrder.indexOf(b.fileName));

        const targetManifest = foundManifests[0];
        console.log(`🎯 Targeted Manifest Found at Sub-Path: ${path.relative(repositoryPath, targetManifest.filePath)}`);

        // 1. Process Node.js / NPM Target
        if (targetManifest.fileName === "package.json") {
            console.log("📦 Processing Ecosystem: Node.js (package.json)");
            const fileContent = fs.readFileSync(targetManifest.filePath, "utf8");
            const packageJson = JSON.parse(fileContent);
            const combinedDeps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
            const dependencies = Object.entries(combinedDeps).map(([name, version]) => ({
                name,
                version: version.replace(/^[\^~]/, "")
            }));
            return {
                success: true,
                projectType: "Node.js",
                ecosystem: "npm",
                totalDependencies: dependencies.length,
                dependencies
            };
        }

        // 2. Process Python Target
        if (targetManifest.fileName === "requirements.txt") {
            console.log("🐍 Processing Ecosystem: Python (requirements.txt)");
            const fileContent = fs.readFileSync(targetManifest.filePath, "utf8");
            const dependencies = parsePythonRequirements(fileContent);
            return {
                success: true,
                projectType: "Python",
                ecosystem: "pypi",
                totalDependencies: dependencies.length,
                dependencies
            };
        }

        // 3. Process Go Target
        if (targetManifest.fileName === "go.mod") {
            console.log("🐹 Processing Ecosystem: Go (go.mod)");
            const fileContent = fs.readFileSync(targetManifest.filePath, "utf8");
            const dependencies = parseGoModules(fileContent);
            return {
                success: true,
                projectType: "Go Lang",
                ecosystem: "Go",
                totalDependencies: dependencies.length,
                dependencies
            };
        }

        // 4. Process Rust Target
        if (targetManifest.fileName === "Cargo.toml") {
            console.log("🦀 Processing Ecosystem: Rust (Cargo.toml)");
            const fileContent = fs.readFileSync(targetManifest.filePath, "utf8");
            const dependencies = parseRustCargo(fileContent);
            return {
                success: true,
                projectType: "Rust",
                ecosystem: "crates.io",
                totalDependencies: dependencies.length,
                dependencies
            };
        }

    } catch (error) {
        console.error("Dependency Scanner System Failure:", error.message);
        return {
            success: false,
            message: `Deep parsing failure encountered: ${error.message}`
        };
    }
};

module.exports = scanDependencies;
