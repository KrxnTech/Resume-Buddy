import { useNavigate, Link } from "react-router-dom";
import { Target, ArrowRight, ArrowLeft } from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";
import { ScoreCard, ATSBreakdown } from "../components/ResultBox";

function ATS() {
  const { result } = useAnalysis();
  const navigate = useNavigate();
  const analysis = result?.analysis;

  if (!analysis) {
    return (
      <div style={{ maxWidth: "700px", margin: "4rem auto", textAlign: "center", padding: "3rem 2rem", background: "var(--color-bg-primary)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", color: "var(--color-primary)" }}>
          <Target size={24} />
        </div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
          No ATS Data Available
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem", margin: "0 auto 1.5rem", lineHeight: 1.5 }}>
          Upload and analyze your resume first to view the ATS parser scores, formatting benchmarks, and keyword compliance radar.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/upload")}
        >
          Upload Resume <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
          <Link to="/dashboard" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>Dashboard</Link>
          <span>/</span>
          <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>ATS Compatibility</span>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-heading)", margin: "0 0 0.4rem" }}>
          ATS Optimization &amp; Score Breakdown
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem", margin: 0, maxWidth: "720px", lineHeight: 1.5 }}>
          Automated Applicant Tracking Systems (ATS) scan for structured formatting, clear headings, verifiable experience data, and targeted keywords.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <ScoreCard analysis={analysis} />
        <ATSBreakdown analysis={analysis} />
      </div>
    </div>
  );
}

export default ATS;
