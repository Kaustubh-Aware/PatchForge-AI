import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiShield, 
  FiUser, 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiCheckCircle, 
  FiAlertCircle,
  FiArrowRight,
  FiTerminal,
  FiCheck
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "developer",
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = calculatePasswordStrength(formData.password);

  const getStrengthLabel = () => {
    if (!formData.password) return { label: "", color: "" };
    if (strengthScore <= 1) return { label: "Weak", color: "#ef4444" };
    if (strengthScore === 2) return { label: "Fair", color: "#f59e0b" };
    if (strengthScore === 3) return { label: "Good", color: "#3b82f6" };
    return { label: "Strong", color: "#22c55e" };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!formData.displayName.trim()) {
      setError("Please enter your display name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreeTerms) {
      setError("Please accept the security terms & privacy policy.");
      return;
    }

    try {
      setLoading(true);
      const res = await signUp(formData.email, formData.password, formData.displayName, formData.role);
      
      if (res?.session) {
        setSuccessMsg("Account registered and authenticated! Redirecting to Dashboard...");
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setSuccessMsg("Account created successfully! Redirecting to login portal...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError(err?.message || "Failed to create account. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-background-glow"></div>
      
      <div className="signup-card">
        <div className="signup-badge">
          <FiTerminal />
          <span>CYBERSECURITY INTELLIGENCE SUITE</span>
        </div>

        <div className="signup-header">
          <div className="signup-brand-icon">
            <FiShield />
          </div>
          <h1>Create Your Account</h1>
          <p>Scan, diagnose, and remediate repository vulnerabilities with PatchForge AI.</p>
        </div>

        {error && (
          <div className="signup-alert error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="signup-alert success">
            <FiCheckCircle />
            <span>{successMsg}</span>
          </div>
        )}

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Role Selection: Developer or User */}
          <div className="role-selector-container">
            <label className="input-label">I am registering as a:</label>
            <div className="role-pills two-options">
              <button
                type="button"
                className={`role-pill ${formData.role === "developer" ? "active" : ""}`}
                onClick={() => handleRoleSelect("developer")}
              >
                Developer
              </button>
              <button
                type="button"
                className={`role-pill ${formData.role === "user" ? "active" : ""}`}
                onClick={() => handleRoleSelect("user")}
              >
                Standard User
              </button>
            </div>
          </div>

          {/* Display Name */}
          <div className="form-field">
            <label className="input-label">Full Name or Alias</label>
            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="displayName"
                placeholder="e.g. Alex Rivera"
                value={formData.displayName}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
              />
            </div>
          </div>

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
            <label className="input-label">Password</label>
            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password (min 6 chars)"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
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

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="password-strength-bar">
                <div className="strength-indicators">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className="strength-step"
                      style={{
                        backgroundColor:
                          step <= strengthScore ? getStrengthLabel().color : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
                <span className="strength-text" style={{ color: getStrengthLabel().color }}>
                  Strength: {getStrengthLabel().label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-field">
            <label className="input-label">Confirm Password</label>
            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Terms Agreement */}
          <label className="terms-checkbox">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              disabled={loading}
            />
            <span className="custom-check">
              {formData.agreeTerms && <FiCheck />}
            </span>
            <span className="terms-text">
              I agree to the PatchForge AI <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
            </span>
          </label>

          {/* Submit CTA */}
          <button type="submit" className="signup-submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loader">Creating Account...</span>
            ) : (
              <>
                <span>Get Started with PatchForge</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
