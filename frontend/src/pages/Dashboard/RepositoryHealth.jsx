import "./RepositoryHealth.css";

import {
  ShieldCheck,
  Package,
  TriangleAlert,
  CircleCheck,
} from "lucide-react";

function RepositoryHealth() {

  const health = 92;

  return (

    <section className="repo-health">

      {/* LEFT */}

      <div className="repo-score">

        <div
          className="progress-ring"
          style={{
            background: `conic-gradient(
              #3B82F6 ${health * 3.6}deg,
              rgba(255,255,255,.08) 0deg
            )`,
          }}
        >
          <div className="progress-inner">

            <h2>{health}%</h2>

            <span>Healthy</span>

          </div>
        </div>

      </div>

      {/* RIGHT */}

      <div className="repo-info">

        <h2>Repository Health</h2>

        <p>
          Overall dependency ecosystem analysis powered
          by PatchForge AI.
        </p>

        <div className="health-list">

          <div className="health-item">

            <CircleCheck />

            <div>

              <h4>Safe Packages</h4>

              <span>186 Packages</span>

            </div>

          </div>

          <div className="health-item">

            <TriangleAlert />

            <div>

              <h4>Vulnerable</h4>

              <span>3 Packages</span>

            </div>

          </div>

          <div className="health-item">

            <Package />

            <div>

              <h4>Outdated</h4>

              <span>25 Packages</span>

            </div>

          </div>

          <div className="health-item">

            <ShieldCheck />

            <div>

              <h4>Patch Ready</h4>

              <span>98% Compatible</span>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}

export default RepositoryHealth;