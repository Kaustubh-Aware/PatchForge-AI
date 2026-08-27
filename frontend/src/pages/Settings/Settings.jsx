import { useState, useEffect } from "react";
import { 
  FiUser, 
  FiBell, 
  FiMoon, 
  FiShield, 
  FiDatabase, 
  FiSave, 
  FiKey, 
  FiLogOut, 
  FiCheckCircle, 
  FiAlertCircle,
  FiSliders,
  FiLock,
  FiEye,
  FiEyeOff
} from "react-icons/fi";
import { useAuth, supabase } from "../../contexts/AuthContext";
import "./Settings.css";

function Settings() {
  const { user, signOut } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.display_name || "",
    email: user?.email || "",
    role: user?.user_metadata?.role || "developer",
    tfa: true,
    encryptReports: true,
    autoScanInterval: "24",
    defaultBranch: "main",
    emailAlerts: true,
    criticalOnlyAlerts: false,
    webhookUrl: "",
    theme: "Dark Cyber (Default)",
    enableAnimations: true,
  });

  // Password update state
  const [passwordState, setPasswordState] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [savedStatus, setSavedStatus] = useState("");
  const [apiKey, setApiKey] = useState("pf_live_99a8b7c6d5e4f3a2b1c0");
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user?.user_metadata?.display_name || prev.name,
        email: user?.email || prev.email,
        role: user?.user_metadata?.role || prev.role,
      }));
    }

    const savedSettings = localStorage.getItem("pf_user_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {}
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (savedStatus) setSavedStatus("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordState((prev) => ({ ...prev, [name]: value }));
    if (passwordError) setPasswordError("");
    if (passwordMsg) setPasswordMsg("");
  };

  const handleSave = async () => {
    localStorage.setItem("pf_user_settings", JSON.stringify(formData));

    // Also update Supabase user metadata if logged in
    try {
      if (user && supabase?.auth?.updateUser) {
        await supabase.auth.updateUser({
          data: {
            display_name: formData.name,
            role: formData.role,
          },
        });
      }
    } catch (e) {
      console.warn("Could not sync profile to Supabase:", e.message);
    }

    setSavedStatus("Preferences and profile successfully saved!");
    setTimeout(() => {
      setSavedStatus("");
    }, 3000);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMsg("");

    if (!passwordState.newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }

    if (passwordState.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);
      if (!supabase?.auth?.updateUser) {
        throw new Error("Supabase auth client is not active.");
      }

      const { data, error } = await supabase.auth.updateUser({
        password: passwordState.newPassword,
      });

      if (error) throw error;

      setPasswordMsg("Password successfully updated in Supabase Auth!");
      setPasswordState({ newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMsg(""), 4000);
    } catch (err) {
      setPasswordError(err?.message || "Failed to update password. Please check your session.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRegenerateKey = () => {
    const newKey = "pf_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    setCopiedKey(false);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        
        {/* Header */}
        <div className="settings-header">
          <div className="settings-title-group">
            <div className="settings-icon-badge">
              <FiSliders />
            </div>
            <div>
              <h1>Platform Settings & Credentials</h1>
              <p>Manage your developer profile, change passwords, and configure scanning engine rules.</p>
            </div>
          </div>

          <button className="save-top-btn" onClick={handleSave}>
            <FiSave />
            <span>Save Preferences</span>
          </button>
        </div>

        {savedStatus && (
          <div className="settings-saved-banner">
            <FiCheckCircle />
            <span>{savedStatus}</span>
          </div>
        )}

        <div className="settings-grid">
          
          {/* Section 1: Profile & Identity */}
          <div className="settings-card">
            <div className="card-header">
              <FiUser className="section-icon" />
              <div>
                <h2>Profile & Identity</h2>
                <p>Manage your developer credentials and platform identifier.</p>
              </div>
            </div>

            <div className="card-body">
              <div className="setting-field">
                <label>Display Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kaustubh Aware"
                />
              </div>

              <div className="setting-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="developer@company.com"
                  disabled={true}
                />
              </div>

              <div className="setting-field">
                <label>Assigned Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="developer">Developer</option>
                  <option value="security_analyst">Security Analyst</option>
                  <option value="admin">Enterprise Administrator</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Change Password */}
          <div className="settings-card">
            <div className="card-header">
              <FiLock className="section-icon" />
              <div>
                <h2>Change Password</h2>
                <p>Update your Supabase authentication password.</p>
              </div>
            </div>

            <div className="card-body">
              {passwordError && (
                <div className="settings-card-alert error">
                  <FiAlertCircle />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordMsg && (
                <div className="settings-card-alert success">
                  <FiCheckCircle />
                  <span>{passwordMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="change-pass-form">
                <div className="setting-field">
                  <label>New Password</label>
                  <div className="pass-input-row">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordState.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Minimum 6 characters"
                    />
                    <button
                      type="button"
                      className="eye-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="setting-field">
                  <label>Confirm New Password</label>
                  <div className="pass-input-row">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordState.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="update-pass-btn"
                  disabled={passwordLoading || !passwordState.newPassword}
                >
                  {passwordLoading ? "Updating Password..." : "Update Supabase Password"}
                </button>
              </form>
            </div>
          </div>

          {/* Section 3: Security & Encryption */}
          <div className="settings-card">
            <div className="card-header">
              <FiShield className="section-icon" />
              <div>
                <h2>Security & Encryption</h2>
                <p>Hardening policies and cryptographic report protections.</p>
              </div>
            </div>

            <div className="card-body">
              <label className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-title">Two-Factor Authentication (2FA)</span>
                  <span className="toggle-desc">Enforce TOTP authenticator verification on sign-in.</span>
                </div>
                <input
                  type="checkbox"
                  name="tfa"
                  checked={formData.tfa}
                  onChange={handleChange}
                />
              </label>

              <label className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-title">Encrypt Stored Scan Reports</span>
                  <span className="toggle-desc">Encrypt detailed dependency reports using AES-256 in Supabase.</span>
                </div>
                <input
                  type="checkbox"
                  name="encryptReports"
                  checked={formData.encryptReports}
                  onChange={handleChange}
                />
              </label>

              <div className="api-key-box">
                <div className="api-key-header">
                  <span className="api-key-label"><FiKey /> API Secret Key</span>
                  <button type="button" className="regen-btn" onClick={handleRegenerateKey}>Regenerate</button>
                </div>
                <div className="api-key-input-group">
                  <input type="text" readOnly value={apiKey} />
                  <button type="button" className="copy-btn" onClick={handleCopyKey}>
                    {copiedKey ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Scanning Engine & Automation */}
          <div className="settings-card">
            <div className="card-header">
              <FiDatabase className="section-icon" />
              <div>
                <h2>Scanning Engine</h2>
                <p>Configure automated repository polling and vulnerability thresholds.</p>
              </div>
            </div>

            <div className="card-body">
              <div className="setting-field">
                <label>Automatic Rescan Frequency</label>
                <select name="autoScanInterval" value={formData.autoScanInterval} onChange={handleChange}>
                  <option value="6">Every 6 Hours</option>
                  <option value="12">Every 12 Hours</option>
                  <option value="24">Every 24 Hours (Recommended)</option>
                  <option value="168">Weekly (168 Hours)</option>
                  <option value="0">Manual Scans Only</option>
                </select>
              </div>

              <div className="setting-field">
                <label>Default Git Target Branch</label>
                <input
                  type="text"
                  name="defaultBranch"
                  value={formData.defaultBranch}
                  onChange={handleChange}
                  placeholder="main"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Alerts & Notifications */}
          <div className="settings-card">
            <div className="card-header">
              <FiBell className="section-icon" />
              <div>
                <h2>Alerts & Notifications</h2>
                <p>Receive vulnerability reports via email and webhooks.</p>
              </div>
            </div>

            <div className="card-body">
              <label className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-title">Email Security Summaries</span>
                  <span className="toggle-desc">Receive executive risk digests when scans complete.</span>
                </div>
                <input
                  type="checkbox"
                  name="emailAlerts"
                  checked={formData.emailAlerts}
                  onChange={handleChange}
                />
              </label>

              <label className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-title">Critical-Only Filter</span>
                  <span className="toggle-desc">Suppress notifications for Low and Medium severity findings.</span>
                </div>
                <input
                  type="checkbox"
                  name="criticalOnlyAlerts"
                  checked={formData.criticalOnlyAlerts}
                  onChange={handleChange}
                />
              </label>

              <div className="setting-field">
                <label>Webhook URL (Slack / Discord / Teams)</label>
                <input
                  type="url"
                  name="webhookUrl"
                  value={formData.webhookUrl}
                  onChange={handleChange}
                  placeholder="https://hooks.slack.com/services/..."
                />
              </div>
            </div>
          </div>

          {/* Section 6: Account Actions */}
          <div className="settings-card danger-zone">
            <div className="card-header">
              <FiLogOut className="section-icon danger" />
              <div>
                <h2>Session Management</h2>
                <p>Sign out of the current device or terminate active sessions.</p>
              </div>
            </div>

            <div className="card-body">
              <div className="danger-action-row">
                <div>
                  <span className="toggle-title">End Active Session</span>
                  <p className="toggle-desc">Sign out of PatchForge AI on this browser.</p>
                </div>
                <button
                  type="button"
                  className="logout-btn"
                  onClick={() => signOut()}
                >
                  <FiLogOut />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="settings-footer-actions">
          <button className="save-bottom-btn" onClick={handleSave}>
            <FiSave />
            <span>Save All Changes</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Settings;