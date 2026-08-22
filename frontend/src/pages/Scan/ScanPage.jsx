import "./ScanPage.css";

import { useState, useEffect, useRef } from "react";

import RepoInput from "../../components/RepoInput";
import ScanHistory from "../../components/ScanHistory";
import ScanProgress from "../../components/ScanProgress/ScanProgress";
import SuccessModal from "../../components/SuccessModal/SuccessModal";

import { createScan } from "../../services/scanService";

import {
  ShieldCheck,
  GitBranch,
  Sparkles,
  AlertCircle,
} from "lucide-react";

function ScanPage() {

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const stepInterval = useRef(null);

  // Simulate step progression while scan is running
  useEffect(() => {
    if (loading) {
      setCurrentStep(0);

      // Progress through steps at intervals
      const stepTimings = [0, 2000, 5000, 10000, 20000, 35000];
      const timeouts = [];

      stepTimings.forEach((delay, index) => {
        const timeout = setTimeout(() => {
          setCurrentStep(index);
        }, delay);
        timeouts.push(timeout);
      });

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [loading]);

  const startScan = async (repositoryUrl) => {
    try {
      setLoading(true);
      setError("");
      setScanData(null);

      const response = await createScan(repositoryUrl);

      if (response.success) {
        setCurrentStep(6); // All steps complete
        setScanData(response.data);
        setShowModal(true);
      } else {
        setError(response.message || "Scan failed. Please try again.");
      }

    } catch (err) {
      console.error("Scan Error:", err);
      setError(
        err?.message ||
        "Unable to start scan. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <main className="scan-page">

      {/* Hero */}

      <section className="scan-hero">

        <div className="hero-left">

          <span className="hero-badge">

            <Sparkles size={16} />

            PatchForge AI Scanner

          </span>

          <h1>

            Scan Your Repository

            <span> in Seconds</span>

          </h1>

          <p>

            Analyze GitHub repositories for vulnerable
            dependencies, outdated packages, CVEs and
            security risks using AI-powered scanning.

          </p>

        </div>

        <div className="hero-right">

          <div className="scan-icon">

            <ShieldCheck size={80} />

          </div>

        </div>

      </section>

      {/* Repository Scanner */}

      <section className="scan-input-card">

        <div className="card-header">

          <GitBranch size={22} />

          <h2>Repository Scanner</h2>

        </div>

        <RepoInput
          onScan={startScan}
          loading={loading}
        />

      </section>

      {/* Error Message */}

      {error && (
        <section className="scan-error">
          <AlertCircle size={20} />
          <div>
            <strong>Scan Failed</strong>
            <p>{error}</p>
          </div>
          <button onClick={() => setError("")}>Dismiss</button>
        </section>
      )}

      {/* Scan Progress */}

      <ScanProgress
        currentStep={currentStep}
        isScanning={loading}
      />

      {/* Information */}

      <section className="scan-info-grid">

        <div className="info-card">
          <h3>AI Powered Detection</h3>
          <p>
            Detect outdated packages,
            vulnerable dependencies,
            supply-chain attacks and CVEs
            instantly.
          </p>
        </div>

        <div className="info-card">
          <h3>Automatic Patch Suggestions</h3>
          <p>
            Receive intelligent upgrade
            recommendations generated
            by PatchForge AI.
          </p>
        </div>

        <div className="info-card">
          <h3>Security Reports</h3>
          <p>
            Download premium reports with
            severity analysis,
            dependency tree and mitigation
            steps.
          </p>
        </div>

      </section>

      {/* Scan History */}

      <ScanHistory />

      {/* Success Modal */}

      <SuccessModal
        open={showModal}
        repository={scanData?.repositoryUrl || ""}
        scanId={scanData?.scanId || ""}
        vulnerabilities={scanData?.vulnerabilitiesFound || 0}
        dependencies={scanData?.totalDependencies || 0}
        securityScore={scanData?.securityScore || 0}
        onClose={() => setShowModal(false)}
      />

    </main>

  );

}

export default ScanPage;