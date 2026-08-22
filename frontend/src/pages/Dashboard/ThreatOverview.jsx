import "./ThreatOverview.css";
import CountUp from "../../components/CountUp/CountUp";

import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  TriangleAlert,
  TrendingUp,
  Activity,
} from "lucide-react";

function ThreatOverview({ scans = [] }) {
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

  const getWidth = (val) => {
    if (totalVulnerabilities === 0) return "0%";
    return `${Math.min(100, Math.round((val / totalVulnerabilities) * 100))}%`;
  };

  const getRiskAssessment = (score, criticalCount) => {
    if (criticalCount > 0 || score < 50) {
      return {
        level: "CRITICAL",
        text: "Critical Risk • Immediate patching required for critical vulnerabilities",
        trend: "negative"
      };
    }
    if (score < 75) {
      return {
        level: "MODERATE",
        text: "Moderate Risk • Patch generation and dependency upgrades recommended",
        trend: "warning"
      };
    }
    if (score < 90) {
      return {
        level: "LOW",
        text: "Low Risk • System is mostly healthy with minor security findings",
        trend: "positive"
      };
    }
    return {
      level: "SECURE",
      text: "Optimal Security • All scanned repositories adhere to safety policies",
      trend: "positive"
    };
  };

  const risk = getRiskAssessment(avgScore, counts.CRITICAL);

  const threats = [
    {
      level: "Critical",
      value: counts.CRITICAL,
      width: getWidth(counts.CRITICAL),
      color: "critical",
    },
    {
      level: "High",
      value: counts.HIGH,
      width: getWidth(counts.HIGH),
      color: "high",
    },
    {
      level: "Medium",
      value: counts.MEDIUM,
      width: getWidth(counts.MEDIUM),
      color: "medium",
    },
    {
      level: "Low",
      value: counts.LOW,
      width: getWidth(counts.LOW),
      color: "low",
    },
  ];

  return (
    <section className="threat-overview">
      <div className="threat-header">
        <div>
          <span className="threat-subtitle">
            <Activity size={16} />
            LIVE THREAT ANALYSIS
          </span>

          <h2>Threat Intelligence Overview</h2>

          <p>
            Real-time security posture computed across {completedScans.length} completed {completedScans.length === 1 ? "scan" : "scans"}.
          </p>
        </div>

        <div className="threat-score">
          <div className="score-circle">
            <h1>
              <CountUp from={0} to={avgScore} duration={1.5} />
            </h1>
            <span>/100</span>
          </div>

          <small>Security Score</small>
        </div>
      </div>

      <div className="severity-list">
        {threats.map((item) => (
          <div className="severity-item" key={item.level}>
            <div className="severity-info">
              {item.level === "Critical" && <ShieldAlert size={20} />}
              {item.level === "High" && <TriangleAlert size={20} />}
              {item.level === "Medium" && <Shield size={20} />}
              {item.level === "Low" && <ShieldCheck size={20} />}

              <span>{item.level}</span>
            </div>

            <div className="severity-progress">
              <div
                className={`severity-fill ${item.color}`}
                style={{ width: item.width }}
              ></div>
            </div>

            <strong>
              <CountUp from={0} to={item.value} duration={1.2} />
            </strong>
          </div>
        ))}
      </div>

      <div className="ai-risk">
        <div>
          <h4>AI Risk Assessment</h4>
          <p>{risk.text}</p>
        </div>

        <div className={`risk-badge ${risk.level.toLowerCase()}`}>
          <TrendingUp size={18} />
          {risk.level}
        </div>
      </div>
    </section>
  );
}

export default ThreatOverview;