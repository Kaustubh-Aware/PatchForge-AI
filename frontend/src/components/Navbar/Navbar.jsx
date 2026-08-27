import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  SearchCode,
  Settings,
  LogIn,
  Sparkles,
  Menu,
  X,
  User,
  UserPlus
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Scan Repository",
      path: "/scan",
      icon: <SearchCode size={18} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={18} />,
    },
  ];

  const isActive = (path) => {
    if (path === "/dashboard" && (location.pathname === "/" || location.pathname === "/dashboard")) {
      return true;
    }
    return location.pathname === path;
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || null;

  return (
    <header className="navbar-container">
      <nav className="navbar">
        {/* 1. BRAND LOGO */}
        <div className="navbar__logo">
          <Link to="/" className="logo-link" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon-wrapper">
              <div className="logo-glow"></div>
              <div className="logo-icon">
                <ShieldCheck size={26} />
              </div>
            </div>

            <div className="logo-text">
              <div className="logo-title-row">
                <h2>PatchForge AI</h2>
                <span className="version-pill">v2.0</span>
              </div>
              <span className="logo-subtitle">Cybersecurity Intelligence</span>
            </div>
          </Link>
        </div>

        {/* 2. CENTER NAVIGATION LINKS */}
        <div className="navbar__nav-links">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link-item ${active ? "active" : ""}`}
              >
                {link.icon}
                <span>{link.name}</span>
                {active && <div className="nav-active-pill" />}
              </Link>
            );
          })}
        </div>

        {/* 3. RIGHT ACTIONS */}
        <div className="navbar__actions">
          {user ? (
            <Link to="/settings" className="navbar-user-pill" title="View Account Settings">
              <div className="navbar-user-avatar">
                <User size={15} />
              </div>
              <span className="navbar-user-name">{displayName}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar-login-btn"
              >
                <LogIn size={17} />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className="navbar-signup-btn"
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </Link>
            </>
          )}

          <Link
            to="/scan"
            className="navbar-scan-cta"
          >
            <Sparkles size={16} />
            <span>Start Scan</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* 4. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-links">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`mobile-link-item ${isActive(link.path) ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            <div className="mobile-drawer-divider" />

            {user ? (
              <Link
                to="/settings"
                className="mobile-link-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                <span>Account ({displayName})</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-link-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="mobile-link-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </Link>
              </>
            )}

            <Link
              to="/scan"
              className="mobile-cta-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles size={16} />
              <span>Start Free Scan</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;