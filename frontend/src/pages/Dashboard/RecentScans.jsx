import "./RecentScans.css";
import { useNavigate } from "react-router-dom";

import {
  GitBranch,
  Clock3,
  CheckCircle2,
  LoaderCircle,
  XCircle,
  ArrowRight,
  Shield,
} from "lucide-react";

function formatRelativeTime(dateString) {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  return date.toLocaleDateString();
}

function RecentScans({ scans = [], loading = false }) {
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={18} />;
      case "Scanning":
      case "Running":
        return <LoaderCircle size={18} className="spin" />;
      default:
        return <XCircle size={18} />;
    }
  };

  const recentList = scans.slice(0, 4);

  return (
    <section className="recent-scans">
      <div className="recent-header">
        <div>
          <h2>Recent Scans</h2>
          <p>Latest repository scans performed by PatchForge AI</p>
        </div>

        <button
          className="view-all-btn"
          onClick={() => {
            const history = document.querySelector(".scan-history");
            if (history) {
              history.scrollIntoView({ behavior: "smooth" });
            } else {
              navigate("/scan");
            }
          }}
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="scan-list">
        {recentList.length === 0 ? (
          <div className="empty-recent-scans">
            <Shield size={32} />
            <p>No repository scans recorded yet.</p>
            <button onClick={() => navigate("/scan")} className="start-scan-btn">
              Scan a Repository
            </button>
          </div>
        ) : (
          recentList.map((scan) => {
            const repoName = scan.repositoryUrl
              ? scan.repositoryUrl.replace(/^https?:\/\/github\.com\//, "")
              : "Unknown Repo";

            return (
              <div
                className="scan-card"
                key={scan.scanId}
                onClick={() => navigate(`/report/${scan.scanId}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="scan-left">
                  <div className="repo-icon">
                    <GitBranch size={22} />
                  </div>

                  <div>
                    <h3>{repoName}</h3>
                    <span>{scan.scanId}</span>
                  </div>
                </div>

                <div className="scan-right">
                  <div
                    className={`status-badge ${(scan.status || "completed").toLowerCase()}`}
                  >
                    {getStatusIcon(scan.status)}
                    {scan.status}
                  </div>

                  <div className="scan-time">
                    <Clock3 size={15} />
                    {formatRelativeTime(scan.createdAt || scan.startedAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default RecentScans;