function TypingIndicator() {
  return (
    <div className="copilot-message assistant typing">
      <div className="message-avatar">🤖</div>
      <div className="message-bubble">
        <div className="typing-dots" aria-label="Assistant is typing">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
