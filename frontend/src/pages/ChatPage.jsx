import React from 'react'
import ChatHistoryPanel from '../components/ChatHistoryPanel'

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
}) {
  return (
    <div className="ai-chat-card">
      {/* Header */}
      <div className="ai-chat-header">
        <div>
          <h2 className="ai-chat-title">✨ AI Assistant</h2>
          <p className="ai-chat-sub">Ask anything about telecom forensic data</p>
        </div>

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
