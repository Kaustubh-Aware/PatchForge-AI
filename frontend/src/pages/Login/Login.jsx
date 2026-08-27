import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiShield, 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiAlertCircle, 
  FiCheckCircle,
  FiTerminal,
  FiCheck
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      await signIn(formData.email, formData.password);
      setSuccessMsg("Authentication successful! Redirecting to Dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("email not confirmed")) {
        setError("Email not confirmed. Please check your inbox or sign in with your verified developer credentials.");
      } else if (msg.toLowerCase().includes("invalid login credentials")) {
        setError("Invalid email or password. Please verify your credentials.");
      } else {
        setError(msg || "Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background-glow"></div>

      <div className="login-card">
        <div className="login-badge">
          <FiTerminal />
          <span>SECURITY ACCESS PORTAL</span>
        </div>

        <div className="login-header">
          <div className="login-brand-icon">
            <FiShield />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your security scans, risk reports, and automated patches.</p>
        </div>

        {error && (
          <div className="login-alert error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="login-alert success">
            <FiCheckCircle />
            <span>{successMsg}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-field">
            <label className="input-label">Email Address</label>
            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-field">
            <div className="label-row">
              <label className="input-label">Password</label>
              <span className="forgot-hint">Change in Settings after login</span>
            </div>
            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your security password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="remember-checkbox">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
            />
            <span className="custom-check">
              {formData.rememberMe && <FiCheck />}
            </span>
            <span className="remember-text">Remember this secure device for 30 days</span>
          </label>

          {/* Submit CTA */}
          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loader">Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Platform</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account yet? <Link to="/signup">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;