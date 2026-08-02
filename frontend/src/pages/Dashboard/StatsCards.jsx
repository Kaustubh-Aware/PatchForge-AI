import "./StatsCards.css";

import CountUp from "../../components/CountUp/CountUp";

import {
  ShieldCheck,
  AlertTriangle,
  Boxes,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const cards = [
  {
    title: "Security Score",
    value: 98,
    suffix: "%",
    icon: ShieldCheck,
    gradient: "blue",
    trend: "+2.1%",
    trendUp: true,
    subtitle: "Excellent Security",
  },
  {
    title: "Vulnerabilities",
    value: 3,
    icon: AlertTriangle,
    gradient: "red",
    trend: "-12%",
    trendUp: false,
    subtitle: "Low Risk",
  },
  {
    title: "Dependencies",
    value: 214,
    icon: Boxes,
    gradient: "cyan",
    trend: "+18",
    trendUp: true,
    subtitle: "Healthy Packages",
  },
  {
    title: "AI Confidence",
    value: 99.3,
    suffix: "%",
    icon: BrainCircuit,
    gradient: "purple",
    trend: "+0.6%",
    trendUp: true,
    subtitle: "Prediction Accuracy",
  },
];

function StatsCards() {
  return (
    <section className="stats-grid">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            className={`stat-card ${card.gradient} ${
            card.title==="AI Confidence"
            ? "ai-card"
            : ""
            }`}
          >
            <span
className="floating-dot"
style={{
left:"20%",
animationDelay:"0s"
}}
></span>

<span
className="floating-dot"
style={{
left:"72%",
animationDelay:"2s"
}}
></span>

<span
className="floating-dot"
style={{
left:"48%",
animationDelay:"4s"
}}
></span>
            <div className="stat-top">

              <div className="stat-icon">

                <div className="icon-ring"></div>

                <Icon size={24} />

            </div>

              <div
                className={`stat-trend ${
                  card.trendUp ? "positive" : "negative"
                }`}
              >
                {card.trendUp ? (
                  <TrendingUp size={15} />
                ) : (
                  <TrendingDown size={15} />
                )}

                {card.trend}
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