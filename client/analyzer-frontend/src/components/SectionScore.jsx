function scoreColor(score) {
  if (score >= 0.75) return { stroke: "var(--color-success, #00A86B)", text: "var(--color-success, #00A86B)" };
  if (score >= 0.5) return { stroke: "var(--color-warning, #E5A000)", text: "var(--color-warning, #E5A000)" };
  return { stroke: "var(--color-error, #D9534F)", text: "var(--color-error, #D9534F)" };
}

function SectionScore({ score = 0, size = 44 }) {
  const safeScore = Math.min(1, Math.max(0, score || 0));
  const strokeWidth = 3.5;
  const radius = size / 2 - strokeWidth - 1;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - safeScore * circumference;
  const color = scoreColor(safeScore);

  return (
    <div
      className="section-score-wrap"
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border, #EEEEEE)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: size >= 48 ? "13px" : "11px",
            fontWeight: 600,
            color: color.text,
            lineHeight: 1,
            fontFamily: "var(--font-sans, sans-serif)",
          }}
        >
          {Math.round(safeScore * 100)}
        </span>
      </div>
    </div>
  );
}

export default SectionScore;
