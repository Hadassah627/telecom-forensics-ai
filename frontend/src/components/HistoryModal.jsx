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

function HistoryModal({
  isOpen,
  onClose,
  sessions = [],
  selectedSessionId,
  historyItems = [],
  loading,
  error,
  onRefreshSessions,
  onSelectSession,
  onLoadHistoryCard,
  onClearAllSessions,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Session history">
      <div className="modal-card history-modal-card">
        <div className="modal-header">
          <h3>Session History</h3>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onRefreshSessions} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Sessions'}
          </button>
          <button type="button" className="btn-secondary" onClick={onClearAllSessions} disabled={loading}>
            {loading ? 'Clearing...' : 'Clear All Sessions'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="history-layout">
          <aside className="history-sessions">
            <h4>Sessions</h4>
            {sessions.length === 0 && !loading && <p className="muted">No sessions available.</p>}
            <ul className="case-list">
              {sessions.map((session) => (
                <li key={session.id} className="case-list-item history-session-item">
                  <button
                    type="button"
                    className={`history-session-btn ${selectedSessionId === session.id ? 'active' : ''}`}
                    onClick={() => onSelectSession(session.id)}
                  >
                    <span className="case-name">{session.name}</span>
                    <span className="case-time">{formatDateTime(session.created_at)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="history-cards">
            <h4>History Cards</h4>
            {selectedSessionId == null && <p className="muted">Select a session to view history cards.</p>}
            {selectedSessionId != null && historyItems.length === 0 && !loading && (
              <p className="muted">No history items in this session yet.</p>
            )}
            {historyItems.map((item) => (
              <article
                key={item.id}
                className="history-card"
                role="button"
                tabIndex={0}
                onClick={() => onLoadHistoryCard(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onLoadHistoryCard(item)
                  }
                }}
              >
                <p className="history-card-title">Query</p>
                <p className="history-card-value">{item.query_text}</p>
                <p className="history-card-title">Summary</p>
                <p className="history-card-value">{item.summary_text}</p>
                <p className="history-card-time">{formatDateTime(item.created_at)}</p>
              </article>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}

export default HistoryModal
