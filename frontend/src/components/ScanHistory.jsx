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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadScans();
  }, []);

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
          {scans.length} Scans
        </div>
      </div>

      <div className="history-table">

        <table>

          <thead>

            <tr>
              <th>Repository</th>
              <th>Status</th>
              <th>Dependencies</th>
              <th>Threats</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {scans.length === 0 ? (

              <tr>
                <td colSpan="5" className="empty-row">
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

                        <h4>{scan.repositoryUrl.split("/").pop()}</h4>

                        <span>{scan.repositoryUrl}</span>

                      </div>

                    </div>

                  </td>

                  <td>

                    <span
                      className={`status ${
                        scan.status === "Completed"
                          ? "completed"
                          : "failed"
                      }`}
                    >
                      {scan.status}
                    </span>

                  </td>

                  <td>{scan.totalDependencies}</td>

                  <td>

                    <div className="threat-cell">

                      <FiShield />

                      {scan.vulnerabilitiesFound}

                    </div>

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