import { ArrowUpRight } from "lucide-react";

const SAMPLE_JOB_DESC = `Senior Full Stack Engineer
Location: Remote / San Francisco, CA

About the Role:
We are seeking an experienced Full Stack Engineer to build high-scale web platforms and microservices. You will work across modern React frontends and Node.js / PostgreSQL backends with AWS cloud infrastructure.

Key Responsibilities:
• Design, build, and maintain scalable REST and GraphQL APIs using Node.js and Express.
• Develop responsive, performant user interfaces with React, TypeScript, and modern state management.
• Optimize PostgreSQL databases, writing complex queries and improving latency.
• Collaborate with cross-functional teams to deliver CI/CD automation using Docker and GitHub Actions.

Requirements:
• 3+ years of professional full-stack development experience.
• Proficiency in TypeScript, JavaScript, React, Node.js, and relational databases (PostgreSQL/MySQL).
• Familiarity with Docker, Redis caching, and AWS services.
• Strong communication skills and commitment to code quality, testing (Jest), and clean architecture.`;

function JobDescription({ jobDesc, setJobDesc }) {
  const charCount = (jobDesc || "").length;

  const handleUseSample = () => {
    setJobDesc(SAMPLE_JOB_DESC);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <label className="form-label" style={{ marginBottom: 0, fontWeight: 600 }}>
          Target Job Description
        </label>
        <span style={{ fontSize: "0.78rem", color: charCount > 0 ? "var(--color-primary)" : "var(--color-text-muted)", fontWeight: 500 }}>
          {charCount} characters
        </span>
      </div>

      <textarea
        className="form-textarea"
        rows={7}
        placeholder="Paste the target job description here (Role, Responsibilities, Required Skills, Qualifications)..."
        value={jobDesc || ""}
        onChange={(e) => setJobDesc(e.target.value)}
        style={{ minHeight: "150px", fontSize: "0.85rem", lineHeight: 1.5 }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
          Required for ATS matching & keyword gap detection
        </span>
        <button
          type="button"
          onClick={handleUseSample}
          className="btn-link"
          style={{ fontSize: "0.8rem", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "2px" }}
        >
          Use Sample Job Description <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
}

export default JobDescription;
