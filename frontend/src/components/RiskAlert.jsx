function RiskAlert({ riskLevel = 'LOW', reasons = [] }) {
  const level = String(riskLevel || 'LOW').toUpperCase()
  const isHigh = level === 'HIGH'
  const isMedium = level === 'MEDIUM'
  const title = isHigh
    ? 'Suspicious activity detected'
    : isMedium
      ? 'Moderate risk activity detected'
      : 'Low risk profile detected'

  return (
    <div className={`risk-alert ${isHigh ? 'high' : isMedium ? 'medium' : 'low'}`}>
      <p className="risk-alert-title">{`⚠ ${title}`}</p>
      {Array.isArray(reasons) && reasons.length > 0 && (
        <ul className="risk-alert-list">
          {reasons.map((reason, idx) => (
            <li key={`${reason}-${idx}`}>{reason}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default RiskAlert
