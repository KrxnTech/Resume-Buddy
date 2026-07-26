function scoreColor(score) {
  if (score >= 0.75) return { stroke: "#22c55e", text: "var(--clr-green)" };
  if (score >= 0.5) return { stroke: "#fbbf24", text: "var(--clr-yellow)" };
  return { stroke: "#f87171", text: "var(--clr-red)" };
}

function SectionScore({ score = 0, size = 64 }) {
  const safeScore = Math.min(1, Math.max(0, score || 0));
  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - safeScore * circumference;
  const color = scoreColor(safeScore);

  return (
    <div className="section-score-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="section-score-svg">
        <circle cx={size / 2} cy={size / 2} r={radius} className="section-score-bg" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="section-score-ring"
          stroke={color.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="section-score-text">
        <span className="section-score-value" style={{ color: color.text }}>
          {Math.round(safeScore * 100)}
        </span>
      </div>
    </div>
  );
}

export default SectionScore;
