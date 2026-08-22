import "./StatsCards.css";

import CountUp from "../../components/CountUp/CountUp";

import {
  ShieldCheck,
  AlertTriangle,
  Boxes,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

function StatsCards({ scans = [], loading = false }) {

  // Compute real stats from scan data
  const completedScans = scans.filter((s) => s.status === "Completed");

  const totalScans = scans.length;

  const totalDependencies = completedScans.reduce(
    (sum, s) => sum + (s.totalDependencies || 0), 0
  );

  const totalVulnerabilities = completedScans.reduce(
    (sum, s) => sum + (s.vulnerabilitiesFound || 0), 0
  );

  let avgScore = 100;
  if (completedScans.length > 0) {
    const total = completedScans.reduce(
      (sum, s) => sum + (s.securityScore ?? 100), 0
    );
    avgScore = Math.round(total / completedScans.length);
  }

  const cards = [
    {
      title: "Security Score",
      value: avgScore,
      suffix: "%",
      icon: ShieldCheck,
      gradient: "blue",
      subtitle: avgScore >= 90 ? "Excellent" : avgScore >= 75 ? "Good" : avgScore >= 50 ? "Fair" : "Needs Attention",
    },
    {
      title: "Vulnerabilities",
      value: totalVulnerabilities,
      icon: AlertTriangle,
      gradient: "red",
      subtitle: totalVulnerabilities === 0 ? "No Threats" : `${totalVulnerabilities} Found`,
    },
    {
      title: "Dependencies",
      value: totalDependencies,
      icon: Boxes,
      gradient: "cyan",
      subtitle: "Analyzed Packages",
    },
    {
      title: "Total Scans",
      value: totalScans,
      icon: BarChart3,
      gradient: "purple",
      subtitle: `${completedScans.length} Completed`,
    },
  ];

  if (loading) {
    return (
      <section className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card loading-card">
            <div className="stat-skeleton" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="stats-grid">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className={`stat-card ${card.gradient}`}
          >
            <span
              className="floating-dot"
              style={{ left: "20%", animationDelay: "0s" }}
            ></span>

            <span
              className="floating-dot"
              style={{ left: "72%", animationDelay: "2s" }}
            ></span>

            <span
              className="floating-dot"
              style={{ left: "48%", animationDelay: "4s" }}
            ></span>

            <div className="stat-top">

              <div className="stat-icon">
                <div className="icon-ring"></div>
                <Icon size={24} />
              </div>

            </div>

            <div className="stat-value">

              <CountUp
                from={0}
                to={card.value}
                duration={2}
                separator=","
                className="count-up-text"
              />

              {card.suffix}

            </div>

            <h3>{card.title}</h3>

            <p>{card.subtitle}</p>

            <div className="progress-line">
              <div className="progress-fill"></div>
            </div>

          </div>

        );

      })}

    </section>
  );
}

export default StatsCards;