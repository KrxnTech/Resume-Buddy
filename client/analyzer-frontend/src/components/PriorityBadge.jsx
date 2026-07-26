function PriorityBadge({ priority }) {
  const normalized = (priority || "MEDIUM").toUpperCase();
  let tone = "medium";

  if (normalized === "HIGH") tone = "high";
  if (normalized === "LOW") tone = "low";

  return <span className={`priority-badge ${tone}`}>{normalized}</span>;
}

export default PriorityBadge;
