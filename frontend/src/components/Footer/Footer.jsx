import "./Footer.css";

import {
  ShieldCheck,
  Mail,
  Heart,
  Code2,
  Globe,
  Sparkles,
} from "lucide-react";

function Footer() {
  return (
    <footer className="pf-footer">

      <div className="pf-footer-top">

        <div className="pf-brand">

          <div className="brand-icon">
            <ShieldCheck size={30} />
          </div>

          <div>
            <h2>PatchForge AI</h2>
            <p>
              AI-powered Vulnerability Detection & Intelligent Patch
              Recommendation Platform
            </p>
          </div>

        </div>

        <div className="footer-badge">

          <Sparkles size={18} />

          Built for InnovaHack 2026

        </div>

      </div>

      <div className="footer-divider"></div>

      <div className="footer-grid">

        {/* Project */}

        <div className="footer-column">

          <h4>Project</h4>

          <a href="#">Dashboard</a>

          <a href="#">Repository Scan</a>

          <a href="#">Reports</a>

          <a href="#">AI Recommendations</a>

        </div>

        {/* Technology */}

        <div className="footer-column">

          <h4>Technology</h4>

          <div className="footer-tech">

            <span>React</span>

            <span>Node.js</span>

            <span>Supabase</span>

            <span>Lyzr AI</span>

            <span>OSV API</span>

          </div>

        </div>

        {/* Team */}

        <div className="footer-column">

          <h4>Team Code Warrior</h4>

          <p>Kaustubh Aware (Leader)</p>

          <p>Rohan Dave</p>

          <p>Pratham Kadam</p>

        </div>

        {/* Contact */}

        <div className="footer-column">

          <h4>Quick Links</h4>

          <div className="footer-icons">

            <button>

              <Code2 size={18} />

            </button>

            <button>

              <Globe size={18} />

            </button>

            <button>

              <Mail size={18} />

            </button>

          </div>

        </div>

      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">

        <p>

          © 2026 <strong>PatchForge AI</strong> • Built with

          <Heart
            size={16}
            className="heart"
          />

          by Team Code Warrior

        </p>

        <span>
          Securing Open Source with AI 🚀
        </span>

      </div>

    </footer>
  );
}

export default Footer;