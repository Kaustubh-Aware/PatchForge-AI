import { useState } from "react";
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
}

export default RepoInput;