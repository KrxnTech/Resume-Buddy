function SuggestedQuestions({ suggestions, onSelect }) {
  return (
    <div className="copilot-suggestions">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          className="copilot-suggestion-pill"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

export default SuggestedQuestions;
