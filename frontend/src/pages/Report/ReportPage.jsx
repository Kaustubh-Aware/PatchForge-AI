import "./ReportPage.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getReport } from "../../services/reportService";

import ReportCard from "../../components/ReportCard/ReportCard";
import SeverityCard from "../../components/SeverityCard/SeverityCard";
import VulnerabilityTable from "../../components/VulnerabilityTable/VulnerabilityTable";

function ReportPage() {

    const { scanId } = useParams();

    const [loading, setLoading] = useState(true);

    const [report, setReport] = useState(null);

    useEffect(() => {

        const loadReport = async () => {

            try {

                const response = await getReport(scanId);

                if (response.success) {

                    setReport(response.data);

                }

            }

            catch (err) {

                console.error(err);

            }

            finally {

                setLoading(false);

            }

        };

        loadReport();

    }, [scanId]);

    if (loading) {

        return (

            <div className="report-loading">

                Loading Security Report...

            </div>

        );

    }

    if (!report) {

        return (

            <div className="report-loading">

                Report Not Found

            </div>

        );

    }

    return (

        <main className="report-page">

            <div className="report-header">

                <h1>

                    Security Analysis Report

                </h1>

                <p>

                    Scan ID : {report.scanId}

                </p>

            </div>

            <section className="report-summary">

                <ReportCard
                    title="Repository"
                    value={report.repositoryUrl}
                />

                <ReportCard
                    title="Dependencies"
                    value={report.totalDependencies}
                />

                <ReportCard
                    title="Vulnerabilities"
                    value={report.vulnerabilitiesFound}
                />

                <ReportCard
                    title="Status"
                    value={report.status}
                />

            </section>

            <SeverityCard report={report} />

            <VulnerabilityTable report={report} />

        </main>

    );

}

export default ReportPage;