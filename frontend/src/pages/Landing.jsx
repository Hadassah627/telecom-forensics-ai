function Landing() {
  return (
    <div>
      <section className="landing-hero">
        <div className="hero-content">
          <h1>
            {"Telecom Forensics AI".split("").map((letter, index) => (
              <span key={index} className="letter" style={{ animationDelay: `${index * 0.08}s` }}>
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h1>
          <p>
            Advanced AI-powered analysis platform for telecommunications and digital forensics data.
            Uncover patterns, investigate anomalies, and accelerate your forensic investigations.
          </p>
          <button className="btn-primary" onClick={() => window.location.href='/analysis'}>
            Get Started
          </button>
        </div>
      </section>

      <section className="department-section" id="about">
        <div className="department-content">
          <h2>Anantapuram Police Department</h2>
          <p>
            The Anantapuram Police Department is at the forefront of implementing cutting-edge technology 
            to ensure public safety and justice. Our commitment to digital forensics and advanced 
            telecommunications analysis helps us stay ahead in solving complex modern crimes.
          </p>
          <p>
            By leveraging AI-driven platforms, we aim to enhance investigative efficiency, 
            streamline forensic data processing, and provide a safer environment for our citizens through 
            data-driven policing and technological excellence.
          </p>
        </div>
        <div className="department-image">
          <img src="/logo_hackathon.png" alt="Anantapur Police Department" />
        </div>
      </section>

      <h2 className="features-heading">Features</h2>
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

      <footer id="contact">
        <div className="footer-content">
          <h2>Contact Us</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <h3>📍 Address</h3>
              <p>District Police Office, Anantapuram, Andhra Pradesh.</p>
            </div>
            <div className="contact-item">
              <h3>📧 Email</h3>
              <p>padigerijaya@gmail.com</p>
            </div>
            <div className="contact-item">
              <h3>📞 Emergency</h3>
              <p>Dial 100 or 112</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Anantapuram Police Department. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
