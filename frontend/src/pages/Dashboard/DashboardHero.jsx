import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck, GitBranch, BrainCircuit, Sparkles,
  ArrowRight, Activity, Cpu, CheckCircle2, ScanSearch,
  Lock, Zap,
} from "lucide-react";
import TiltCard from "../../components/ui/TiltCard/TiltCard";
import ShineButton from "../../components/ui/ShineButton/ShineButton";
import "./DashboardHero.css";

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const TERMINAL_LINES = [
  { icon: Activity,      text: "Connecting Repository...",    cls: "" },
  { icon: CheckCircle2,  text: "Repository Connected",        cls: "success" },
  { icon: ScanSearch,    text: "Building Dependency Graph...",cls: "" },
  { icon: CheckCircle2,  text: "Dependency Graph Ready",      cls: "success" },
  { icon: BrainCircuit,  text: "AI Agent Analysing CVEs...",  cls: "" },
  { icon: null,          text: "3 Vulnerabilities Detected",  cls: "warning" },
];

export default function DashboardHero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-inner">

        {/* ── Left Column ─────────────────────────── */}
        <motion.div
          className="hero-left"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="hero-badge" variants={fadeUp}>
            <Sparkles size={14} />
            PATCHFORGE AI v2.0
          </motion.span>

          <motion.h1 className="hero-headline" variants={fadeUp}>
            Secure Your{" "}
            <span className="hero-headline--gradient">Open Source</span>
            <br />
            Dependencies
          </motion.h1>

          <motion.p className="hero-sub" variants={fadeUp}>
            Intelligent vulnerability detection, automated patch generation,
            dependency intelligence and Git integration powered by AI.
          </motion.p>

          <motion.div className="hero-buttons" variants={fadeUp}>
            <ShineButton onClick={() => navigate("/scan")}>
              <Zap size={16} />
              Start AI Scan
            </ShineButton>

            <button
              className="hero-ghost-btn"
              onClick={() => {
                const el = document.querySelector(".scan-history");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else navigate("/scan");
              }}
            >
              View Reports
              <ArrowRight size={16} className="hero-ghost-arrow" />
            </button>
          </motion.div>

          <motion.div className="hero-features" variants={fadeUp}>
            {[
              [ShieldCheck, "Enterprise Security"],
              [BrainCircuit, "AI Powered"],
              [GitBranch, "Git Integration"],
              [Lock, "Zero Trust"],
            ].map(([Icon, label]) => (
              <div className="feature-pill" key={label}>
                <Icon size={15} />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right Column — 3D AI Core ─────────── */}
        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          <TiltCard className="ai-panel">

            {/* Panel Header */}
            <div className="panel-header">
              <div>
                <h3>AI Intelligence</h3>
                <span>Live Security Engine</span>
              </div>
              <div className="live-status">
                <span className="live-dot" />
                ONLINE
              </div>
            </div>

            {/* 3D Orb */}
            <div className="ai-orb-wrapper">
              <div className="ai-orb">
                <div className="orb-ring orb-ring--1" />
                <div className="orb-ring orb-ring--2" />
                <div className="orb-ring orb-ring--3" />
                <div className="orb-core">
                  <Cpu size={40} />
                </div>
              </div>
            </div>

            {/* Terminal */}
            <div className="ai-terminal">
              {TERMINAL_LINES.map((line, i) => (
                <motion.p
                  key={i}
                  className={line.cls}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.25, duration: 0.3 }}
                >
                  {line.icon && <line.icon size={13} />}
                  {line.text}
                </motion.p>
              ))}
            </div>

            {/* Status Grid */}
            <div className="status-grid">
              {[
                [GitBranch, "Git",      "Connected"],
                [Activity,  "OSV Feed", "Synced"],
                [BrainCircuit, "AI Agent", "Running"],
              ].map(([Icon, title, val]) => (
                <div className="status-card" key={title}>
                  <Icon size={16} />
                  <div>
                    <h4>{title}</h4>
                    <span>{val}</span>
                  </div>
                </div>
              ))}
            </div>

          </TiltCard>
        </motion.div>

      </div>
    </section>
  );
}