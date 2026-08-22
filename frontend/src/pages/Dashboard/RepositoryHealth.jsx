import "./RepositoryHealth.css";
import CountUp from "../../components/CountUp/CountUp";

import {
  ShieldCheck,
  Package,
  TriangleAlert,
  CircleCheck,
} from "lucide-react";

function RepositoryHealth({ scans = [] }) {
  const completedScans = scans.filter((s) => s.status === "Completed");

  let totalDependencies = 0;
  let totalVulns = 0;
  let totalCritical = 0;

  completedScans.forEach((scan) => {
    totalDependencies += scan.totalDependencies || 0;
    totalVulns += scan.vulnerabilitiesFound || 0;
    if (scan.severityCounts) {
      totalCritical += scan.severityCounts.CRITICAL || 0;
    }
  });

  const safePackages = Math.max(0, totalDependencies - totalVulns);

  const health =
    totalDependencies > 0
      ? Math.round((safePackages / totalDependencies) * 100)
      : completedScans.length === 0
      ? 100
      : 100;

  const healthStatus =
    health >= 90 ? "Healthy" : health >= 75 ? "Fair" : "At Risk";

  return (
    <section className="repo-health">
      {/* LEFT */}
      <div className="repo-score">
        <div
          className="progress-ring"
          style={{
            background: `conic-gradient(
              #3B82F6 ${health * 3.6}deg,
              rgba(255,255,255,.08) 0deg
            )`,
          }}
        >
          <div className="progress-inner">
            <h2>
              <CountUp from={0} to={health} duration={1.5} />%
            </h2>
            <span>{healthStatus}</span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="repo-info">
        <h2>Repository Health</h2>
        <p>
          Overall dependency ecosystem health across all scanned repositories.
        </p>

        <div className="health-list">
          <div className="health-item">
            <CircleCheck />
            <div>
              <h4>Safe Packages</h4>
              <span>
                <CountUp from={0} to={safePackages} duration={1.5} /> Packages
              </span>
            </div>
          </div>

          <div className="health-item">
            <TriangleAlert />
            <div>
              <h4>Vulnerable</h4>
              <span>
                <CountUp from={0} to={totalVulns} duration={1.5} /> Packages
              </span>
            </div>
          </div>

          <div className="health-item">
            <Package />
            <div>
              <h4>Total Analyzed</h4>
              <span>
                <CountUp from={0} to={totalDependencies} duration={1.5} /> Packages
              </span>
            </div>
          </div>

          <div className="health-item">
            <ShieldCheck />
            <div>
              <h4>Critical CVEs</h4>
              <span>
                <CountUp from={0} to={totalCritical} duration={1.5} /> Critical
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RepositoryHealth;