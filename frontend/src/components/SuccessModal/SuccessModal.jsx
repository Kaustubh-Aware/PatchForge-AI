import "./SuccessModal.css";
import { CheckCircle2, GitBranch, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SuccessModal({
    open,
    onClose,
    repository,
    scanId
}) {

    const navigate = useNavigate();

    if (!open) return null;

    return (

        <div className="success-overlay">

            <div className="success-modal">

                <div className="success-icon">

                    <CheckCircle2 size={65} />

                </div>

                <h2>Scan Started Successfully</h2>

                <p>

                    PatchForge AI has accepted your repository.

                </p>

                <div className="success-info">

                    <div className="info-row">

                        <GitBranch size={18} />

                        <span>{repository}</span>

                    </div>

                    <div className="info-row">

                        <strong>Scan ID</strong>

                        <span>{scanId}</span>

                    </div>

                    <div className="info-row">

                        <strong>Status</strong>

                        <span className="running">

                            Running...

                        </span>

                    </div>

                    <div className="info-row">

                        <strong>Estimated Time</strong>

                        <span>20 - 60 Seconds</span>

                    </div>

                </div>

                <div className="modal-buttons">

                    <button

                        className="report-btn"

                        onClick={() =>
                            navigate(`/report/${scanId}`)
                        }

                    >

                        View Report

                        <ArrowRight size={18} />

                    </button>

                    <button

                        className="close-btn"

                        onClick={onClose}

                    >

                        Close

                    </button>

                </div>

            </div>

        </div>

    );

}

export default SuccessModal;