import "./TopVulnerabilities.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVulnerabilities } from "../../services/scanService";

import {
  ShieldAlert,
  Package,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function TopVulnerabilities({ scans = [] }) {
  const navigate = useNavigate();
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(false);

  const completedScans = scans.filter((s) => s.status === "Completed");
  const latestScan = completedScans[0];

  useEffect(() => {
    if (!latestScan?.scanId) {
      setVulnerabilities([]);
      return;
    }

    const fetchTopVulns = async () => {
      try {
        setLoading(true);
        const res = await getVulnerabilities(latestScan.scanId);
        if (res.success && Array.isArray(res.data)) {
          // Sort by severity (CRITICAL > HIGH > MEDIUM > LOW)
          const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, UNKNOWN: 0 };
          const sorted = [...res.data].sort(
            (a, b) => (order[b.severity] || 0) - (order[a.severity] || 0)
          );
          setVulnerabilities(sorted.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch top vulns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopVulns();
  }, [latestScan?.scanId]);

  const getColor = (sev) => {
    switch ((sev || "").toUpperCase()) {
      case "CRITICAL":
        return "#ef4444";
      case "HIGH":
        return "#f97316";
      case "MEDIUM":
        return "#eab308";
      default:
        return "#22c55e";
    }
  };

  return (
    <section className="top-vulnerabilities">
      <div className="tv-header">
        <div>
          <span className="tv-tag">ACTIVE THREATS</span>
          <h2>Top Vulnerabilities</h2>
          <p>Highest severity findings from recent repository scans</p>
        </div>

        {latestScan && (
          <button
            className="tv-view-btn"
            onClick={() => navigate(`/report/${latestScan.scanId}`)}
          >
            View Report
          </button>
        )}
      </div>

      <div className="tv-list">
        {vulnerabilities.length === 0 ? (
          <div className="tv-empty">
            <ShieldCheck size={36} />
            <p>
              {completedScans.length === 0
                ? "No scans analyzed yet. Start a scan to detect vulnerabilities."
                : "No active high-risk vulnerabilities found in the latest scan!"}
            </p>
          </div>
        ) : (
          vulnerabilities.map((item, idx) => (
            <div
              key={item.id || item.vulnerabilityId || idx}
              className="tv-card"
              style={{
                "--accent": getColor(item.severity),
              }}
            >
              <div className="tv-top">
                <div className="tv-severity">
                  <ShieldAlert size={20} />
                  <span>{item.severity}</span>
                </div>

                <div className="tv-score">
                  CVSS {item.cvssScore > 0 ? item.cvssScore.toFixed(1) : "—"}
                </div>
              </div>

              <h3>{item.vulnerabilityId}</h3>

              <div className="tv-package">
                <Package size={16} />
                {item.packageName}
              </div>

              <div className="tv-info">
                <div>
                  <label>Affected</label>
                  <span>{item.installedVersion || "—"}</span>
                </div>

                <div>
                  <label>Patched</label>
                  <span>{item.fixedVersion || "N/A"}</span>
                </div>
              </div>

              <div className="tv-bottom">
                <div className="tv-ai">
                  <Sparkles size={16} />
                  {item.fixedVersion ? "Patch Available" : "Mitigation Required"}
                </div>

                <button
                  onClick={() =>
                    latestScan && navigate(`/report/${latestScan.scanId}`)
                  }
                >
                  Details
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default TopVulnerabilities;