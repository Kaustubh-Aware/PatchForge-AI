import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import "./ProtectedRoute.css";


// ======================================================
// Protected Route
// ======================================================

function ProtectedRoute() {

  const location = useLocation();

  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();


  // ====================================================
  // Authentication is still being checked
  // ====================================================

  if (loading) {

    return (
      <div className="protected-loading">

        <div className="protected-loading-card">

          <div className="protected-logo">

            <ShieldCheck size={32} />

          </div>


          <Loader2
            size={30}
            className="protected-spinner"
          />


          <h2>
            Securing your session...
          </h2>


          <p>
            Verifying your PatchForge AI
            authentication.
          </p>

        </div>

      </div>
    );
  }


  // ====================================================
  // No authenticated user
  // ====================================================

  if (!isAuthenticated && !user) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }


  // ====================================================
  // Authenticated
  // ====================================================

  return <Outlet />;
}


export default ProtectedRoute;