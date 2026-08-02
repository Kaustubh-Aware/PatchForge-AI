import { useState } from "react";
import {
  GitBranch,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

import "./RepoInput.css";

function RepoInput({

  onScan,

  loading = false,

}) {

  const [repositoryUrl, setRepositoryUrl] = useState("");

  const [error, setError] = useState("");

  // ===========================================
  // Validate GitHub Repository URL
  // ===========================================

  const validateRepository = (url) => {

    const githubRegex =
      /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;

    return githubRegex.test(url);

  };

  // ===========================================
  // Handle Scan
  // ===========================================

  const handleScan = () => {

    setError("");

    if (!repositoryUrl.trim()) {

      setError("Please enter a GitHub repository URL.");

      return;

    }

    if (!validateRepository(repositoryUrl)) {

      setError(

        "Enter a valid public GitHub repository."

      );

      return;

    }

    if (onScan) {

      onScan(repositoryUrl);

    }

  };

  return (

    <section className="repo-input-container">

      <div className="repo-card">

        {/* Header */}

        <div className="repo-header">

          <div className="repo-icon">

            <GitBranch size={34} />

          </div>

          <div>

            <h2>

              GitHub Repository Scanner

            </h2>

            <p>

              AI-powered dependency & vulnerability analysis

            </p>

          </div>

        </div>

        {/* Input */}

        <div className="repo-form">

          <input

            type="text"

            placeholder="https://github.com/facebook/react"

            value={repositoryUrl}

            onChange={(e) =>

              setRepositoryUrl(e.target.value)

            }

            disabled={loading}

          />

          <button

            onClick={handleScan}

            disabled={loading}

          >

            {

              loading ?

              <>

                <Loader2

                  className="spin"

                  size={18}

                />

                Scanning...

              </>

              :

              <>

                <Search size={18} />

                Scan Repository

              </>

            }

          </button>

        </div>

        {/* Error */}

        {

          error &&

          <div className="repo-error">

            {error}

          </div>

        }

        {/* Footer */}

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