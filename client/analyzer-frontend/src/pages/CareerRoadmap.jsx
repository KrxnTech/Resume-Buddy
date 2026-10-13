import { Link, useNavigate } from "react-router-dom";
import { Target, CheckCircle2, AlertTriangle, BookOpen, Briefcase, ArrowRight, Layers, Info } from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";

function CareerRoadmap() {
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
          No Career Roadmap Active
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem", margin: "0 auto 1.5rem", lineHeight: 1.5 }}>
          Upload and analyze a resume first to generate a personalized career development plan and skill acquisition roadmap.
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

  const missing = analysis?.missingSkills || [];
  const strengths = analysis?.strengths || [];
  const improvements = analysis?.improvements || [];
  const bestRoles = analysis?.recruiterReview?.bestRoles || [];

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
          <Link to="/dashboard" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>Dashboard</Link>
          <span>/</span>
          <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>Career Roadmap</span>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-heading)", margin: "0 0 0.4rem" }}>
          Career Progression Roadmap
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem", margin: 0, maxWidth: "720px", lineHeight: 1.5 }}>
          A staged development plan synthesized from your verified resume strengths, detected keyword gaps, and target role requirements.
        </p>
      </div>

      {/* Snapshot Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <CheckCircle2 size={16} style={{ color: "var(--color-success)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-heading)" }}>Verified Strengths</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {strengths.slice(0, 4).map((s, i) => (
              <span key={i} className="badge badge-success" style={{ fontSize: "0.78rem" }}>{s}</span>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <AlertTriangle size={16} style={{ color: "var(--color-warning)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-heading)" }}>Target Skill Gaps</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {missing.length > 0 ? (
              missing.slice(0, 4).map((m, i) => (
                <span key={i} className="badge badge-warning" style={{ fontSize: "0.78rem" }}>{m}</span>
              ))
            ) : (
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>None identified</span>
            )}
          </div>
        </div>
      </div>

      {/* Staged Milestones Progression */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Phase 1 */}
        <div className="card" style={{ padding: "1.75rem", borderLeft: "4px solid var(--color-primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge badge-primary" style={{ fontSize: "0.78rem" }}>Phase 1</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
                Short-Term Priorities (Days 1 – 30)
              </h3>
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Resume Refinement</span>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", margin: "0 0 1rem" }}>
            Immediate actions to align your resume with ATS filters and recruiter standards.
          </p>
          <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.88rem", color: "var(--color-text)", lineHeight: 1.6 }}>
            {improvements.slice(0, 3).map((imp, idx) => (
              <li key={idx} style={{ marginBottom: "6px" }}>{imp}</li>
            ))}
          </ul>
        </div>

        {/* Phase 2 */}
        <div className="card" style={{ padding: "1.75rem", borderLeft: "4px solid #00A86B" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge badge-success" style={{ fontSize: "0.78rem" }}>Phase 2</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
                Skill Acquisition &amp; Project Depth (Days 30 – 90)
              </h3>
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Hands-on Learning</span>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", margin: "0 0 1rem" }}>
            Build demonstrable experience bridging identified missing competencies.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            <div style={{ padding: "1rem", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--color-heading)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <BookOpen size={14} /> Recommended Learning Focus
              </div>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                {missing.length > 0
                  ? `Focus deep studies on ${missing.slice(0, 3).join(", ")} to expand architectural coverage.`
                  : "Deep dive into distributed systems patterns, database indexing, and cloud-native architecture."}
              </p>
            </div>
            <div style={{ padding: "1rem", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--color-heading)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Layers size={14} /> Suggested Project Enhancements
              </div>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                Incorporate automated CI/CD pipelines, containerization (Docker), and quantifiable performance benchmarks into your top project repository.
              </p>
            </div>
          </div>
        </div>

        {/* Phase 3 */}
        <div className="card" style={{ padding: "1.75rem", borderLeft: "4px solid #777777" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge badge-neutral" style={{ fontSize: "0.78rem" }}>Phase 3</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
                Strategic Role Alignment &amp; Interview Readiness (Days 90+)
              </h3>
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Target Applications</span>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", margin: "0 0 1rem" }}>
            Execute targeted applications for roles where your profile demonstrates highest alignment.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {(bestRoles.length > 0 ? bestRoles : [{ role: "Full Stack Engineer", reason: "Direct skill alignment." }, { role: "Backend Developer", reason: "Strong backend competencies." }]).map((role, idx) => (
              <div key={idx} style={{ padding: "0.75rem 1rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: "0.88rem", color: "var(--color-heading)" }}>{role.role}</strong>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{role.reason}</div>
                </div>
                <Link to="/dashboard/interview" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>
                  Practice Role Interview
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "1.5rem" }}>
        <Info size={14} />
        <span>Roadmap suggestions are algorithmic recommendations derived from your resume and target job requirements.</span>
      </div>
    </div>
  );
}

export default CareerRoadmap;
