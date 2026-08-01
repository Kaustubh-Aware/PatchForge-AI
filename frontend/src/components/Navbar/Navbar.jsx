import "./Navbar.css";

import {
  ShieldCheck,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  GitBranch,
   Cpu,
  UserCircle2
} from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">

      {/* ================= LEFT ================= */}

      <div className="navbar__left">

        <div className="logo">

          <div className="logo__icon">
            <ShieldCheck size={22} />
          </div>

          <div className="logo__text">
            <h2>PatchForge AI</h2>
            <span>AI Security Platform</span>
          </div>

        </div>

      </div>

      {/* ================= CENTER ================= */}

      <div className="navbar__center">

        <button className="repo-switcher">

         <GitBranch size={17} />

          <span>PatchForge-AI</span>

          <ChevronDown size={16} />

        </button>

        <div className="search-container">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search repositories, CVEs, packages..."
          />

          <div className="shortcut">
            CTRL K
          </div>

        </div>

      </div>

      {/* ================= RIGHT ================= */}

      <div className="navbar__right">

        <div className="ai-status">

          <span className="status-dot"></span>

          <Cpu size={16} />

          <span>AI ONLINE</span>

        </div>

        <button className="icon-button">

          <Bell size={20} />

          <span className="notification-badge">
            3
          </span>

        </button>

        <button className="quick-scan">

          <Sparkles size={18} />

          <span>Quick Scan</span>

        </button>

        <button className="profile-button">

          <UserCircle2 size={22} />

          <span>Guest</span>

        </button>

      </div>

    </header>
  );
}

export default Navbar;