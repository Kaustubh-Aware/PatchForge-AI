import "./Login.css";
import { FiLock, FiMail, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          <FiShield />
          <h1>PatchForge AI</h1>
          <p>Cyber Security Intelligence Platform</p>
        </div>

        <form>

          <div className="input-box">
            <FiMail />
            <input
              type="email"
              placeholder="Email Address"
            />
          </div>

          <div className="input-box">
            <FiLock />
            <input
              type="password"
              placeholder="Password"
            />
          </div>

          <button className="login-btn">
            Login
          </button>

        </form>

        <p className="signup-link">
          Don't have an account?
          <Link to="/signup"> Sign Up</Link>
        </p>

      </div>

    </div>
  );
};

export default Login;