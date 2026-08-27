import { motion } from "framer-motion";
import {
  ShieldCheck,
  Package,
  TriangleAlert,
  CircleCheck,
  Activity,
} from "lucide-react";
import CircularScore from "../../components/ui/CircularScore/CircularScore";
import CountUp from "../../components/CountUp/CountUp";
import "./RepositoryHealth.css";

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
    health >= 90 ? "Optimal" : health >= 75 ? "Good" : health >= 50 ? "Fair" : "At Risk";

  return (
    <motion.section
      className="repo-health"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* LEFT RING */}
      <div className="repo-score-col">
        <CircularScore score={health} size={130} stroke={10} />
        <span className="repo-health-badge">{healthStatus} Ecosystem</span>
      </div>

      {/* RIGHT METRICS */}
      <div className="repo-info-col">
        <div className="repo-info-header">
          <span className="repo-info-subtitle">
            <Activity size={14} />
            ECOSYSTEM INTEGRITY
          </span>
          <h2>Repository Health</h2>
          <p>Overall dependency health calculated across scanned packages.</p>
        </div>

        <div className="health-grid">
          <div className="health-stat-card health-stat-card--safe">
            <div className="health-icon-box">
              <CircleCheck size={18} />
            </div>
            <div className="health-stat-text">
              <span className="health-stat-val">
                <CountUp from={0} to={safePackages} duration={1.5} />
              </span>
              <span className="health-stat-lbl">Safe Packages</span>
            </div>
          </div>

          <div className="health-stat-card health-stat-card--vuln">
            <div className="health-icon-box">
              <TriangleAlert size={18} />
            </div>
            <div className="health-stat-text">
              <span className="health-stat-val">
                <CountUp from={0} to={totalVulns} duration={1.5} />
              </span>
              <span className="health-stat-lbl">Vulnerable</span>
            </div>
          </div>

          <div className="health-stat-card health-stat-card--total">
            <div className="health-icon-box">
              <Package size={18} />
            </div>
            <div className="health-stat-text">
              <span className="health-stat-val">
                <CountUp from={0} to={totalDependencies} duration={1.5} />
              </span>
              <span className="health-stat-lbl">Total Analyzed</span>
            </div>
          </div>

          <div className="health-stat-card health-stat-card--critical">
            <div className="health-icon-box">
              <ShieldCheck size={18} />
            </div>
            <div className="health-stat-text">
              <span className="health-stat-val">
                <CountUp from={0} to={totalCritical} duration={1.5} />
              </span>
              <span className="health-stat-lbl">Critical CVEs</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default RepositoryHealth;