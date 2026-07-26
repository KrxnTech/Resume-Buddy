function KeywordList({ title, items, emptyText }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="keyword-list">
      <div className="keyword-list-title">{title}</div>
      {safeItems.length > 0 ? (
        <div className="keyword-chips">
          {safeItems.map((item, index) => (
            <span key={`${item}-${index}`} className="keyword-chip">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="keyword-empty">{emptyText}</p>
      )}
    </div>
  );
}

export default KeywordList;
