function Landing() {
  return (
    <div>
      <section className="landing-hero">
        <h1>Telecom Forensics AI</h1>
        <p>
          Advanced AI-powered analysis platform for telecommunications and digital forensics data.
          Uncover patterns, investigate anomalies, and accelerate your forensic investigations.
        </p>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>📊 CDR Analysis</h3>
          <p>
            Analyze Call Detail Records to identify call patterns, frequency, and duration
            relationships between suspects and persons of interest.
          </p>
        </div>

        <div className="feature-card">
          <h3>🗼 Tower Data</h3>
          <p>
            Examine cell tower data to track movement patterns, location history, and physical
            presence at specific times and locations.
          </p>
        </div>

        <div className="feature-card">
          <h3>🌐 Internet Protocol</h3>
          <p>
            Process IPDR (IP Detail Records) to trace internet activity, data usage,
            and online behavior for digital evidence collection.
          </p>
        </div>

        <div className="feature-card">
          <h3>🔍 Crime Scene Correlation</h3>
          <p>
            Correlate telecom data with crime scene information to establish alibis,
            timelines, and suspect connections.
          </p>
        </div>

        <div className="feature-card">
          <h3>⚙️ AI-Powered Insights</h3>
          <p>
            Leverage advanced AI algorithms to automatically detect patterns, anomalies,
            and potential leads in complex forensic datasets.
          </p>
        </div>

        <div className="feature-card">
          <h3>📈 Network Visualization</h3>
          <p>
            Visualize communication networks, relationships, and interaction patterns
            to better understand suspect networks and connections.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Landing
