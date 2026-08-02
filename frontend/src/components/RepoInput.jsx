import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitBranch,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

import "./RepoInput.css";
import { createScan } from "../services/scanService";

function RepoInput() {
  const navigate = useNavigate();

  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateRepository = (url) => {
    const githubRegex =
      /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
    return githubRegex.test(url);
  };

  const handleScan = async () => {
    setError("");

    if (!repositoryUrl.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    if (!validateRepository(repositoryUrl)) {
      setError("Enter a valid public GitHub repository.");
      return;
    }

    try {
      setLoading(true);

      const response = await createScan(repositoryUrl);

      if (response.success) {
        navigate(`/report/${response.data.scanId}`);
      } else {
        setError(response.message || "Scan failed.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Repository scan failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="repo-input-container">

      <div className="repo-card">

        <div className="repo-header">

          <div className="repo-icon">
            <GitBranch size={34} />
          </div>

          <div>
            <h2>GitHub Repository Scanner</h2>
            <p>
              AI-powered dependency & vulnerability analysis
            </p>
          </div>

        </div>

        <div className="repo-form">

          <input
            type="text"
            placeholder="https://github.com/facebook/react"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            disabled={loading}
          />

          <button
            onClick={handleScan}
            disabled={loading}
          >

            {loading ? (
              <>
                <Loader2
                  className="spin"
                  size={18}
                />
                Scanning...
              </>
            ) : (
              <>
                <Search size={18} />
                Scan Repository
              </>
            )}

          </button>

        </div>

        {error && (
          <div className="repo-error">
            {error}
          </div>
        )}

        <div className="repo-footer">

          <Sparkles size={16} />

          <span>
            Powered by PatchForge AI • OSV • Lyzr AI
          </span>

        </div>

      </div>

    </section>
  );
}

export default RepoInput;