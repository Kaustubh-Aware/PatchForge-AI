import "./AIRecommendation.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  BrainCircuit,
  ShieldCheck,
  Package,
  Sparkles,
  ArrowUpRight,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function AIRecommendation({ scans = [] }) {
  const navigate = useNavigate();

  const completedScans = scans.filter((s) => s.status === "Completed");
  const latestScan = completedScans[0];

  const hasAnalysis = Boolean(latestScan?.aiAnalysis);

  const confidence = latestScan
    ? Math.min(99, Math.max(85, (latestScan.securityScore || 80) + 10))
    : 95;

  return (
    <motion.section
      className="ai-panel"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="ai-glow"></div>

      <div className="ai-header">
        <div className="ai-icon">
          <BrainCircuit size={34} />
        </div>

        <div>
          <span className="ai-label">PATCHFORGE AI ENGINE</span>
          <h2>AI Security Intelligence</h2>
          <p>
            {latestScan
              ? `Analysis for ${latestScan.repositoryUrl.replace(/^https?:\/\/github\.com\//, "")}`
              : "Intelligent vulnerability analysis and patch suggestions"}
          </p>
        </div>
      </div>

      <div className="confidence-box">
        <div>
          <span>AI Engine Status</span>
          <h1>{latestScan ? "ACTIVE" : "READY"}</h1>
        </div>

        <div className="confidence-ring">
          <svg>
            <circle cx="55" cy="55" r="45"></circle>
            <circle
              cx="55"
              cy="55"
              r="45"
              className="progress"
              style={{
                strokeDasharray: 283,
                strokeDashoffset: 283 - (confidence / 100) * 283,
              }}
            ></circle>
          </svg>
          <span>{confidence}%</span>
        </div>
      </div>

      <div className="recommendation-grid">
        <div className="info-card">
          <Package />
          <div>
            <small>Dependencies</small>
            <h4>{latestScan ? `${latestScan.totalDependencies} Packages` : "0 Packages"}</h4>
          </div>
        </div>

        <div className="info-card success">
          <ShieldCheck />
          <div>
            <small>Vulnerabilities</small>
            <h4>{latestScan ? `${latestScan.vulnerabilitiesFound} Found` : "0 Found"}</h4>
          </div>
        </div>

        <div className="info-card warning">
          <Sparkles />
          <div>
            <small>Security Posture</small>
            <h4>
              {latestScan
                ? (latestScan.securityScore >= 80 ? "STRONG" : "AT RISK")
                : "PENDING"}
            </h4>
          </div>
        </div>

        <div className="info-card">
          <CheckCircle2 />
          <div>
            <small>AI Model</small>
            <h4>Lyzr + OSV</h4>
          </div>
        </div>
      </div>

      <div className="reasoning">
        <h3>AI Analysis Insights</h3>
        {hasAnalysis ? (
          <div className="ai-reasoning-text">
            {typeof latestScan.aiAnalysis === "string" ? (
              latestScan.aiAnalysis.slice(0, 300) + (latestScan.aiAnalysis.length > 300 ? "..." : "")
            ) : (
              <ul>
                <li>Scanned all direct and transitive dependencies.</li>
                <li>Mapped packages against official OSV vulnerability feed.</li>
                <li>Severity weighted security score computed.</li>
                <li>Intelligent remediation paths generated.</li>
              </ul>
            )}
          </div>
        ) : (
          <ul>
            <li>Run a repository scan to generate customized AI reasoning.</li>
            <li>Detects outdated packages and supply-chain threats.</li>
            <li>Suggests compatibility-verified safe package versions.</li>
            <li>Automated patch generation powered by PatchForge AI.</li>
          </ul>
        )}
      </div>

      <div className="ai-actions">
        <button
          className="generate-btn"
          onClick={() => navigate("/scan")}
        >
          {latestScan ? "Scan Another Repo" : "Start New Scan"}
          <ArrowUpRight size={18} />
        </button>

        {latestScan && (
          <button
            className="analysis-btn"
            onClick={() => navigate(`/report/${latestScan.scanId}`)}
          >
            <FileText size={18} />
            View Full Report
          </button>
        )}
      </div>
    </motion.section>
  );
}