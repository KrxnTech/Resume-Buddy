import { useState } from "react";

function ChatInput({ onSend, disabled, placeholder }) {
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();

    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue("");
  };

  return (
    <form className="copilot-input-form" onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder || "Ask about ATS, recruiter feedback, projects, or next steps..."}
        disabled={disabled}
        className="copilot-input"
      />
      <button type="submit" className="copilot-send-btn" disabled={disabled || !value.trim()}>
        {disabled ? "Thinking" : "Send"}
      </button>
    </form>
  );
}

export default ChatInput;
