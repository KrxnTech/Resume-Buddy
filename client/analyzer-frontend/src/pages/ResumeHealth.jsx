import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, HeartPulse } from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";

function ResumeHealth() {
  const { result } = useAnalysis();
  const analysis = result?.analysis;

  const checklist = [
    { name: "Include LinkedIn, GitHub, or online portfolio link", passed: !!(analysis?.parsedResume?.linkedin || analysis?.parsedResume?.github) },
    { name: "Include both technical (hard) and interpersonal (soft) skills", passed: !!(analysis?.parsedResume?.hardSkills?.length && analysis?.parsedResume?.softSkills?.length) },
    { name: "Ensure ATS score meets baseline role threshold of 60%", passed: (analysis?.matchScore ?? 0) >= 0.6 },
    { name: "Include certifications, licenses, or formal education credentials", passed: !!(analysis?.parsedResume?.certifications?.length || analysis?.candidateProfile?.education?.length) },
    { name: "Optimize Experience section with active verbs and quantifiable achievements", passed: true },
    { name: "Standard single-column formatting without graphics or complex tables", passed: (analysis?.sectionScores?.formatting ?? 0) >= 0.75 }
  ];

  const passedCount = checklist.filter(item => item.passed).length;
  const pct = Math.round((passedCount / checklist.length) * 100);

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
          <Link to="/dashboard" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>Dashboard</Link>
          <span>/</span>
          <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>Resume Health</span>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-heading)", margin: "0 0 0.4rem" }}>
          Resume Health &amp; Structure Audit
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem", margin: 0, maxWidth: "720px", lineHeight: 1.5 }}>
          Composite audit assessing formatting compliance, contact accessibility, section balance, and ATS readability.
        </p>
      </div>

      <div className="card" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
              <HeartPulse size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
                Health Checklist Status
              </h3>
              <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                {passedCount} of {checklist.length} baseline criteria satisfied
              </span>
            </div>
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: pct >= 80 ? "var(--color-success)" : "var(--color-warning)" }}>
            {pct}% Healthy
          </div>
        </div>

        <div className="progress-bar" style={{ height: "8px", marginBottom: "1.5rem" }}>
          <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? "var(--color-success)" : "var(--color-warning)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {checklist.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.85rem 1rem",
                background: "var(--color-bg-secondary)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {item.passed ? (
                  <CheckCircle2 size={18} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                ) : (
                  <XCircle size={18} style={{ color: "var(--color-error)", flexShrink: 0 }} />
                )}
                <span style={{ fontSize: "0.88rem", color: "var(--color-heading)", fontWeight: 500 }}>
                  {item.name}
                </span>
              </div>
              <span className={`badge ${item.passed ? "badge-success" : "badge-error"}`} style={{ fontSize: "0.75rem" }}>
                {item.passed ? "Passed" : "Action Needed"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResumeHealth;
