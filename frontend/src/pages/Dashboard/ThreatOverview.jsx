import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  TriangleAlert,
  TrendingUp,
  Activity,
  PieChart,
} from "lucide-react";
import CircularScore from "../../components/ui/CircularScore/CircularScore";
import CountUp from "../../components/CountUp/CountUp";
import "./ThreatOverview.css";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ThreatOverview({ scans = [] }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const completedScans = scans.filter((s) => s.status === "Completed");

  const counts = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  completedScans.forEach((scan) => {
    if (scan.severityCounts) {
      counts.CRITICAL += scan.severityCounts.CRITICAL || 0;
      counts.HIGH += scan.severityCounts.HIGH || 0;
      counts.MEDIUM += scan.severityCounts.MEDIUM || 0;
      counts.LOW += scan.severityCounts.LOW || 0;
    }
  });

  const totalVulnerabilities = counts.CRITICAL + counts.HIGH + counts.MEDIUM + counts.LOW;

  let avgScore = 100;
  if (completedScans.length > 0) {
    const totalScore = completedScans.reduce(
      (sum, s) => sum + (s.securityScore ?? 100),
      0
    );
    avgScore = Math.round(totalScore / completedScans.length);
  }

  const getPercentage = (val) => {
    if (totalVulnerabilities === 0) return 0;
    return Math.round((val / totalVulnerabilities) * 100);
  };

  const getRiskAssessment = (score, criticalCount) => {
    if (criticalCount > 0 || score < 50) {
      return {
        level: "CRITICAL",
        text: "Critical Risk • Immediate patching required for active CVE exposures",
        trend: "negative",
      };
    }
    if (score < 75) {
      return {
        level: "MODERATE",
        text: "Moderate Risk • Automated patch generation and version upgrades recommended",
        trend: "warning",
      };
    }
    if (score < 90) {
      return {
        level: "LOW",
        text: "Low Risk • System is mostly healthy with minor security findings",
        trend: "positive",
      };
    }
    return {
      level: "SECURE",
      text: "Optimal Security • All scanned repositories adhere to zero-trust policies",
      trend: "positive",
    };
  };

  const risk = getRiskAssessment(avgScore, counts.CRITICAL);

  const threats = [
    {
      level: "Critical",
      value: counts.CRITICAL,
      percent: getPercentage(counts.CRITICAL),
      color: "#ef4444",
      bgClass: "critical",
      icon: ShieldAlert,
    },
    {
      level: "High",
      value: counts.HIGH,
      percent: getPercentage(counts.HIGH),
      color: "#f97316",
      bgClass: "high",
      icon: TriangleAlert,
    },
    {
      level: "Medium",
      value: counts.MEDIUM,
      percent: getPercentage(counts.MEDIUM),
      color: "#f59e0b",
      bgClass: "medium",
      icon: Shield,
    },
    {
      level: "Low",
      value: counts.LOW,
      percent: getPercentage(counts.LOW),
      color: "#22c55e",
      bgClass: "low",
      icon: ShieldCheck,
    },
  ];

  // Compute SVG Donut Chart slices
  const donutSize = 130;
  const strokeWidth = 14;
  const radius = (donutSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const donutSegments = threats.map((t) => {
    const strokeDasharray = ((t.percent * circumference) / 100) + " " + circumference;
    const strokeDashoffset = -((cumulativePercent * circumference) / 100);
    cumulativePercent += t.percent;
    return {
      ...t,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <motion.section
      className="threat-overview"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* ── Header ── */}
      <div className="threat-header">
        <div className="threat-header-left">
          <span className="threat-subtitle">
            <Activity size={15} />
            LIVE THREAT INTELLIGENCE
          </span>
          <h2>Threat Distribution & Risk</h2>
          <p>
            Real-time security posture computed across {completedScans.length} completed{" "}
            {completedScans.length === 1 ? "scan" : "scans"}.
          </p>
        </div>

        {/* Circular Score Ring Component */}
        <div className="threat-score-box">
          <CircularScore score={avgScore} size={110} stroke={9} />
          <span className="threat-score-label">System Health</span>
        </div>
      </div>

      {/* ── Donut + Severity Breakdown Grid ── */}
      <div className="threat-body-grid">
        {/* Animated Donut Chart */}
        <div className="donut-chart-container">
          <div className="donut-chart-wrapper">
            <svg width={donutSize} height={donutSize} className="donut-svg">
              <circle
                cx={donutSize / 2}
                cy={donutSize / 2}
                r={radius}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {totalVulnerabilities > 0 &&
                donutSegments.map((segment) => (
                  <motion.circle
                    key={segment.level}
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={radius}
                    stroke={segment.color}
                    strokeWidth={hoveredSegment === segment.level ? strokeWidth + 3 : strokeWidth}
                    fill="none"
                    strokeDasharray={segment.strokeDasharray}
                    strokeDashoffset={segment.strokeDashoffset}
                    initial={{ strokeDasharray: "0 " + circumference }}
                    whileInView={{ strokeDasharray: segment.strokeDasharray }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    onMouseEnter={() => setHoveredSegment(segment.level)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={{
                      cursor: "pointer",
                      transition: "stroke-width 0.2s ease",
                      filter:
                        hoveredSegment === segment.level
                          ? "drop-shadow(0 0 8px " + segment.color + ")"
                          : "none",
                    }}
                  />
                ))}
            </svg>
            <div className="donut-center-text">
              <span className="donut-center-val">
                <CountUp from={0} to={totalVulnerabilities} duration={1.2} />
              </span>
              <span className="donut-center-lbl">Total CVEs</span>
            </div>
          </div>

          <div className="donut-legend">
            {threats.map((t) => (
              <div
                key={t.level}
                className={"legend-item " + (hoveredSegment === t.level ? "legend-item--hovered" : "")}
                onMouseEnter={() => setHoveredSegment(t.level)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <span className="legend-dot" style={{ background: t.color }} />
                <span className="legend-label">{t.level}</span>
                <span className="legend-pct">{t.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Severity Progress Bars */}
        <div className="severity-list">
          {threats.map((item) => {
            const Icon = item.icon;
            return (
              <div className="severity-item" key={item.level}>
                <div className="severity-info">
                  <div className={"severity-icon-badge severity-icon-badge--" + item.bgClass}>
                    <Icon size={16} />
                  </div>
                  <span className="severity-level-name">{item.level}</span>
                </div>

                <div className="severity-progress-track">
                  <motion.div
                    className={"severity-progress-fill severity-progress-fill--" + item.bgClass}
                    initial={{ width: "0%" }}
                    whileInView={{ width: item.percent + "%" }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    viewport={{ once: true }}
                    style={{
                      boxShadow: "0 0 10px " + item.color,
                    }}
                  />
                </div>

                <div className="severity-count-badge">
                  <strong>
                    <CountUp from={0} to={item.value} duration={1.2} />
                  </strong>
                  <span>({item.percent}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI Risk Assessment Footer ── */}
      <div className="ai-risk-card">
        <div className="ai-risk-text">
          <h4>AI Threat Assessment</h4>
          <p>{risk.text}</p>
        </div>

        <div className={"risk-badge risk-badge--" + risk.level.toLowerCase()}>
          <TrendingUp size={16} />
          {risk.level}
        </div>
      </div>
    </motion.section>
  );
}