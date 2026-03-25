function ReportCard({ title, subtitle, children }) {
  return (
    <div className="report-card">
      <div className="report-header">
        <span className="badge">CASE REPORT</span>
        <div className="report-heading">
          <h2>{title}</h2>
          {subtitle ? <p className="report-subtitle">{subtitle}</p> : null}
        </div>
      </div>

      <div className="report-body">{children}</div>
    </div>
  )
}

export default ReportCard
