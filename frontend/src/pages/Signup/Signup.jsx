import "./Settings.css";
import { useState } from "react";
import { FiUser, FiBell, FiMoon, FiShield, FiDatabase, FiSave } from "react-icons/fi";

function Settings() {
  const [name, setName] = useState("Developer Account");
  const [email, setEmail] = useState("developer@patchforge.ai");
  const [tfa, setTfa] = useState(true);
  const [encrypt, setEncrypt] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [alerts, setAlerts] = useState(false);
  const [theme, setTheme] = useState("Dark Theme");
  const [interval, setIntervalTime] = useState("24");
  const [saveStatus, setSaveStatus] = useState("");

  const handleSaveChanges = () => {
    setSaveStatus("Saving changes...");
    setTimeout(() => {
      // Local storage persistence fallback framework
      const settingsPayload = { name, email, tfa, encrypt, notifications, alerts, theme, interval };
      localStorage.setItem("pf_settings", JSON.stringify(settingsPayload));
      setSaveStatus("✅ Settings updated successfully!");
    }, 800);
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Settings</h1>
        <p>Manage your PatchForge AI preferences</p>
        {saveStatus && <div className="repo-footer" style={{color: "#22c55e", marginBottom: "15px"}}>{saveStatus}</div>}
        
        <div className="settings-card">
          <h2><FiUser />Profile</h2>
          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="settings-card">
          <h2><FiShield />Security</h2>
          <label><input type="checkbox" checked={tfa} onChange={(e) => setTfa(e.target.checked)} />Enable Two-Factor Authentication</label>
          <label><input type="checkbox" checked={encrypt} onChange={(e) => setEncrypt(e.target.checked)} />Encrypt Scan Reports</label>
        </div>

        <div className="settings-card">
          <h2><FiBell />Notifications</h2>
          <label><input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />Email Notifications</label>
          <label><input type="checkbox" checked={alerts} onChange={(e) => setAlerts(e.target.checked)} />Vulnerability Alerts</label>
        </div>

        <div className="settings-card">
          <h2><FiMoon />Appearance</h2>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}><option>Dark Theme</option><option>Light Theme</option></select>
        </div>

        <div className="settings-card">
          <h2><FiDatabase />Repository Settings</h2>
          <input type="number" placeholder="Auto Scan Every (Hours)" value={interval} onChange={(e) => setIntervalTime(e.target.value)} />
        </div>
        <button className="save-btn" onClick={handleSaveChanges}><FiSave />Save Changes</button>
      </div>
    </div>
  );
}
export default Settings;
