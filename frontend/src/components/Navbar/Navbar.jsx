import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  UserPlus,
  Zap,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard",        path: "/dashboard", icon: <LayoutDashboard size={16} /> },
    { name: "Scan Repository",  path: "/scan",       icon: <SearchCode size={16} />     },
    { name: "Settings",         path: "/settings",   icon: <Settings size={16} />        },
  ];

  const isActive = (path) => {
    if (path === "/dashboard" && (location.pathname === "/" || location.pathname === "/dashboard")) return true;
    return location.pathname === path;
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || null;

  const drawerVariants = {
    hidden:  { opacity: 0, y: -20, scaleY: 0.95 },
    visible: { opacity: 1, y: 0,   scaleY: 1,    transition: { duration: 0.25, ease: "easeOut" } },
    exit:    { opacity: 0, y: -12, scaleY: 0.95, transition: { duration: 0.18, ease: "easeIn"  } },
  };

  const linkVariants = {
    hidden:  { opacity: 0, x: -12 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.06, duration: 0.22 } }),
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-pill">

        {/* ── Logo ─────────────────────────────────── */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="navbar-logo-icon">
            <ShieldCheck size={20} />
          </div>
          <span className="navbar-logo-text">
            PatchForge<span className="navbar-logo-ai"> AI</span>
          </span>
        </Link>

        {/* ── Center Links ─────────────────────────── */}
        <div className="navbar-links">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`navbar-link ${active ? "navbar-link--active" : ""}`}
              >
                {link.icon}
                <span>{link.name}</span>
                {active && (
                  <motion.span
                    className="navbar-link-indicator"
                    layoutId="active-nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right Actions ────────────────────────── */}
        <div className="navbar-actions">
          {user ? (
            <Link to="/settings" className="navbar-user-pill">
              <div className="navbar-user-avatar">
                <User size={14} />
              </div>
              <span>{displayName}</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="navbar-ghost-btn">
                <LogIn size={15} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="navbar-ghost-btn">
                <UserPlus size={15} />
                <span>Sign Up</span>
              </Link>
            </>
          )}

          <Link to="/scan" className="navbar-shine-btn">
            <span className="navbar-shine-sweep" />
            <Zap size={14} />
            <span>Start Scan</span>
          </Link>

          {/* Hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="navbar-mobile-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.name} custom={i} variants={linkVariants} initial="hidden" animate="visible">
                <Link
                  to={link.path}
                  className={`navbar-mobile-link ${isActive(link.path) ? "navbar-mobile-link--active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              </motion.div>
            ))}

            <div className="navbar-mobile-divider" />

            {user ? (
              <Link to="/settings" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <User size={16} />
                <span>Account ({displayName})</span>
              </Link>
            ) : (
              <>
                <Link to="/login"  className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}><LogIn size={16} /><span>Login</span></Link>
                <Link to="/signup" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}><UserPlus size={16} /><span>Create Account</span></Link>
              </>
            )}

            <Link to="/scan" className="navbar-mobile-cta" onClick={() => setMobileMenuOpen(false)}>
              <Zap size={16} />
              <span>Start Free Scan</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
