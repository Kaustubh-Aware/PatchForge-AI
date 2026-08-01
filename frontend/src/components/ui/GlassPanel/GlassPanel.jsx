import "./GlassPanel.css";

function GlassPanel({
  children,
  className = "",
  hover = true,
}) {
  return (
    <div
      className={`glass-panel ${
        hover ? "glass-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default GlassPanel;