import "./SecurityScore.css";
import CountUp from "../../components/CountUp/CountUp";
import { motion } from "framer-motion";

import {
  ShieldCheck,
  TrendingUp,
  Lock,
  ShieldAlert,
} from "lucide-react";

function SecurityScore({ scans = [] }) {
  const completedScans = scans.filter((s) => s.status === "Completed");

  let totalDependencies = 0;
  let totalCritical = 0;
  let totalVulns = 0;

  completedScans.forEach((scan) => {
    totalDependencies += scan.totalDependencies || 0;
    totalVulns += scan.vulnerabilitiesFound || 0;
    if (scan.severityCounts) {
      totalCritical += scan.severityCounts.CRITICAL || 0;
    }
  });

  const safePackages = Math.max(0, totalDependencies - totalVulns);

  let avgScore = 100;
  if (completedScans.length > 0) {
    const totalScore = completedScans.reduce(
      (sum, s) => sum + (s.securityScore ?? 100),
      0
    );
    avgScore = Math.round(totalScore / completedScans.length);
  }

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (avgScore / 100) * circumference;

  const getColor = (s) => {
    if (s >= 90) return "#22c55e";
    if (s >= 75) return "#3b82f6";
    if (s >= 50) return "#f59e0b";
    if (s >= 25) return "#f97316";
    return "#ef4444";
  };

  const getHealthPercent = () => {
    if (totalDependencies === 0) return 100;
    return Math.round((safePackages / totalDependencies) * 100);
  };

  const getDepSafety = () => {
    if (totalDependencies === 0) return 100;
    const unsafeRatio = totalVulns / totalDependencies;
    return Math.max(0, Math.min(100, Math.round((1 - unsafeRatio) * 100)));
  };

  const healthPercent = getHealthPercent();
  const depSafety = getDepSafety();

  return (
    <motion.section
      className="security-score"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="security-header">
        <div>
          <span className="security-tag">SECURITY ANALYSIS</span>
          <h2>Overall Security Score</h2>
          <p>
            AI continuously evaluates repository health and vulnerability exposure across {completedScans.length} scanned {completedScans.length === 1 ? "repository" : "repositories"}.
          </p>
        </div>
      </div>

      <div className="security-body">
        <div className="score-ring-container">
          <div className="svg-ring-wrapper">
            <svg width="200" height="200" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="12"
              />
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={getColor(avgScore)}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                className="score-svg-animated"
                style={{
                  "--score-offset": offset,
                  "--circumference": circumference,
                }}
                transform="rotate(-90 90 90)"
              />
            </svg>

            <div className="svg-ring-inner">
              <h1>
                <CountUp from={0} to={avgScore} duration={1.8} />
              </h1>
              <span>/100</span>
            </div>
          </div>

          <div className="trend">
            <TrendingUp size={18} />
            {avgScore >= 80 ? "Healthy" : avgScore >= 60 ? "Moderate" : "Action Needed"}
          </div>
        </div>

        <div className="score-details">
          <div className="detail-card">
            <ShieldCheck size={22} />
            <div>
              <h4>Safe Packages</h4>
              <span>
                <CountUp from={0} to={safePackages} duration={1.5} /> / {totalDependencies}
              </span>
            </div>
          </div>

          <div className="detail-card">
            <ShieldAlert size={22} />
            <div>
              <h4>Critical Issues</h4>
              <span>
                <CountUp from={0} to={totalCritical} duration={1.5} /> Active
              </span>
            </div>
          </div>

          <div className="detail-card">
            <Lock size={22} />
            <div>
              <h4>Security Posture</h4>
              <span>{avgScore >= 90 ? "Optimal" : avgScore >= 75 ? "Protected" : "Vulnerable"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="score-footer">
        <div className="footer-item">
          <span>Repository Health ({healthPercent}%)</span>
          <div className="progress">
            <div
              className="progress-fill blue"
              style={{ width: `${healthPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="footer-item">
          <span>Dependency Safety ({depSafety}%)</span>
          <div className="progress">
            <div
              className="progress-fill green"
              style={{ width: `${depSafety}%` }}
            ></div>
          </div>
        </div>

        <div className="footer-item">
          <span>Security Score ({avgScore}%)</span>
          <div className="progress">
            <div
              className="progress-fill purple"
              style={{ width: `${avgScore}%` }}
            ></div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default SecurityScore;