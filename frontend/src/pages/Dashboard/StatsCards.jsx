import { motion } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  Boxes,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import CountUp from "../../components/CountUp/CountUp";
import TiltCard from "../../components/ui/TiltCard/TiltCard";
import "./StatsCards.css";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function StatsCards({ scans = [], loading = false }) {
  // Compute real stats from scan data
  const completedScans = scans.filter((s) => s.status === "Completed");
  const totalScans = scans.length;

  const totalDependencies = completedScans.reduce(
    (sum, s) => sum + (s.totalDependencies || 0),
    0
  );

  const totalVulnerabilities = completedScans.reduce(
    (sum, s) => sum + (s.vulnerabilitiesFound || 0),
    0
  );

  let avgScore = 100;
  if (completedScans.length > 0) {
    const total = completedScans.reduce(
      (sum, s) => sum + (s.securityScore ?? 100),
      0
    );
    avgScore = Math.round(total / completedScans.length);
  }

  const cards = [
    {
      title: "Security Score",
      value: avgScore,
      suffix: "%",
      icon: ShieldCheck,
      color: "green",
      glowColor: "rgba(34, 197, 94, 0.35)",
      borderColor: "rgba(34, 197, 94, 0.2)",
      subtitle: avgScore >= 90 ? "Excellent" : avgScore >= 75 ? "Good" : avgScore >= 50 ? "Fair" : "Needs Attention",
    },
    {
      title: "Vulnerabilities",
      value: totalVulnerabilities,
      icon: AlertTriangle,
      color: "red",
      glowColor: "rgba(239, 68, 68, 0.35)",
      borderColor: "rgba(239, 68, 68, 0.2)",
      subtitle: totalVulnerabilities === 0 ? "Zero Threats Found" : totalVulnerabilities + " Found in Scans",
    },
    {
      title: "Dependencies",
      value: totalDependencies,
      icon: Boxes,
      color: "blue",
      glowColor: "rgba(6, 182, 212, 0.35)",
      borderColor: "rgba(6, 182, 212, 0.2)",
      subtitle: "Analyzed Packages",
    },
    {
      title: "Total Scans",
      value: totalScans,
      icon: BarChart3,
      color: "purple",
      glowColor: "rgba(139, 92, 246, 0.35)",
      borderColor: "rgba(139, 92, 246, 0.2)",
      subtitle: completedScans.length + " Completed Scans",
    },
  ];

  if (loading) {
    return (
      <section className="stats-container">
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card skeleton-stat-card">
              <div className="stat-skeleton-shimmer" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="stats-container">
      <motion.div
        className="stats-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {cards.map((card, i) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              custom={i}
              variants={cardVariants}
              className="stat-card-motion-wrapper"
            >
              <TiltCard className={"stat-card stat-card--" + card.color}>
                {/* Colored Glow Behind Icon */}
                <div
                  className="stat-icon-glow-layer"
                  style={{ background: card.glowColor }}
                />

                <div className="stat-top-row">
                  <div className={"stat-icon-badge stat-icon-badge--" + card.color}>
                    <Icon size={22} />
                  </div>
                  <span className="stat-pill-trend">
                    <TrendingUp size={12} />
                    Live
                  </span>
                </div>

                <div className="stat-body">
                  <div className="stat-numeric-value">
                    <CountUp
                      from={0}
                      to={card.value}
                      duration={1.8}
                      separator=","
                    />
                    {card.suffix && <span className="stat-suffix">{card.suffix}</span>}
                  </div>

                  <h3 className="stat-title">{card.title}</h3>
                  <p className="stat-subtitle">{card.subtitle}</p>
                </div>

                {/* Bottom decorative neon accent line */}
                <div className="stat-bottom-line">
                  <div
                    className="stat-bottom-line-fill"
                    style={{
                      background: "linear-gradient(90deg, " + card.borderColor + ", transparent)",
                    }}
                  />
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}