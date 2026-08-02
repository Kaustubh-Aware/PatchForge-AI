import { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import { createScan } from "../../services/scanService";

function RepoInput() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleScan = async () => {
    if (!repositoryUrl) {
      alert("Enter GitHub Repository URL");
      return;
    }

    try {
      setLoading(true);

      const response = await createScan(repositoryUrl);

      console.log(response);

      if (response.success) {
        navigate(`/report/${response.data.scanId}`);
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.error(err);
      alert("Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <input
        type="text"
        placeholder="https://github.com/user/repository"
        value={repositoryUrl}
        onChange={(e) => setRepositoryUrl(e.target.value)}
        style={{
          width: "100%",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "10px"
        }}
      />

      <button
        onClick={handleScan}
        disabled={loading}
      >
        {loading ? "Scanning..." : "Scan Repository"}
      </button>

    </div>
  );
=======
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

>>>>>>> d00d74bb08a6a606256f3287d19cf131e9ab6b4d
}

export default RepoInput;