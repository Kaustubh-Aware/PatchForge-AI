import "./Signup.css";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiShield,
} from "react-icons/fi";

function Signup() {
  return (
    <div className="signup-page">

      <div className="signup-card">

        <div className="signup-header">

          <FiShield className="shield-icon"/>

          <h1>Create Account</h1>

          <p>
            Join PatchForge AI Security Platform
          </p>

        </div>

        <form className="signup-form">

          <div className="input-group">

            <FiUser />

            <input
              type="text"
              placeholder="Full Name"
            />

          </div>

          <div className="input-group">

            <FiMail />

            <input
              type="email"
              placeholder="Email Address"
            />

          </div>

          <div className="input-group">

            <FiLock />

            <input
              type="password"
              placeholder="Password"
            />

          </div>

          <div className="input-group">

            <FiLock />

            <input
              type="password"
              placeholder="Confirm Password"
            />

          </div>

          <button className="signup-btn">
            Create Account
          </button>

        </form>

        <p className="login-text">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;