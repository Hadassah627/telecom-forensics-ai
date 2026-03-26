function ChatHistoryPanel({ history }) {
  if (!history.length) {
    return <p className="muted">No messages yet. Ask a forensic query.</p>
  }

  return (
    <div className="chat-history-list">
      {history.map((item) => (
        <div key={item.id} className={`chat-bubble ${item.role === 'user' ? 'user' : 'assistant'}`}>
          <div className="chat-content">
            <p>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatHistoryPanel
