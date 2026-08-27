import "./FloatingMenu.css";

import { useState } from "react";
import {
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  X,
  ShieldCheck,
  LayoutDashboard,
  Search,
  BrainCircuit,
  ShieldAlert,
  GitBranch,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";


// ======================================================
// Floating Sidebar Menu
// ======================================================

export default function FloatingMenu() {

  const [open, setOpen] = useState(false);

  const location = useLocation();


  // ====================================================
  // Sidebar Navigation
  // ====================================================

  const menuItems = [

    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },

    {
      icon: <Search size={20} />,
      label: "Scan Repository",
      path: "/scan",
    },

    {
      icon: <BrainCircuit size={20} />,
      label: "AI Analysis",
      path: "/dashboard",
    },

    {
      icon: <ShieldAlert size={20} />,
      label: "Vulnerabilities",
      path: "/dashboard",
    },

    {
      icon: <GitBranch size={20} />,
      label: "Repository Health",
      path: "/dashboard",
    },

    {
      icon: <FileText size={20} />,
      label: "Reports",
      path: "/dashboard",
    },

    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      path: "/dashboard",
    },

    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/settings",
    },

  ];


  // ====================================================
  // Active State
  // ====================================================

  const isActive = (path) => {

    if (
      path === "/dashboard" &&
      (
        location.pathname === "/" ||
        location.pathname === "/dashboard"
      )
    ) {
      return true;
    }

    return location.pathname === path;
  };


  // ====================================================
  // Close Sidebar
  // ====================================================

  const closeSidebar = () => {
    setOpen(false);
  };


  // ====================================================
  // Render
  // ====================================================

  return (
    <>

      {/* ==================================================
          Floating Menu Button
      ================================================== */}

      {!open && (

        <button
          className="floating-toggle"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
        >

          <Menu size={28} />

        </button>

      )}


      {/* ==================================================
          Overlay
      ================================================== */}

      {open && (

        <div
          className="floating-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />

      )}


      {/* ==================================================
          Sidebar
      ================================================== */}

      <aside
        className={`floating-sidebar ${
          open ? "show" : ""
        }`}
      >


        {/* =================================================
            Close Button
        ================================================= */}

        <button
          className="sidebar-close"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        >

          <X size={20} />

        </button>


        {/* =================================================
            Header
        ================================================= */}

        <div className="sidebar-header">

          <div className="brand-icon">

            <ShieldCheck size={28} />

          </div>


          <div>

            <h2>
              PatchForge AI
            </h2>

            <span>
              Cybersecurity Platform
            </span>

          </div>

        </div>


        <div className="sidebar-divider" />


        {/* =================================================
            Navigation
        ================================================= */}

        <nav
          className="sidebar-menu"
          aria-label="Main navigation"
        >

          {menuItems.map((item) => (

            <NavLink
              key={item.label}
              to={item.path}
              className={() =>
                `menu-card ${
                  isActive(item.path)
                    ? "active"
                    : ""
                }`
              }
              onClick={closeSidebar}
            >

              <div className="menu-left">

                {item.icon}

                <span>
                  {item.label}
                </span>

              </div>


              <ChevronRight size={18} />

            </NavLink>

          ))}

        </nav>


        {/* =================================================
            Footer
        ================================================= */}

        <div className="sidebar-footer">

          <NavLink
            to="/scan"
            className="scan-button"
            onClick={closeSidebar}
          >

            <Sparkles size={18} />

            <span>
              Start New Scan
            </span>

          </NavLink>

        </div>

      </aside>

    </>
  );
}