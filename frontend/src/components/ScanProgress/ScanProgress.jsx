import "./ScanProgress.css";

import { motion, AnimatePresence } from "framer-motion";

import {
  CheckCircle2,
  LoaderCircle,
  SearchCheck,
  ShieldAlert,
  Sparkles,
  GitBranch,
} from "lucide-react";

const steps = [
  {
    title: "Initializing Scan",
    description: "Preparing PatchForge AI engine...",
    icon: <LoaderCircle size={22} />,
  },
  {
    title: "Cloning Repository",
    description: "Downloading repository contents...",
    icon: <GitBranch size={22} />,
  },
  {
    title: "Scanning Dependencies",
    description: "Detecting packages and versions...",
    icon: <SearchCheck size={22} />,
  },
  {
    title: "Checking Vulnerabilities",
    description: "Querying OSV database for CVEs...",
    icon: <ShieldAlert size={22} />,
  },
  {
    title: "Generating AI Analysis",
    description: "PatchForge AI analyzing findings...",
    icon: <Sparkles size={22} />,
  },
  {
    title: "Preparing Report",
    description: "Building security report...",
    icon: <CheckCircle2 size={22} />,
  },
];

function ScanProgress({ currentStep = 0, isScanning = false }) {
  if (!isScanning) return null;

  return (
    <section className="scan-progress">

      <div className="scan-progress-header">
        <div className="scan-loader">
          <div className="loader-ring"></div>
        </div>
        <div>
          <h2>PatchForge AI is Working...</h2>
          <p>
            Please wait while we analyze your repository. This may take 30-90 seconds.
          </p>
        </div>
      </div>

      <div className="progress-list">

        <AnimatePresence>
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`progress-item ${
                index < currentStep
                  ? "completed"
                  : index === currentStep
                  ? "active"
                  : "pending"
              }`}
            >
              <div className="progress-icon">
                {index < currentStep ? (
                  <CheckCircle2 size={22} />
                ) : index === currentStep ? (
                  <LoaderCircle size={22} className="spin" />
                ) : (
                  step.icon
                )}
              </div>

              <div className="progress-text">
                <span className="progress-title">{step.title}</span>
                <span className="progress-desc">{step.description}</span>
              </div>

              {index < currentStep && (
                <span className="progress-check">✓</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

      </div>

    </section>
  );
}

export default ScanProgress;