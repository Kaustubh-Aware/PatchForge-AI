import "./ReportPage.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { getReport } from "../../services/reportService";

import SeverityCard from "../../components/SeverityCard";
import VulnerabilityTable from "../../components/VulnerabilityTable";

import {
  ShieldCheck,
  GitBranch,
  Package,
  Shield,
  AlertTriangle,
  Clock,
  ArrowLeft,
  RefreshCw,
  Loader2,
  BrainCircuit,
  ExternalLink,
} from "lucide-react";

import CountUp from "../../components/CountUp/CountUp";

// ======================================================
// Security Score Ring Component
// ======================================================

function SecurityScoreRing({ score = 0 }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 90) return "#22c55e";
    if (s >= 75) return "#3b82f6";
    if (s >= 50) return "#f59e0b";
    if (s >= 25) return "#f97316";
    return "#ef4444";
  };

  const getLabel = (s) => {
    if (s >= 90) return "Excellent";
    if (s >= 75) return "Good";
    if (s >= 50) return "Fair";
    if (s >= 25) return "Poor";
    return "Critical";
  };

  return (
    <div className="report-score-ring">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="score-circle-animated"
          style={{
            "--target-offset": offset,
            "--circumference": circumference,
          }}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="score-inner">
        <span className="score-value">
          <CountUp from={0} to={score} duration={1.5} />
        </span>
        <span className="score-label">{getLabel(score)}</span>
      </div>
    </div>
  );
}

// ======================================================
// Report Page
// ======================================================

function ReportPage() {
  const { scanId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getReport(scanId);

      if (response.success) {
        setReport(response.report);
      } else {
        setError(response.message || "Failed to load report.");
      }
    } catch (err) {
      console.error("Report load error:", err);
      setError(err?.message || "Unable to load this report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scanId) {
      loadReport();
    }
  }, [scanId]);

  // Loading State
  if (loading) {
    return (
      <main className="report-page">
        <div className="report-state">
          <Loader2 size={48} className="spin" />
          <h2>Loading Security Report...</h2>
          <p>Scan ID: {scanId}</p>
        </div>
      </main>
    );
  }

  // Error State
  if (error) {
    return (
      <main className="report-page">
        <div className="report-state error">
          <AlertTriangle size={48} />
          <h2>Unable to Load Report</h2>
          <p>{error}</p>
          <div className="state-actions">
            <button onClick={loadReport} className="retry-btn">
              <RefreshCw size={18} />
              Try Again
            </button>
            <button onClick={() => navigate("/scan")} className="back-btn">
              <ArrowLeft size={18} />
              Back to Scanner
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Not Found
  if (!report) {
    return (
      <main className="report-page">
        <div className="report-state">
          <Shield size={48} />
          <h2>Report Not Found</h2>
          <p>No report exists for scan ID: {scanId}</p>
          <button onClick={() => navigate("/scan")} className="back-btn">
            <ArrowLeft size={18} />
            Scan a Repository
          </button>
        </div>
      </main>
    );
  }

  const severityCounts = report.severityCounts || {
    CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0,
  };

  return (
    <main className="report-page">

      {/* Back Navigation */}
      <button className="report-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Header */}
      <motion.div
        className="report-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Security Analysis Report</h1>
          <p className="report-scan-id">
            Scan ID: <span>{report.scanId}</span>
          </p>
        </div>
        <div className="report-status">
          <span className={`status-badge ${report.status?.toLowerCase()}`}>
            {report.status}
          </span>
        </div>
      </motion.div>

      {/* Repository Info */}
      <motion.section
        className="report-repo-info"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="repo-url-row">
          <GitBranch size={20} />
          <a href={report.repositoryUrl} target="_blank" rel="noopener noreferrer">
            {report.repositoryUrl}
            <ExternalLink size={14} />
          </a>
        </div>
        {report.startedAt && (
          <div className="repo-time-row">
            <Clock size={16} />
            <span>Scanned: {new Date(report.startedAt).toLocaleString()}</span>
          </div>
        )}
      </motion.section>

      {/* Security Score + Metrics */}
      <motion.section
        className="report-metrics"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="metrics-score">
          <SecurityScoreRing score={report.securityScore || 0} />
          <h3>Security Score</h3>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <Package size={24} />
            <div className="metric-value">
              <CountUp from={0} to={report.totalDependencies || 0} duration={1.5} />
            </div>
            <span>Dependencies</span>
          </div>

          <div className="metric-card">
            <Shield size={24} />
            <div className="metric-value">
              <CountUp from={0} to={report.vulnerabilitiesFound || 0} duration={1.5} />
            </div>
            <span>Vulnerabilities</span>
          </div>

          <div className="metric-card critical">
            <AlertTriangle size={24} />
            <div className="metric-value">
              <CountUp from={0} to={severityCounts.CRITICAL || 0} duration={1.5} />
            </div>
            <span>Critical</span>
          </div>

          <div className="metric-card high">
            <AlertTriangle size={24} />
            <div className="metric-value">
              <CountUp from={0} to={severityCounts.HIGH || 0} duration={1.5} />
            </div>
            <span>High</span>
          </div>
        </div>
      </motion.section>

      {/* Severity Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SeverityCard
          vulnerabilities={report.vulnerabilities}
          severityCounts={severityCounts}
        />
      </motion.div>

      {/* Vulnerability Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <VulnerabilityTable vulnerabilities={report.vulnerabilities} />
      </motion.div>

      {/* AI Analysis */}
      <motion.section
        className="report-ai-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="ai-section-header">
          <BrainCircuit size={24} />
          <h2>AI Security Analysis</h2>
        </div>

        <div className="ai-analysis-content">
          {report.aiAnalysis ? (
            typeof report.aiAnalysis === "string" ? (
              <div className="ai-text">
                {report.aiAnalysis.split("\n").map((line, i) => (
                  <p key={i}>{line || <br />}</p>
                ))}
              </div>
            ) : (
              <pre className="ai-json">
                {JSON.stringify(report.aiAnalysis, null, 2)}
              </pre>
            )
          ) : (
            <div className="ai-unavailable">
              <BrainCircuit size={32} />
              <p>AI analysis is currently unavailable for this scan.</p>
            </div>
          )}
        </div>
      </motion.section>

    </main>
  );
}

export default ReportPage;