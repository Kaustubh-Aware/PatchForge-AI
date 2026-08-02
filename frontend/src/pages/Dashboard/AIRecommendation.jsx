import "./AIRecommendation.css";

import {
  BrainCircuit,
  ShieldCheck,
  Package,
  Sparkles,
  ArrowUpRight,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function AIRecommendation() {
  return (
    <section className="ai-panel">

      <div className="ai-glow"></div>

      <div className="ai-header">

        <div className="ai-icon">
          <BrainCircuit size={34} />
        </div>

        <div>

          <span className="ai-label">
            PATCHFORGE AI ENGINE
          </span>

          <h2>AI Patch Recommendation</h2>

          <p>
            Intelligent vulnerability analysis and patch suggestion
          </p>

        </div>

      </div>

      <div className="confidence-box">

        <div>

          <span>AI Confidence</span>

          <h1>96%</h1>

        </div>

        <div className="confidence-ring">

          <svg>

            <circle cx="55" cy="55" r="45"></circle>

            <circle
              cx="55"
              cy="55"
              r="45"
              className="progress"
            ></circle>

          </svg>

          <span>96%</span>

        </div>

      </div>

      <div className="recommendation-grid">

        <div className="info-card">

          <Package />

          <div>

            <small>Current Package</small>

            <h4>lodash 4.17.19</h4>

          </div>

        </div>

        <div className="info-card success">

          <ShieldCheck />

          <div>

            <small>Recommended</small>

            <h4>4.17.24</h4>

          </div>

        </div>

        <div className="info-card warning">

          <Sparkles />

          <div>

            <small>Risk</small>

            <h4>LOW</h4>

          </div>

        </div>

        <div className="info-card">

          <CheckCircle2 />

          <div>

            <small>Compatibility</small>

            <h4>100%</h4>

          </div>

        </div>

      </div>

      <div className="reasoning">

        <h3>AI Reasoning</h3>

        <ul>

          <li>Removes all known CVEs.</li>

          <li>No breaking API changes detected.</li>

          <li>Fully compatible with React 19.</li>

          <li>Improves dependency stability.</li>

          <li>Safe for production deployment.</li>

        </ul>

      </div>

      <div className="ai-actions">

        <button className="generate-btn">

          Generate Patch

          <ArrowUpRight size={18} />

        </button>

        <button className="analysis-btn">

          <FileText size={18} />

          View Analysis

        </button>

      </div>

    </section>
  );
}