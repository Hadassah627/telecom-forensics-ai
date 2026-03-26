import { useNavigate } from 'react-router-dom'

function Navigation({ apiStatus }) {
  const navigate = useNavigate()

  return (
    <nav>
      <div className="nav-brand">
        <img src="/ap_police.png" className="nav-logo" alt="AP Police" />
        <h1>
          {"Telecom Forensics AI".split("").map((letter, index) => (
            <span key={index} className="letter" style={{ animationDelay: `${index * 0.08}s` }}>
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </h1>
      </div>
      <div className="nav-buttons">
        <div className="nav-links">
          <a href="#about" className="nav-link">About Us</a>
          <a href="#contact" className="nav-link">Contact Us</a>
        </div>
        <div className={`api-status ${apiStatus}`}>
          {apiStatus === 'connected' && '✓ API Connected'}
          {apiStatus === 'disconnected' && '✗ API Disconnected'}
          {apiStatus === 'checking' && 'Checking API...'}
        </div>
        <button className="btn-primary" onClick={() => navigate('/analysis')}>
          Analyse
        </button>
      </div>
    </nav>
  )
}

export default Navigation
