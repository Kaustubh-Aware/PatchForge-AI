import "./FloatingMenu.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const navigate = useNavigate();

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
      path: "/scan",
    },
    {
      icon: <ShieldAlert size={20} />,
      label: "Vulnerabilities",
      path: "/scan",
    },
    {
      icon: <GitBranch size={20} />,
      label: "Repository Health",
      path: "/scan",
    },
    {
      icon: <FileText size={20} />,
      label: "Reports",
      path: "/scan",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      path: "/dashboard",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/dashboard",
    },
  ];

  return (
    <>
      {!open && (
        <button
          className="floating-toggle"
          onClick={() => setOpen(true)}
        >
          <Menu size={28} />
        </button>
      )}

      {open && (
        <div
          className="floating-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`floating-sidebar ${open ? "show" : ""}`}>
        <button
          className="sidebar-close"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </button>

        <div className="sidebar-header">
          <div className="brand-icon">
            <ShieldCheck size={28} />
          </div>

          <div>
            <h2>PatchForge AI</h2>
            <span>Cybersecurity Platform</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className={`menu-card ${
                active === item.label ? "active" : ""
              }`}
              onClick={() => {
                setActive(item.label);
                navigate(item.path);
                setOpen(false);
              }}
            >
              <div className="menu-left">
                {item.icon}
                <span>{item.label}</span>
              </div>

              <ChevronRight size={18} />
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button
            className="scan-button"
            onClick={() => {
              navigate("/scan");
              setOpen(false);
            }}
          >
            <Sparkles size={18} />
            Start AI Scan
          </button>

          <small>PatchForge AI • Version 2.0</small>
        </div>
      </aside>
    </>
  );
}