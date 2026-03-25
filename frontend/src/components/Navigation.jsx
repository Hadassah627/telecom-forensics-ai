import { useNavigate } from 'react-router-dom'

function Navigation({ apiStatus }) {
  const navigate = useNavigate()

  return (
    <nav>
      <h1>Telecom Forensics AI</h1>
      <div className="nav-buttons">
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
