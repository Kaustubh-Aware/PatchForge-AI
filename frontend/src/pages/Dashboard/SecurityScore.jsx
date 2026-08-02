import "./SecurityScore.css";

import {
  ShieldCheck,
  TrendingUp,
  Lock,
  ShieldAlert,
} from "lucide-react";

function SecurityScore() {
  return (
    <section className="security-score">

      <div className="security-header">

        <div>

          <span className="security-tag">
            SECURITY ANALYSIS
          </span>

          <h2>Overall Security Score</h2>

          <p>
            AI continuously evaluates repository health and vulnerability exposure.
          </p>

        </div>

      </div>

      <div className="security-body">

        <div className="score-ring">

          <div className="ring">

            <div className="ring-inner">

              <h1>87</h1>

              <span>/100</span>

            </div>

          </div>

          <div className="trend">

            <TrendingUp size={18} />

            +12%

          </div>

        </div>

        <div className="score-details">

          <div className="detail-card">

            <ShieldCheck size={22} />

            <div>

              <h4>Protected Packages</h4>

              <span>212</span>

            </div>

          </div>

          <div className="detail-card">

            <ShieldAlert size={22} />

            <div>

              <h4>Critical Issues</h4>

              <span>2</span>

            </div>

          </div>

          <div className="detail-card">

            <Lock size={22} />

            <div>

              <h4>AI Confidence</h4>

              <span>96%</span>

            </div>

          </div>

        </div>

      </div>

      <div className="score-footer">

        <div className="footer-item">

          <span>Repository Health</span>

          <div className="progress">

            <div
              className="progress-fill blue"
              style={{ width: "91%" }}
            ></div>

          </div>

        </div>

        <div className="footer-item">

          <span>Dependency Safety</span>

          <div className="progress">

            <div
              className="progress-fill green"
              style={{ width: "84%" }}
            ></div>

          </div>

        </div>

        <div className="footer-item">

          <span>Patch Coverage</span>

          <div className="progress">

            <div
              className="progress-fill purple"
              style={{ width: "78%" }}
            ></div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default SecurityScore;