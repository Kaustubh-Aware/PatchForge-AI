import "./TopVulnerabilities.css";
import {
  ShieldAlert,
  Package,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const vulnerabilities = [
  {
    id: 1,
    cve: "CVE-2026-10392",
    package: "OpenSSL",
    severity: "Critical",
    score: 9.8,
    affected: "2.0.1",
    patched: "2.1.4",
    color: "#ef4444",
  },
  {
    id: 2,
    cve: "CVE-2026-8472",
    package: "Axios",
    severity: "High",
    score: 8.6,
    affected: "1.4.0",
    patched: "1.6.2",
    color: "#f97316",
  },
  {
    id: 3,
    cve: "CVE-2026-4187",
    package: "React",
    severity: "Medium",
    score: 6.2,
    affected: "18.2.0",
    patched: "18.3.1",
    color: "#eab308",
  },
];

function TopVulnerabilities() {
  return (
    <section className="top-vulnerabilities">

      <div className="tv-header">

        <div>

          <span className="tv-tag">
            ACTIVE THREATS
          </span>

          <h2>
            Top Vulnerabilities
          </h2>

        </div>

        <button className="tv-view-btn">
          View All
        </button>

      </div>

      <div className="tv-list">

        {vulnerabilities.map((item) => (

          <div
            key={item.id}
            className="tv-card"
            style={{
              "--accent": item.color,
            }}
          >

            <div className="tv-top">

              <div className="tv-severity">

                <ShieldAlert size={20} />

                <span>{item.severity}</span>

              </div>

              <div className="tv-score">

                CVSS {item.score}

              </div>

            </div>

            <h3>{item.cve}</h3>

            <div className="tv-package">

              <Package size={16} />

              {item.package}

            </div>

            <div className="tv-info">

              <div>

                <label>Affected</label>

                <span>{item.affected}</span>

              </div>

              <div>

                <label>Patched</label>

                <span>{item.patched}</span>

              </div>

            </div>

            <div className="tv-bottom">

              <div className="tv-ai">

                <Sparkles size={16} />

                AI Patch Ready

              </div>

              <button>

                Patch

                <ArrowRight size={16} />

              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default TopVulnerabilities;