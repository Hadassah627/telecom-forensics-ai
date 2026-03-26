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
    <div className="ai-chat-card">
      {/* Header */}
      <div className="ai-chat-header">
        <div>
          <h2 className="ai-chat-title">✨ AI Assistant</h2>
          <p className="ai-chat-sub">Ask anything about telecom forensic data</p>
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
        <div className="ai-chat-header-actions">
          <button type="button" className="btn-small clear-chat" onClick={() => window.location.reload()}>
            Clear Chat
          </button>
          <button type="button" className="btn-small" onClick={() => onBack && onBack()}>
            Back
          </button>
        </div>
      </div>

      {/* Quick action chips */}
      <div className="ai-chat-chips">
        {COMMANDS.map((command) => (
          <button
            key={command.label}
            type="button"
            className="chip"
            onClick={() => handleCommandClick(command.prompt)}
          >
            {command.label}
          </button>
        ))}
      </div>

      {/* Chat history */}
      <div className="ai-chat-history">
        <ChatHistoryPanel history={chatHistory} />
      </div>

      {/* Input area */}
      <div className="ai-chat-input-wrap">
        <form className="ai-chat-form" onSubmit={handleSendChat}>
          <input
            className="ai-chat-input"
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask anything about telecom data..."
            disabled={chatLoading}
          />

          <div className="ai-chat-actions">
            <button type="button" className="mic-btn" onClick={startSpeechToText} disabled={chatLoading || isListening}>
              {isListening ? 'Listening...' : 'Mic'}
            </button>
            <button
              type="submit"
              className="send-btn"
              disabled={chatLoading || !chatInput.trim()}
            >
              {chatLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>

        <div className="ai-chat-example">Example: Show movement of +91XXXXXXXXXX last week</div>
      </div>

      {/* Generate Report (minimal) */}
      <div className="ai-chat-generate">
        <button type="button" className="generate-btn" onClick={() => onGenerateReport && onGenerateReport()}>
          Generate Report
        </button>
        <div className="generate-note">Your analysis will appear below</div>
      </div>

      {chatError && <div className="error">{chatError}</div>}
    </div>
  )
}
