import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiExternalLink, FiGithub, FiShield } from "react-icons/fi";
import { getAllScans } from "../services/scanService";
import "./ScanHistory.css";

const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScans = async () => {
      try {
        const response = await getAllScans();

        if (response.success) {
          setScans(response.data);
        }
      } catch (error) {
        console.error("Failed to load scans:", error);
      } finally {
        setLoading(false);
      }
    };

    loadScans();
  }, []);

  const getRepoName = (url) => {
    if (!url) return "Unknown";
    const cleaned = url.replace(/\/+$/, "");
    return cleaned.split("/").pop() || url;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "#22c55e";
    if (score >= 75) return "#3b82f6";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  if (loading) {
    return (
      <section className="scan-history">
        <h2>Recent Scan History</h2>
        <div className="loading-text">Loading previous scans...</div>
      </section>
    );
  }

  return (
    <section className="scan-history">
      <div className="history-header">
        <div>
          <h2>Recent Scan History</h2>
          <p>All repositories scanned by PatchForge AI</p>
        </div>

        <div className="history-count">
          {scans.length} {scans.length === 1 ? "Scan" : "Scans"}
        </div>
      </div>

      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>Repository</th>
              <th>Scan ID</th>
              <th>Status</th>
              <th>Dependencies</th>
              <th>Vulnerabilities</th>
              <th>Security Score</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {scans.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-row">
                  No Scan History Found
                </td>
              </tr>
            ) : (
              scans.map((scan) => (
                <tr key={scan.scanId}>
                  <td>
                    <div className="repo-cell">
                      <FiGithub className="repo-icon" />
                      <div>
                        <h4>{getRepoName(scan.repositoryUrl)}</h4>
                        <span>{scan.repositoryUrl}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="scan-id-badge">{scan.scanId}</span>
                  </td>

                  <td>
                    <span
                      className={`status ${(scan.status || "completed").toLowerCase()}`}
                    >
                      {scan.status}
                    </span>
                  </td>

                  <td>{scan.totalDependencies || 0}</td>

                  <td>
                    <div className="threat-cell">
                      <FiShield />
                      {scan.vulnerabilitiesFound || 0}
                    </div>
                  </td>

                  <td>
                    <span
                      className="score-badge"
                      style={{
                        color: getScoreColor(scan.securityScore ?? 100),
                        borderColor: getScoreColor(scan.securityScore ?? 100),
                      }}
                    >
                      {scan.securityScore ?? 100}%
                    </span>
                  </td>

                  <td>
                    <span className="scan-date">
                      {scan.createdAt
                        ? new Date(scan.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </td>

                  <td>
                    <Link
                      className="report-btn"
                      to={`/report/${scan.scanId}`}
                    >
                      View
                      <FiExternalLink />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ScanHistory;