import { useState, useEffect } from 'react'
import './sidebar.css'

function Icon({ name }) {
  // Minimal inline SVG icons for compact UI
  switch (name) {
    case 'dashboard':
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="12" width="8" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="3" y="13" width="8" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'upload':
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="15" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )
    case 'chat':
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'reports':
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 17v-6a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 15v4a2 2 0 0 1-2 2H7l-4-4V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'settings':
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.28 16.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.7 0 1.27-.39 1.51-1A1.65 1.65 0 0 0 3.93 6.2L3.87 6.14A2 2 0 1 1 6.7 3.3l.06.06c.43.43 1.07.53 1.61.33.54-.2.92-.66 1-1.2V3a2 2 0 1 1 4 0v.09c.08.54.46 1 1 1.2.54.2 1.18.1 1.61-.33l.06-.06A2 2 0 1 1 21.72 7.1l-.06.06c-.2.54-.1 1.18.33 1.61.3.3.66.7.99 1.2H21a2 2 0 1 1 0 4h-.09c-.54 0-1.02.39-1.2 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'help':
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.09 9a3 3 0 1 1 5.83 1c-.39.82-1.4 1.22-2.08 1.5-.64.27-.95.44-.95.95v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return null
  }
}

export default function Sidebar({ initial = 'AI Chat', activeTab: activeProp, onChange, showTop = true, elevateBottom = false }) {
  const [active, setActive] = useState(initial)
  const [open, setOpen] = useState(false)
  // prefer controlled prop when provided
  const selected = activeProp || active

  // close sidebar on route change or resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const items = [
    { key: 'Dashboard', icon: 'dashboard' },
    { key: 'Upload Data', icon: 'upload' },
    { key: 'AI Chat', icon: 'chat' },
    { key: 'Reports / Analysis', icon: 'reports' },
  ]

  return (
    <>
      {/* mobile hamburger - visible on small screens */}
      <button
        className={`tfai-hamburger ${open ? 'open' : ''}`}
        aria-label="Toggle navigation"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="h1" d="M4 7h16" stroke="#d9eefc" strokeWidth="1.6" strokeLinecap="round" />
          <path className="h2" d="M4 12h16" stroke="#d9eefc" strokeWidth="1.6" strokeLinecap="round" />
          <path className="h3" d="M4 17h16" stroke="#d9eefc" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

  <aside className={`tfai-sidebar ${open ? 'open' : ''} ${elevateBottom ? 'elevate-bottom' : ''}`} aria-label="Main navigation">
      {showTop && (
        <div className="sidebar-top">
          <div className="logo-wrap">
            <div className="logo-mark" aria-hidden>
              {/* subtle mark */}
              <svg viewBox="0 0 48 48" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#2b80ff" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <rect x="6" y="6" width="36" height="36" rx="8" fill="url(#g1)" opacity="0.12" />
                <path d="M14 30 L20 18 L28 32" stroke="#8fdcff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="logo-text">Telecom Forensics AI</div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
            {items.map((it) => (
              <button
                key={it.key}
                className={`sidebar-item ${selected === it.key ? 'active' : ''}`}
                onClick={() => {
                  if (onChange) onChange(it.key)
                  else setActive(it.key)
                  setOpen(false)
                }}
                type="button"
                aria-current={selected === it.key}
              >
                <Icon name={it.icon} />
                <span className="item-label">{it.key}</span>
              </button>
            ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-item" type="button" aria-label="Settings">
          <Icon name="settings" />
          <span className="item-label">Settings</span>
        </button>
        <button className="sidebar-item" type="button" aria-label="Help">
          <Icon name="help" />
          <span className="item-label">Help</span>
        </button>
      </div>
    </aside>
    </>
  )
}
