function formatDateTime(value) {
  if (!value) {
    return '-'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString()
}

function CaseListModal({ isOpen, onClose, cases = [], loading, error, onLoadCase, onRefresh }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Saved cases">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Saved Cases</h3>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onRefresh} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {!loading && cases.length === 0 && <p className="muted">No saved cases yet.</p>}

        <ul className="case-list">
          {cases.map((caseItem) => (
            <li key={caseItem.id} className="case-list-item">
              <div>
                <p className="case-name">{caseItem.name}</p>
                <p className="case-time">{formatDateTime(caseItem.created_at)}</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onLoadCase(caseItem.id)}
              >
                Load
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CaseListModal
