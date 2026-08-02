import { useEffect, useState } from "react";
import "./Dashboard.css";

import FloatingMenu from "../../components/FloatingMenu/FloatingMenu";
import Footer from "../../components/Footer/Footer";

import DashboardHero from "./DashboardHero";
import StatsCards from "./StatsCards";
import RepositoryHealth from "./RepositoryHealth";
import ThreatOverview from "./ThreatOverview";
import TopVulnerabilities from "./TopVulnerabilities";
import RecentScans from "./RecentScans";
import AIRecommendation from "./AIRecommendation";
import SecurityScore from "./SecurityScore";
import ScanHistory from "../../components/ScanHistory";

import { getAllScans } from "../../services/scanService";

function Dashboard() {

    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchScans = async () => {

            try {

                setLoading(true);

                const response = await getAllScans();

                if (response?.success) {

                    setScans(response.data || []);

                } else {

                    setError(response?.message || "Failed to load scans.");

                }

            } catch (err) {

                console.error(err);

                setError(
                    err?.message ||
                    "Unable to connect to backend."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchScans();

    }, []);

    return (

        <main className="dashboard">

            <FloatingMenu />

            <DashboardHero />

            <StatsCards
                scans={scans}
                loading={loading}
            />

            {error && (

                <div className="dashboard-error">

                    {error}

                </div>

            )}

            <section className="dashboard-grid">

                <div className="left-column">

                    <RepositoryHealth
                        scans={scans}
                    />

                    <ThreatOverview
                        scans={scans}
                    />

                    <TopVulnerabilities
                        scans={scans}
                    />

                    <RecentScans
                        scans={scans}
                        loading={loading}
                    />

                </div>

                <div className="right-column">

                    <AIRecommendation
                        scans={scans}
                    />

                    <SecurityScore
                        scans={scans}
                    />

                </div>

            </section>

            <ScanHistory />

            <Footer />

        </main>

    );

}

export default Dashboard;