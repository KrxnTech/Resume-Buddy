function PriorityBadge({ priority }) {
  const normalized = (priority || "MEDIUM").toUpperCase();
  let badgeClass = "badge-neutral";
  if (normalized === "HIGH") badgeClass = "badge-error";
  if (normalized === "MEDIUM") badgeClass = "badge-warning";
  if (normalized === "LOW") badgeClass = "badge-neutral";

  return (
    <span
      className={`badge ${badgeClass}`}
      style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px" }}
    >
      {normalized}
    </span>
  );
}

export default PriorityBadge;
