import "./Settings.css";
import {
  FiUser,
  FiBell,
  FiMoon,
  FiShield,
  FiDatabase,
  FiSave,
} from "react-icons/fi";

function Settings() {
  return (
    <div className="settings-page">

      <div className="settings-container">

        <h1>Settings</h1>
        <p>Manage your PatchForge AI preferences</p>

        {/* Profile */}

        <div className="settings-card">

          <h2>
            <FiUser />
            Profile
          </h2>

          <input
            type="text"
            placeholder="Your Name"
          />

          <input
            type="email"
            placeholder="Email Address"
          />

        </div>

        {/* Security */}

        <div className="settings-card">

          <h2>
            <FiShield />
            Security
          </h2>

          <label>
            <input type="checkbox" defaultChecked />
            Enable Two-Factor Authentication
          </label>

          <label>
            <input type="checkbox" defaultChecked />
            Encrypt Scan Reports
          </label>

        </div>

        {/* Notifications */}

        <div className="settings-card">

          <h2>
            <FiBell />
            Notifications
          </h2>

          <label>
            <input type="checkbox" defaultChecked />
            Email Notifications
          </label>

          <label>
            <input type="checkbox" />
            Vulnerability Alerts
          </label>

        </div>

        {/* Appearance */}

        <div className="settings-card">

          <h2>
            <FiMoon />
            Appearance
          </h2>

          <select>

            <option>Dark Theme</option>

            <option>Light Theme</option>

          </select>

        </div>

        {/* Database */}

        <div className="settings-card">

          <h2>
            <FiDatabase />
            Repository Settings
          </h2>

          <input
            type="number"
            placeholder="Auto Scan Every (Hours)"
            defaultValue="24"
          />

        </div>

        <button className="save-btn">

          <FiSave />

          Save Changes

        </button>

      </div>

    </div>
  );
}

export default Settings;