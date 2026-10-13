function KeywordList({ title, items, emptyText }) {
  let safeItems = [];
  if (Array.isArray(items)) {
    safeItems = items.flatMap((it) =>
      typeof it === "string" ? it.split(",").map((s) => s.trim()).filter(Boolean) : [String(it)]
    );
  } else if (typeof items === "string") {
    safeItems = items.split(",").map((s) => s.trim()).filter(Boolean);
  }

  const isMissing = title?.toLowerCase().includes("missing");

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
        {title}
      </div>
      {safeItems.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {safeItems.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={isMissing ? "chip chip-amber" : "chip chip-blue"}
              style={{ fontSize: "12px", padding: "3px 8px" }}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", margin: 0, fontStyle: "italic" }}>
          {emptyText || "None"}
        </p>
      )}
    </div>
  );
}

export default KeywordList;
