import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Landing from './pages/Landing'
import Analysis from './pages/Analysis'
import { useEffect, useState } from 'react'
import { checkApi } from './api/client'

function App() {
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const ok = await checkApi()
      if (ok) {
        setApiStatus('connected')
      } else {
        setApiStatus('disconnected')
      }
    } catch (error) {
      setApiStatus('disconnected')
      console.error('Backend connection error:', error)
    }
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="app">
        <Navigation apiStatus={apiStatus} />
        <main>
          <div className="container">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/analysis" element={<Analysis />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
