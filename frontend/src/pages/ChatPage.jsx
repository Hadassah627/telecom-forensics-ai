import React from 'react'
import ChatHistoryPanel from '../components/ChatHistoryPanel'
import ReportsPage from './ReportsPage'

export default function ChatPage({
  COMMANDS = [],
  handleCommandClick,
  chatHistory = [],
  chatInput,
  setChatInput,
  handleSendChat,
  startSpeechToText,
  isListening,
  chatLoading,
  chatError,
  onBack,
  onGenerateReport,
  
  // Report Props
  showReport,
  ...reportProps
}) {
  return (
    <>
      <article className="analysis-card">
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '12px' }}>
          <div style={{ flex: '0 0 auto' }}>
            <h2 style={{ margin: 0 }}>AI Chat</h2>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={() => onBack && onBack()} aria-label="Back to Upload">
              Back
            </button>
          </div>
        </div>
        <div className="command-buttons">
          {COMMANDS.map((command) => (
            <button key={command.label} type="button" className="command-btn" onClick={() => handleCommandClick(command.prompt)}>
              {command.label}
            </button>
          ))}
        </div>
        <ChatHistoryPanel history={chatHistory} />
        <form className="chat-form" onSubmit={handleSendChat}>
          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask: show movement of 1" disabled={chatLoading} />
          <button type="button" className="btn-secondary mic-btn" onClick={startSpeechToText} disabled={chatLoading || isListening}>
            {isListening ? 'Listening...' : 'Mic'}
          </button>
          <button type="submit" className="btn-primary" disabled={chatLoading || !chatInput.trim()}>
            {chatLoading ? 'Sending...' : 'Send'}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <button type="button" className="btn-primary" onClick={() => onGenerateReport && onGenerateReport()} aria-label="Generate Report">
            {showReport ? 'Refresh Report' : 'Generate Report'}
          </button>
        </div>

        {chatError && <div className="error">{chatError}</div>}
      </article>

      {showReport && (
        <div className="chat-report-container" style={{ marginTop: '24px' }}>
          <ReportsPage {...reportProps} />
        </div>
      )}
    </>
  )
}
