import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";


import Dashboard from "./pages/Dashboard/Dashboard";
import ReportPage from "./pages/Report/ReportPage";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import ScanPage from "./pages/Scan/ScanPage";

function App() {
  return (
    <>
      <Navbar />

      <div className="main-layout">
        

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
   
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/report/:scanId" element={<ReportPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;