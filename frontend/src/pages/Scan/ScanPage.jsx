import "./ScanPage.css";

import { useState } from "react";

import RepoInput from "../../components/RepoInput";
import ScanHistory from "../../components/ScanHistory";
import SuccessModal from "../../components/SuccessModal/SuccessModal";

import { createScan } from "../../services/scanService";

import {
  ShieldCheck,
  GitBranch,
  Sparkles,
} from "lucide-react";

function ScanPage() {

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [scanData, setScanData] = useState(null);

  const startScan = async (repositoryUrl) => {

    try {

      setLoading(true);

      const response = await createScan(repositoryUrl);

      if (response.success) {

        setScanData(response.data);

        setShowModal(true);

      }

      else {

        alert(response.message);

      }

    }

    catch (error) {

      console.error(error);

      alert(

        error?.message ||

        "Unable to start scan."

      );

    }

    finally {

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

          <h2>

            Repository Scanner

          </h2>

        </div>

        <RepoInput

          onScan={startScan}

          loading={loading}

        />

      </section>

      {/* Information */}

      <section className="scan-info-grid">

        <div className="info-card">

          <h3>

            AI Powered Detection

          </h3>

          <p>

            Detect outdated packages,
            vulnerable dependencies,
            supply-chain attacks and CVEs
            instantly.

          </p>

        </div>

        <div className="info-card">

          <h3>

            Automatic Patch Suggestions

          </h3>

          <p>

            Receive intelligent upgrade
            recommendations generated
            by PatchForge AI.

          </p>

        </div>

        <div className="info-card">

          <h3>

            Security Reports

          </h3>

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

        repository={

          scanData?.repositoryUrl || ""

        }

        scanId={

          scanData?.scanId || ""

        }

        onClose={() =>

          setShowModal(false)

        }

      />

    </main>

  );

}

export default ScanPage;