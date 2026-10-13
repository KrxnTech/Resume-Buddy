import { useState } from "react";
import { Mic, Square } from "lucide-react";

function ChatInput({
  onSend,
  disabled,
  placeholder,
  isRecording = false,
  onStartVoice,
  onStopVoice,
  isVoiceSupported = false,
}) {
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();

    if (!trimmed || disabled) return;

    if (isRecording) {
      onStopVoice?.();
    }

    onSend(trimmed);
    setValue("");
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      onStopVoice?.();
    } else {
      onStartVoice?.((transcript) => {
        setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
      });
    }
  };

  return (
    <form className={`copilot-input-form ${isRecording ? "recording-active" : ""}`} onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={
          isRecording
            ? "Listening... Speak your question now"
            : placeholder || "Ask about your skills, projects, ATS, or interview prep..."
        }
        disabled={disabled}
        className={`copilot-input ${isRecording ? "listening-placeholder" : ""}`}
      />

      {/* Voice Speech-to-Text Input Button */}
      {isVoiceSupported && (
        <button
          type="button"
          className={`copilot-voice-btn ${isRecording ? "recording" : ""}`}
          onClick={handleVoiceToggle}
          disabled={disabled}
          title={isRecording ? "Stop listening" : "Voice Input (Speech to text)"}
          aria-label={isRecording ? "Stop voice input" : "Start voice input"}
        >
          {isRecording ? (
            <Square size={14} style={{ color: "var(--clr-error, #D9534F)" }} />
          ) : (
            <Mic size={15} />
          )}
        </button>
      )}

      {/* Send Button */}
      <button
        type="submit"
        className="copilot-send-btn"
        disabled={disabled || !value.trim()}
        title="Send Message"
      >
        {disabled ? (
          <span className="btn-spinner mini" />
        ) : (
          "Send"
        )}
      </button>
    </form>
  );
}

export default ChatInput;
