import { useMemo } from "react";

function MessageBubble({ message, onCopy, onRegenerate }) {
  const formatted = useMemo(() => {
    if (!message.text) return "";
    return message.text
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n");
  }, [message.text]);

  const timestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "";

  return (
    <div className={`copilot-message ${message.role}`}>
      <div className="message-avatar">{message.role === "assistant" ? "🤖" : "👤"}</div>
      <div className="message-content">
        <div className="message-bubble">
          <div className="message-text" dangerouslySetInnerHTML={{ __html: formatted.replace(/\n/g, "<br />") }} />
        </div>
        <div className="message-meta">
          <span>{timestamp}</span>
          {message.role === "assistant" && (
            <div className="message-actions">
              <button type="button" className="message-action-btn" onClick={() => onCopy(message.text)}>
                Copy
              </button>
              <button type="button" className="message-action-btn" onClick={() => onRegenerate(message)}>
                Regenerate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
