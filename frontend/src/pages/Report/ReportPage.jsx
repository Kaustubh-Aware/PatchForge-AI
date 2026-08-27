import "./ReportPage.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { getReport } from "../../services/reportService";

import SeverityCard from "../../components/SeverityCard";
import VulnerabilityTable from "../../components/VulnerabilityTable";

import {
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
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Download,
  FileCode,
  Copy,
  Check
} from "lucide-react";

import CountUp from "../../components/CountUp/CountUp";
import CircularScore from "../../components/ui/CircularScore/CircularScore";

// ======================================================
// Security Score Ring
// ======================================================

function SecurityScoreRing({ score = 0 }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));

  const getLabel = (s) => {
    if (s >= 90) return "Excellent";
    if (s >= 75) return "Good";
    if (s >= 50) return "Fair";
    if (s >= 25) return "Poor";
    return "Critical";
  };

  return (
    <div className="report-score-ring">
      <CircularScore score={safeScore} size={130} stroke={9} />
      <span className="score-rating">{getLabel(safeScore)}</span>
    </div>
  );
}



// ======================================================
// AI Analysis Component
// ======================================================

function AIAnalysisView({ rawAnalysis }) {
  if (!rawAnalysis) {
    return (
      <div className="ai-unavailable">
        <BrainCircuit size={32} />
        <h3>AI Analysis Currently Unavailable</h3>
        <p>
          Automated intelligence heuristics and remediation models will populate once scan processing finalizes.
        </p>
      </div>
    );
  }

  if (typeof rawAnalysis === "object") {
    const parsed = rawAnalysis;
    return (
      <div className="ai-structured">
        {parsed.executive_summary && (
          <div className="ai-block">
            <h3><Sparkles size={18} /> Executive Threat Summary</h3>
            <p>{parsed.executive_summary}</p>
          </div>
        )}

        {Array.isArray(parsed.remediation_plan) && parsed.remediation_plan.length > 0 && (
          <div className="ai-block">
            <h3><CheckCircle2 size={18} /> Remediation & Patching Strategy</h3>
            <div className="ai-remediation-list">
              {parsed.remediation_plan.map((plan, index) => (
                <div key={index} className="ai-plan-item">
                  <div className="plan-item-top">
                    <strong>{plan?.package || "Dependency"}</strong>
                    {plan?.fixed_version && (
                      <span className="fixed-version-tag">Fix: {plan.fixed_version}</span>
                    )}
                  </div>
                  <p>{plan?.action || plan?.reason || JSON.stringify(plan)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(parsed.developer_recommendations) && parsed.developer_recommendations.length > 0 && (
          <div className="ai-block">
            <h3><Shield size={18} /> Developer Recommendations</h3>
            <ul className="ai-rec-list">
              {parsed.developer_recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ai-text">
      {String(rawAnalysis).split("\n").map((line, index) => (
        <p key={index}>{line || <br />}</p>
      ))}
    </div>
  );
}

// ======================================================
// Report Page Main
// ======================================================

function ReportPage() {
  const { scanId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const loadReport = async () => {
    if (!scanId) {
      setLoading(false);
      setError("No scan ID was provided.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getReport(scanId);
      if (response?.success && response?.report) {
        setReport(response.report);
        setError("");
      } else {
        setReport(null);
        setError(response?.message || "Failed to load report.");
      }
    } catch (err) {
      console.error("Report load error:", err);
      setReport(null);
      setError(err?.message || "Unable to load this report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scanId) return;
    let cancelled = false;

    const fetchReport = async () => {
      try {
        const response = await getReport(scanId);
        if (cancelled) return;

        if (response?.success && response?.report) {
          setReport(response.report);
          setError("");
        } else {
          setReport(null);
          setError(response?.message || "Failed to load report.");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Report load error:", err);
        setReport(null);
        setError(err?.message || "Unable to load this report.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchReport();
    return () => {
      cancelled = true;
    };
  }, [scanId]);

  // Export JSON Report Handler
  const handleExportJSON = () => {
    if (!report) return;

    const severityCounts = report.severityCounts || {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };

    const vulnerabilities = Array.isArray(report.vulnerabilities)
      ? report.vulnerabilities
      : [];

    const exportData = {
      scanId: report.scanId || scanId,
      repositoryUrl: report.repositoryUrl || "",
      startedAt: report.startedAt || new Date().toISOString(),
      completedAt: report.completedAt || new Date().toISOString(),
      status: report.status || "Completed",
      securityScore: report.securityScore ?? 100,
      totalDependencies: report.totalDependencies || 0,
      vulnerabilitiesFound: report.vulnerabilitiesFound || vulnerabilities.length,
      severityCounts: severityCounts,
      vulnerabilities: vulnerabilities,
      aiAnalysis: report.aiAnalysis || null,
      exportedAt: new Date().toISOString(),
      scanner: "PatchForge AI Security Suite v2.0",
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `patchforge-report-${report.scanId || scanId || "scan"}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!scanId) {
    return (
      <main className="report-page">
        <div className="report-state">
          <AlertTriangle size={48} />
          <h2>Invalid Report</h2>
          <p>No scan ID was provided.</p>
          <button onClick={() => navigate("/scan")} className="back-btn">
            <ArrowLeft size={18} /> Back to Scanner
          </button>
        </div>
      </main>
    );
  }

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

  if (error) {
    return (
      <main className="report-page">
        <div className="report-state error">
          <AlertTriangle size={48} />
          <h2>Unable to Load Report</h2>
          <p>{error}</p>
          <div className="state-actions">
            <button onClick={loadReport} className="retry-btn">
              <RefreshCw size={18} /> Try Again
            </button>
            <button onClick={() => navigate("/scan")} className="back-btn">
              <ArrowLeft size={18} /> Back to Scanner
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="report-page">
        <div className="report-state">
          <Shield size={48} />
          <h2>Report Not Found</h2>
          <p>No report exists for scan ID: {scanId}</p>
          <button onClick={() => navigate("/scan")} className="back-btn">
            <ArrowLeft size={18} /> Scan a Repository
          </button>
        </div>
      </main>
    );
  }

  const severityCounts = report.severityCounts || {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  const vulnerabilities = Array.isArray(report.vulnerabilities)
    ? report.vulnerabilities
    : [];

  return (
    <main className="report-page">
      {/* Top Navigation & Action Controls */}
      <div className="report-top-bar">
        <button className="report-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="report-top-actions">
          <button
            className="export-json-btn"
            onClick={handleExportJSON}
            title="Download full scan data in JSON format"
            id="export-json-report-btn"
          >
            <Download size={17} />
            <span>Export JSON Report</span>
          </button>

          <button
            className="copy-link-btn"
            onClick={handleCopyLink}
            title="Copy Report URL"
          >
            {copiedLink ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedLink ? "Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

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
            Scan ID: <span>{report.scanId || scanId}</span>
          </p>
        </div>

        <div className="report-header-right">
          <button
            className="export-json-btn header-export"
            onClick={handleExportJSON}
            id="export-json-report-btn-header"
          >
            <FileCode size={18} />
            <span>Export JSON Report</span>
          </button>

          <span
            className={`status-badge ${(report.status || "completed").toLowerCase()}`}
          >
            {report.status || "Completed"}
          </span>
        </div>
      </motion.div>

      {/* Repository Information */}
      <motion.section
        className="report-repo-info"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="repo-url-row">
          <GitBranch size={20} />
          <a
            href={report.repositoryUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {report.repositoryUrl || "Repository unavailable"}
            <ExternalLink size={14} />
          </a>
        </div>

        {report.startedAt && (
          <div className="repo-time-row">
            <Clock size={16} />
            <span>
              Scanned: {new Date(report.startedAt).toLocaleString()}
            </span>
          </div>
        )}
      </motion.section>

      {/* Metrics */}
      <motion.section
        className="report-metrics"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="metrics-score">
          <SecurityScoreRing score={report.securityScore ?? 100} />
          <h3>Security Score</h3>
        </div>

        <div className="metrics-grid">
          {/* Dependencies */}
          <div className="metric-card">
            <Package size={24} />
            <div className="metric-value">
              <CountUp from={0} to={report.totalDependencies || 0} duration={1.5} />
            </div>
            <span>Dependencies</span>
          </div>

          {/* Vulnerabilities */}
          <div className="metric-card">
            <Shield size={24} />
            <div className="metric-value">
              <CountUp
                from={0}
                to={report.vulnerabilitiesFound || vulnerabilities.length || 0}
                duration={1.5}
              />
            </div>
            <span>Vulnerabilities</span>
          </div>

          {/* Critical */}
          <div className="metric-card critical">
            <AlertTriangle size={24} />
            <div className="metric-value">
              <CountUp from={0} to={severityCounts.CRITICAL || 0} duration={1.5} />
            </div>
            <span>Critical</span>
          </div>

          {/* High */}
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
          vulnerabilities={vulnerabilities}
          severityCounts={severityCounts}
        />
      </motion.div>

      {/* Vulnerability Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <VulnerabilityTable vulnerabilities={vulnerabilities} />
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
          <h2>AI Security Analysis & Recommendations</h2>
        </div>

        <div className="ai-analysis-content">
          <AIAnalysisView rawAnalysis={report.aiAnalysis} />
        </div>
      </motion.section>
    </main>
  );
}

export default ReportPage;