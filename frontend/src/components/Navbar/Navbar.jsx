import "./Navbar.css";
import { Link } from "react-router-dom";

import {
  ShieldCheck,
  Search,
  Settings2
} from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">

      {/* ========================= */}
      {/* LOGO */}
      {/* ========================= */}

      <div className="navbar__logo">

        <Link to="/" className="logo-link">

          <div className="logo-icon">
            <ShieldCheck size={26} />
          </div>

          <div className="logo-text">
            <h2>PatchForge AI</h2>
            <span>AI Powered Security Platform</span>
          </div>

        </Link>

      </div>

      {/* ========================= */}
      {/* SEARCH */}
      {/* ========================= */}

      <div className="navbar__search">

        <Search
          size={18}
          className="search-icon"
        />

        <input
          type="text"
          placeholder="Search repositories, CVEs, vulnerabilities..."
        />

        <div className="shortcut">

          Ctrl + K

        </div>

      </div>

      {/* ========================= */}
      {/* ACTIONS */}
      {/* ========================= */}

      <div className="navbar__actions">

        {/* SETTINGS */}

        <Link
          to="/settings"
          className="settings-btn"
          title="Settings"
        >
          <Settings2 size={22} />
        </Link>

        {/* LOGIN */}

        <Link
          to="/login"
          className="login-btn"
        >
          Login
        </Link>

        {/* SIGNUP */}

        <Link
          to="/signup"
          className="signup-btn-nav"
        >
          Sign Up
        </Link>

      </div>

    </header>
  );
}

export default Navbar;