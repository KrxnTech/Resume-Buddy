import { useNavigate, Link } from "react-router-dom";
import { Layers, ArrowRight } from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";
import InteractiveSectionAnalyzer from "../components/InteractiveSectionAnalyzer";

function SectionAnalyzer() {
  const { result } = useAnalysis();
  const navigate = useNavigate();
  const analysis = result?.analysis;

  if (!analysis) {
    return (
      <div style={{ maxWidth: "700px", margin: "4rem auto", textAlign: "center", padding: "3rem 2rem", background: "var(--color-bg-primary)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", color: "var(--color-primary)" }}>
          <Layers size={24} />
        </div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
          No Section Data Available
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem", margin: "0 auto 1.5rem", lineHeight: 1.5 }}>
          Upload and analyze a resume first to inspect individual section health, strengths, weaknesses, and keyword coverage.
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
          <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>Section Analysis</span>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-heading)", margin: "0 0 0.4rem" }}>
          Resume Section Analyzer
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem", margin: 0, maxWidth: "720px", lineHeight: 1.5 }}>
          In-depth audit of skills, work history, projects, education, formatting, and contact information.
        </p>
      </div>

      <InteractiveSectionAnalyzer analysis={analysis} />
    </div>
  );
}

export default SectionAnalyzer;
