import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Search,
  LayoutDashboard,
  FileText,
  Settings,
  Sparkles,
} from "lucide-react";
import "./FloatingMenu.css";

const fabActions = [
  {
    id: "scan",
    label: "Start Scan",
    icon: Search,
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.15)",
    border: "rgba(6, 182, 212, 0.35)",
    action: (navigate) => navigate("/scan"),
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.15)",
    border: "rgba(139, 92, 246, 0.35)",
    action: (navigate) => navigate("/dashboard"),
  },
  {
    id: "reports",
    label: "View Reports",
    icon: FileText,
    color: "#ec4899",
    bg: "rgba(236, 72, 153, 0.15)",
    border: "rgba(236, 72, 153, 0.35)",
    action: (navigate) => {
      const el = document.querySelector(".scan-history");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else navigate("/scan");
    },
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    color: "#22c55e",
    bg: "rgba(34, 197, 94, 0.15)",
    border: "rgba(34, 197, 94, 0.35)",
    action: (navigate) => navigate("/settings"),
  },
];

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleActionClick = (actionFn) => {
    setIsOpen(false);
    actionFn(navigate);
  };

  return (
    <div className="fab-container">
      {/* Expanded Quick Action Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="fab-menu-items">
            {fabActions.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  className="fab-item-row"
                  initial={{ opacity: 0, y: 15, scale: 0.75 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      delay: (fabActions.length - 1 - index) * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.75,
                    transition: { duration: 0.15 },
                  }}
                >
                  <motion.span
                    className="fab-item-label"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    {item.label}
                  </motion.span>

                  <button
                    className="fab-item-btn"
                    onClick={() => handleActionClick(item.action)}
                    style={{
                      color: item.color,
                      background: item.bg,
                      borderColor: item.border,
                      boxShadow: "0 0 16px " + item.border,
                    }}
                    title={item.label}
                    aria-label={item.label}
                  >
                    <Icon size={18} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger FAB */}
      <motion.button
        className={"fab-trigger " + (isOpen ? "fab-trigger--active" : "")}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Toggle Quick Navigation"
        title="Quick Navigation"
      >
        {/* Glowing pulse ring */}
        <span className="fab-glow-ring" />

        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="fab-icon-wrapper"
        >
          {isOpen ? <Plus size={24} /> : <Sparkles size={22} />}
        </motion.div>
      </motion.button>
    </div>
  );
}