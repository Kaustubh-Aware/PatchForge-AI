import "./SuccessModal.css";
import { CheckCircle2, GitBranch, ArrowRight, Shield, Package, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function SuccessModal({
    open,
    onClose,
    repository,
    scanId,
    vulnerabilities = 0,
    dependencies = 0,
    securityScore = 0,
}) {

    const navigate = useNavigate();

    if (!open) return null;

    return (

        <AnimatePresence>
            <motion.div
                className="success-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >

                <motion.div
                    className="success-modal"
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className="success-icon">
                        <CheckCircle2 size={65} />
                    </div>

                    <h2>Scan Completed Successfully</h2>

                    <p>
                        PatchForge AI has finished analyzing your repository.
                    </p>

                    <div className="success-info">

                        <div className="info-row">
                            <GitBranch size={18} />
                            <span>{repository}</span>
                        </div>

                        <div className="info-row">
                            <strong>Scan ID</strong>
                            <span className="scan-id-value">{scanId}</span>
                        </div>

                        <div className="success-stats">
                            <div className="stat-item">
                                <Package size={16} />
                                <div>
                                    <span className="stat-num">{dependencies}</span>
                                    <span className="stat-label">Dependencies</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <Shield size={16} />
                                <div>
                                    <span className="stat-num">{vulnerabilities}</span>
                                    <span className="stat-label">Vulnerabilities</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <Activity size={16} />
                                <div>
                                    <span className="stat-num">{securityScore}</span>
                                    <span className="stat-label">Score</span>
                                </div>
                            </div>
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

                </motion.div>

            </motion.div>
        </AnimatePresence>

    );

}

export default SuccessModal;