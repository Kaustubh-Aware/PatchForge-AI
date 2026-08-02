const SeverityCard = ({ vulnerabilities }) => {

  const counts = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  vulnerabilities?.forEach((item) => {
    const severity = item.severity?.toUpperCase();

    if (counts[severity] !== undefined) {
      counts[severity]++;
    }
  });

  return (
    <div className="severity-card">

      <h2>Severity Overview</h2>

      <div className="severity-grid">

        <div className="severity-box critical">
          <h3>Critical</h3>
          <p>{counts.CRITICAL}</p>
        </div>

        <div className="severity-box high">
          <h3>High</h3>
          <p>{counts.HIGH}</p>
        </div>

        <div className="severity-box medium">
          <h3>Medium</h3>
          <p>{counts.MEDIUM}</p>
        </div>

        <div className="severity-box low">
          <h3>Low</h3>
          <p>{counts.LOW}</p>
        </div>

      </div>

    </div>
  );
};

export default SeverityCard;