import "./ScanProgress.css";

import {
  CheckCircle2,
  LoaderCircle,
  SearchCheck,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

function ScanProgress({ currentStep = 2 }) {
  const steps = [
    {
      title: "Cloning Repository",
      icon: <LoaderCircle size={22} />,
    },
    {
      title: "Scanning Dependencies",
      icon: <SearchCheck size={22} />,
    },
    {
      title: "Searching CVEs",
      icon: <ShieldAlert size={22} />,
    },
    {
      title: "Generating AI Analysis",
      icon: <Sparkles size={22} />,
    },
    {
      title: "Report Ready",
      icon: <CheckCircle2 size={22} />,
    },
  ];

  return (
    <section className="scan-progress">

      <h2>PatchForge AI is Working...</h2>

      <p>
        Please wait while we analyze your repository.
      </p>

      <div className="progress-list">

        {steps.map((step, index) => (

          <div
            key={index}
            className={`progress-item
              ${
                index < currentStep
                  ? "completed"
                  : index === currentStep
                  ? "active"
                  : ""
              }`}
          >
            <div className="progress-icon">

              {index < currentStep ? (
                <CheckCircle2 size={22} />
              ) : (
                step.icon
              )}

            </div>

            <span>{step.title}</span>

          </div>

        ))}

      </div>

      <div className="scan-loader">

        <div className="loader-ring"></div>

      </div>

    </section>
  );
}

export default ScanProgress;