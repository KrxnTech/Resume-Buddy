import PriorityBadge from "./PriorityBadge";

function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        background: "var(--color-bg-secondary, #FAFAFA)",
        border: "1px solid var(--color-border, #EEEEEE)",
        borderRadius: "var(--radius-sm, 4px)",
        marginBottom: "0.5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.4rem" }}>
        <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 600, color: "var(--color-heading, #222222)" }}>
          {recommendation.title}
        </h4>
        <PriorityBadge priority={recommendation.priority} />
      </div>

      {recommendation.detail && (
        <p style={{ margin: "0 0 0.6rem", fontSize: "0.85rem", color: "var(--color-text, #424242)", lineHeight: 1.5 }}>
          {recommendation.detail}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.78rem", color: "var(--color-text-secondary, #666666)" }}>
        {recommendation.impact && (
          <span>
            Impact: <strong style={{ color: "var(--color-heading, #222222)" }}>{recommendation.impact}</strong>
          </span>
        )}
        {recommendation.difficulty && (
          <span>
            Difficulty: <strong style={{ color: "var(--color-heading, #222222)" }}>{recommendation.difficulty}</strong>
          </span>
        )}
      </div>
    </div>
  );
}

export default RecommendationCard;
