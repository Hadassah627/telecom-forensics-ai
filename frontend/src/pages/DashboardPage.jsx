import React from 'react'

export default function DashboardPage({ totalRecords = 0, suspectsFound = 0, activeCases = 0, recentActivity = [] }) {
  return (
    <section className="dashboard-grid">
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Records Processed</h3>
          <p className="dashboard-value">{totalRecords}</p>
        </div>

        <div className="dashboard-card">
          <h3>Suspects Found</h3>
          <p className="dashboard-value">{suspectsFound}</p>
        </div>

        <div className="dashboard-card">
          <h3>Active Cases</h3>
          <p className="dashboard-value">{activeCases}</p>
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="recent-activity-list">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((it, idx) => (
                <div key={idx} className="recent-item">
                  <div className="recent-title">{it.title || it.name || 'Activity'}</div>
                  <div className="recent-meta muted">{it.time || it.date || ''}</div>
                </div>
              ))
            ) : (
              <p className="muted">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
