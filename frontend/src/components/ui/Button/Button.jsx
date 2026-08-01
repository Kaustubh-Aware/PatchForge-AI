import "./Button.css";

function Button({
  children,

  variant = "primary",

  size = "md",

  leftIcon = null,

  rightIcon = null,

  loading = false,

  disabled = false,

  fullWidth = false,

  rounded = false,

  onClick,

  type = "button",

  className = "",

  ...props
}) {
  const classes = [
    "pf-button",
    `pf-${variant}`,
    `pf-${size}`,
    rounded ? "pf-rounded" : "",
    fullWidth ? "pf-full-width" : "",
    loading ? "pf-loading" : "",
    disabled ? "pf-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {/* Animated Border */}
      <span className="pf-border"></span>

      {/* Animated Glow */}
      <span className="pf-glow"></span>

      {/* Hover Shine */}
      <span className="pf-shine"></span>

      {/* Ripple Container */}
      <span className="pf-ripple"></span>

      {/* Content */}
      <span className="pf-content">
        {loading ? (
          <>
            <span className="pf-loader"></span>

            <span className="pf-loading-text">
              AI Processing...
            </span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="pf-icon left">
                {leftIcon}
              </span>
            )}

            <span className="pf-text">
              {children}
            </span>

            {rightIcon && (
              <span className="pf-icon right">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </span>
    </button>
  );
}

export default Button;