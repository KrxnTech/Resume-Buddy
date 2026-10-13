import { useState, useMemo } from "react";
import {
  Bot,
  User,
  Pause,
  Play,
  Volume2,
  Square,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";
import { renderMarkdownToHTML } from "../utils/markdownParser";

function MessageBubble({
  message,
  onCopy,
  onRegenerate,
  onSpeak,
  onStopSpeech,
  isSpeaking = false,
  isPaused = false,
}) {
  const [copied, setCopied] = useState(false);

  const formattedHTML = useMemo(() => {
    return renderMarkdownToHTML(message.text || "");
  }, [message.text]);

  const handleCopyClick = () => {
    onCopy(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "";

  return (
    <div className={`copilot-message ${message.role}`}>
      <div className="message-avatar">
        {message.role === "assistant" ? <Bot size={15} /> : <User size={15} />}
      </div>

      <div className="message-content">
        <div className={`message-bubble ${isSpeaking ? "speech-active" : ""}`}>
          <div
            className="message-text markdown-body"
            dangerouslySetInnerHTML={{ __html: formattedHTML }}
          />
        </div>

        <div className="message-meta">
          <span className="message-timestamp">{timestamp}</span>

          {message.role === "assistant" && (
            <div className="message-actions">
              {/* Voice Speak / Pause / Resume Button */}
              <button
                type="button"
                className={`message-action-btn speak-btn ${isSpeaking ? "active-speaking" : ""} ${isPaused ? "active-paused" : ""}`}
                onClick={() => onSpeak(message.id, message.text)}
                title={isSpeaking ? "Pause Speech" : isPaused ? "Resume Speech" : "Read Aloud"}
                aria-label="Speak response"
              >
                {isSpeaking ? (
                  <>
                    <Pause size={12} /> Pause
                  </>
                ) : isPaused ? (
                  <>
                    <Play size={12} /> Resume
                  </>
                ) : (
                  <>
                    <Volume2 size={12} /> Speak
                  </>
                )}
              </button>

              {/* Stop button when actively playing speech */}
              {(isSpeaking || isPaused) && (
                <button
                  type="button"
                  className="message-action-btn stop-speech-btn"
                  onClick={onStopSpeech}
                  title="Stop Speech"
                  aria-label="Stop speech"
                >
                  <Square size={12} /> Stop
                </button>
              )}

              {/* Copy Button */}
              <button
                type="button"
                className="message-action-btn copy-btn"
                onClick={handleCopyClick}
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={12} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} /> Copy
                  </>
                )}
              </button>

              {/* Regenerate Button */}
              <button
                type="button"
                className="message-action-btn regen-btn"
                onClick={() => onRegenerate(message)}
                title="Regenerate answer"
                aria-label="Regenerate response"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
