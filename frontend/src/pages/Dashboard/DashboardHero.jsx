import "./DashboardHero.css";
import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  GitBranch,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  Activity,
  Cpu,
  CheckCircle2,
  ScanSearch,
  Lock,
} from "lucide-react";

function DashboardHero() {
  const navigate = useNavigate();

  return (
    <section className="hero">

      {/* Decorative Background */}

      <div className="hero-gradient"></div>
      <div className="hero-grid"></div>

      <span className="particle p1"></span>
      <span className="particle p2"></span>
      <span className="particle p3"></span>
      <span className="particle p4"></span>

      <div className="hero-left">

        <span className="hero-badge">
          <Sparkles size={15} />
          PATCHFORGE AI v2.0
        </span>

        <h1>
          Secure Your
          <br />
          <span>Open Source</span>
          <br />
          Dependencies
        </h1>

        <p>
          Intelligent vulnerability detection, automated patch generation,
          dependency intelligence and Git integration powered by AI.
        </p>

        <div className="hero-buttons">

          <button
            className="primary-btn"
            onClick={() => navigate("/scan")}
          >
            Start AI Scan
            <ArrowRight size={18} />
          </button>

          <button
            className="secondary-btn"
            onClick={() => {
              const history = document.querySelector(".scan-history");
              if (history) {
                history.scrollIntoView({ behavior: "smooth" });
              } else {
                navigate("/scan");
              }
            }}
          >
            View Reports
          </button>

        </div>

        {/* Feature Pills */}

        <div className="hero-features">

          <div className="feature-pill">
            <ShieldCheck size={18} />
            Enterprise Security
          </div>

          <div className="feature-pill">
            <BrainCircuit size={18} />
            AI Powered
          </div>

          <div className="feature-pill">
            <GitBranch size={18} />
            Git Integration
          </div>

          <div className="feature-pill">
            <Lock size={18} />
            Zero Trust
          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="hero-right">

        <div className="ai-panel">

          {/* Header */}

          <div className="panel-header">

            <div>

              <h3>AI Intelligence</h3>

              <span>Live Security Engine</span>

            </div>

            <div className="live-status">

              <span className="live-dot"></span>

              ONLINE

            </div>

          </div>

          {/* AI Core */}

          <div className="scan-circle">

            <div className="circle-ring ring1"></div>

            <div className="circle-ring ring2"></div>

            <div className="circle-ring ring3"></div>

            <div className="circle-core">

              <Cpu size={42} />

            </div>

          </div>

          {/* Live Terminal */}

          <div className="ai-terminal">

            <p>
              <Activity size={14} />
              Connecting Repository...
            </p>

            <p className="success">
              <CheckCircle2 size={14} />
              Repository Connected
            </p>

            <p>
              <ScanSearch size={14} />
              Building Dependency Graph...
            </p>

            <p className="success">
              <CheckCircle2 size={14} />
              Dependency Graph Ready
            </p>

            <p>
              <BrainCircuit size={14} />
              AI Agent Analysing CVEs...
            </p>

            <p className="warning">
              3 Vulnerabilities Detected
            </p>

          </div>

          {/* Bottom Status */}

          <div className="status-grid">

            <div className="status-card">

              <GitBranch size={18} />

              <div>

                <h4>Git</h4>

                <span>Connected</span>

              </div>

            </div>

            <div className="status-card">

              <Activity size={18} />

              <div>

                <h4>OSV Feed</h4>

                <span>Synced</span>

              </div>

            </div>

            <div className="status-card">

              <BrainCircuit size={18} />

              <div>

                <h4>AI Agent</h4>

                <span>Running</span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default DashboardHero;