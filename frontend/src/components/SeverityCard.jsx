import "./SeverityCard.css";
import CountUp from "./CountUp/CountUp";
import { ShieldAlert, Shield, ShieldCheck, TriangleAlert } from "lucide-react";

const SeverityCard = ({ vulnerabilities, severityCounts }) => {

  // Use pre-calculated counts if available, otherwise compute from vulnerabilities
  const counts = severityCounts || {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  if (!severityCounts && vulnerabilities?.length) {
    vulnerabilities.forEach((item) => {
      const severity = (item.severity || "").toUpperCase();
      const normalized = severity === "MODERATE" ? "MEDIUM" : severity;
      if (counts[normalized] !== undefined) {
        counts[normalized]++;
      }
    });
  }

  const total = counts.CRITICAL + counts.HIGH + counts.MEDIUM + counts.LOW;

  const items = [
    {
      label: "Critical",
      key: "CRITICAL",
      count: counts.CRITICAL,
      icon: <ShieldAlert size={22} />,
      color: "#ef4444",
    },
    {
      label: "High",
      key: "HIGH",
      count: counts.HIGH,
      icon: <TriangleAlert size={22} />,
      color: "#f97316",
    },
    {
      label: "Medium",
      key: "MEDIUM",
      count: counts.MEDIUM,
      icon: <Shield size={22} />,
      color: "#eab308",
    },
    {
      label: "Low",
      key: "LOW",
      count: counts.LOW,
      icon: <ShieldCheck size={22} />,
      color: "#22c55e",
    },
  ];

  return (
    <div className="severity-card">

      <div className="severity-header">
        <h2>Severity Overview</h2>
        <span className="severity-total">{total} Total</span>
      </div>

      <div className="severity-grid">

        {items.map((item) => (
          <div
            className={`severity-box ${item.key.toLowerCase()}`}
            key={item.key}
          >
            <div className="severity-box-icon" style={{ color: item.color }}>
              {item.icon}
            </div>
            <h3>{item.label}</h3>
            <p>
              <CountUp from={0} to={item.count} duration={1.5} />
            </p>
            {total > 0 && (
              <div className="severity-bar">
                <div
                  className="severity-bar-fill"
                  style={{
                    width: `${(item.count / total) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            )}
          </div>
        ))}

      </div>

    </div>
  );
};

export default SeverityCard;