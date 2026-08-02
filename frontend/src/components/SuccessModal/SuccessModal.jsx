import "./SuccessModal.css";
import { CheckCircle2, ShieldCheck } from "lucide-react";

function SuccessModal({

    open,

    dependencies,

    vulnerabilities,

    onViewReport

}) {

    if (!open) return null;

    return (

        <div className="success-overlay">

            <div className="success-modal">

                <div className="success-icon">

                    <CheckCircle2 size={70} />

                </div>

                <h2>

                    Repository Scanned Successfully

                </h2>

                <p>

                    PatchForge AI completed the security analysis.

                </p>

                <div className="success-stats">

                    <div className="stat">

                        <h3>{dependencies}</h3>

                        <span>Dependencies</span>

                    </div>

                    <div className="stat">

                        <h3>{vulnerabilities}</h3>

                        <span>Vulnerabilities</span>

                    </div>

                </div>

                <button

                    className="report-btn"

                    onClick={onViewReport}

                >

                    <ShieldCheck size={18} />

                    View Security Report

                </button>

            </div>

        </div>

    );

}

export default SuccessModal;