function JobDescription({ jobDesc, setJobDesc }) {
  const charCount = jobDesc.length;

  return (
    <div>
      <div className="section-label" style={{ justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          Job Description
        </span>
        <span style={{ fontSize: "0.75rem", color: charCount > 0 ? "var(--clr-accent-2)" : "var(--clr-text-3)", fontWeight: 500 }}>
          {charCount} chars
        </span>
      </div>
      <textarea
        className="job-textarea"
        rows="6"
        placeholder="Paste the complete Job Description here -> Role • Required Skills • Responsibilities • Qualifications"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />
    </div>
  );
}

export default JobDescription;
