import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GitBranch, Loader2, Search } from "lucide-react";

import "./RepoInput.css";

import { createScan } from "../services/scanService";

function RepoInput({ onScanCompleted }) {

    const navigate = useNavigate();

    const [repositoryUrl, setRepositoryUrl] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    // ============================================
    // Validate GitHub URL
    // ============================================

    const validateGithubURL = (url) => {

        const regex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;

        return regex.test(url);

    };

    // ============================================
    // Scan Repository
    // ============================================

    const handleScan = async () => {

        setError("");

        if (!repositoryUrl.trim()) {

            setError("Repository URL is required.");

            return;

        }

        if (!validateGithubURL(repositoryUrl)) {

            setError("Please enter a valid GitHub repository URL.");

            return;

        }

        try {

            setLoading(true);

            const result = await createScan(repositoryUrl);

            if (result.success) {

                if (onScanCompleted) {

                    onScanCompleted(result.data);

                }

                // Redirect to dashboard after scan

                navigate("/dashboard");

            }

            else {

                setError(result.message);

            }

        }

        catch (err) {

            setError(

                err.message ||

                "Repository scan failed."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <section className="repo-input-container">

            <div className="repo-card">

                <div className="repo-title">

                    <GitBranch size={28} />

                    <div>

                        <h2>Scan GitHub Repository</h2>

                        <p>

                            Enter a public GitHub repository URL.

                        </p>

                    </div>

                </div>

                <div className="repo-form">

                    <input

                        type="text"

                        placeholder="https://github.com/owner/repository"

                        value={repositoryUrl}

                        onChange={(e) =>

                            setRepositoryUrl(e.target.value)

                        }

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

                {

                    error &&

                    <p className="repo-error">

                        {error}

                    </p>

                }

            </div>

        </section>

    );

}

export default RepoInput;