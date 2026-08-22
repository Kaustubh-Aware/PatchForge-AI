import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "65vh",
        textAlign: "center",
        gap: "18px",
        padding: "24px",
      }}
    >
      <ShieldAlert size={64} style={{ color: "var(--primary-light)" }} />
      <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "#fff" }}>404</h1>
      <h2 style={{ fontSize: "1.4rem", color: "var(--text-secondary)" }}>
        Page Not Found
      </h2>
      <p style={{ color: "#94a3b8", maxWidth: "450px", lineHeight: "1.6" }}>
        The security resource or endpoint you requested could not be located.
      </p>
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "12px",
          padding: "12px 24px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, var(--primary), #0ea5e9)",
          color: "#fff",
          fontWeight: "600",
        }}
      >
        <ArrowLeft size={18} />
        Return to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;