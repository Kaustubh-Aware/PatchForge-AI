import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import CyberBackground from "./components/background/CyberBackground";

import Dashboard from "./pages/Dashboard/Dashboard";
import ScanPage from "./pages/Scan/ScanPage";
import ReportPage from "./pages/Report/ReportPage";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <>
      <CyberBackground />
      <Navbar />

      <div className="main-layout">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/report/:scanId" element={<ReportPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;