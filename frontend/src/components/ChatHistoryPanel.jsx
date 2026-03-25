function ChatHistoryPanel({ history }) {
  if (!history.length) {
    return <p className="muted">No messages yet. Ask a forensic query on the right panel.</p>
  }

  return (
    <div className="chat-history-list">
      {history.map((item) => (
        <div key={item.id} className={`chat-bubble ${item.role}`}>
          <div className="chat-meta">{item.role === 'user' ? 'You' : 'Assistant'}</div>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  )
}

export default ChatHistoryPanel
