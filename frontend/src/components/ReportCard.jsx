const ReportCard = ({ report }) => {

  if (!report) return null;

  return (
    <div className="report-card">

      <h2>Repository Report</h2>

      <div className="report-grid">

        <div>
          <h4>Repository</h4>
          <p>{report.repositoryUrl}</p>
        </div>

        <div>
          <h4>Status</h4>
          <p>{report.status}</p>
        </div>

        <div>
          <h4>Total Dependencies</h4>
          <p>{report.totalDependencies}</p>
        </div>

        <div>
          <h4>Vulnerabilities</h4>
          <p>{report.vulnerabilitiesFound}</p>
        </div>

        <div>
          <h4>Started At</h4>
          <p>{new Date(report.startedAt).toLocaleString()}</p>
        </div>

      </div>

      <div className="ai-analysis">

        <h3>🤖 AI Analysis</h3>

        <pre>
          {report.aiAnalysis
            ? JSON.stringify(report.aiAnalysis, null, 2)
            : "No AI Analysis Available"}
        </pre>

      </div>

    </div>
  );
};

export default ReportCard;