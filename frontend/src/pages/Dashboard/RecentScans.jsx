import "./RecentScans.css";

import {
  GitBranch,
  Clock3,
  CheckCircle2,
  LoaderCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

const scans = [
  {
    id: "PF-2C5F06E4",
    repo: "facebook/react",
    status: "Completed",
    time: "2 min ago",
  },
  {
    id: "PF-A91C44F2",
    repo: "vercel/next.js",
    status: "Running",
    time: "5 min ago",
  },
  {
    id: "PF-C8F1B112",
    repo: "angular/angular",
    status: "Failed",
    time: "12 min ago",
  },
];

function RecentScans() {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={18} />;
      case "Running":
        return <LoaderCircle size={18} className="spin" />;
      default:
        return <XCircle size={18} />;
    }
  };

  return (
    <section className="recent-scans">

      <div className="recent-header">

        <div>

          <h2>Recent Scans</h2>

          <p>Latest repository scans performed by PatchForge AI</p>

        </div>

        <button className="view-all-btn">
          View All
          <ArrowRight size={16} />
        </button>

      </div>

      <div className="scan-list">

        {scans.map((scan) => (

          <div className="scan-card" key={scan.id}>

            <div className="scan-left">

              <div className="repo-icon">
                <GitBranch size={22} />
              </div>

              <div>

                <h3>{scan.repo}</h3>

                <span>{scan.id}</span>

              </div>

            </div>

            <div className="scan-right">

              <div
                className={`status-badge ${scan.status.toLowerCase()}`}
              >
                {getStatusIcon(scan.status)}
                {scan.status}
              </div>

              <div className="scan-time">

                <Clock3 size={15} />

                {scan.time}

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default RecentScans;