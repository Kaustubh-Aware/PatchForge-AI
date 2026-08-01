import { useState } from "react";
import "./Input.css";

function Input({
  label = "",
  type = "text",
  placeholder = "",
  value,
  onChange,

  leftIcon = null,
  rightIcon = null,

  error = "",
  success = false,

  helperText = "",

  required = false,

  disabled = false,

  fullWidth = true,

  className = "",

  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div
      className={`pf-input-wrapper ${
        fullWidth ? "pf-input-full" : ""
      } ${className}`}
    >
      {label && (
        <label className="pf-input-label">
          {label}

          {required && (
            <span className="pf-required">*</span>
          )}
        </label>
      )}

      <div
        className={`pf-input-container
        ${error ? "pf-error" : ""}
        ${success ? "pf-success" : ""}
        ${disabled ? "pf-disabled" : ""}`}
      >
        {leftIcon && (
          <span className="pf-input-icon left">
            {leftIcon}
          </span>
        )}

        <input
          type={inputType}
          className="pf-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />

        {type === "password" ? (
          <button
            type="button"
            className="pf-password-toggle"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        ) : (
          rightIcon && (
            <span className="pf-input-icon right">
              {rightIcon}
            </span>
          )
        )}
      </div>

      {error ? (
        <span className="pf-error-text">
          {error}
        </span>
      ) : helperText ? (
        <span className="pf-helper-text">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}

export default Input;