import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Layers, UserCheck } from "lucide-react";
import TopNavbar from "../components/TopNavbar";
import Footer from "../components/Footer";

function AboutUs() {
  const navigate = useNavigate();

  const principles = [
    {
      icon: <ShieldCheck size={22} style={{ color: "var(--color-primary)" }} />,
      title: "Grounded Career Truth",
      desc: "We never invent fictitious qualifications, experiences, or claims. Suggestions remain grounded strictly in the candidate's authentic resume data.",
    },
    {
      icon: <UserCheck size={22} style={{ color: "var(--color-primary)" }} />,
      title: "Objective Recruiter Perspective",
      desc: "Transparent evaluations without superficial sugar-coating. We explain exactly what automated parsers detect and how hiring managers evaluate impact.",
    },
    {
      icon: <Zap size={22} style={{ color: "var(--color-primary)" }} />,
      title: "Actionable Precision",
      desc: "Clear recommendations focusing on quantifiable achievements, relevant action verbs, and verifiable technological competencies.",
    },
    {
      icon: <Layers size={22} style={{ color: "var(--color-primary)" }} />,
      title: "Fast & Private In-Memory Processing",
      desc: "Documents are processed in volatile memory buffers via Groq AI models without persistent storage or public training leakage.",
    },
  ];

  return (
    <div style={{ background: "var(--color-bg-primary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNavbar />

      <main style={{ flex: 1, padding: "3rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Hero Section */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              About Resume Buddy
            </span>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--color-heading)", margin: "0.5rem 0 1rem", lineHeight: 1.25 }}>
              Career Intelligence Designed for Modern Professionals
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto", lineHeight: 1.65 }}>
              Resume Buddy was built to replace generic, slow career advice with rigorous algorithmic evaluation, ATS compatibility insights, and grounded interview preparation.
            </p>
          </div>

          {/* Core Philosophy Section */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
            <div className="card" style={{ padding: "2rem" }}>
              <span className="badge badge-primary" style={{ marginBottom: "0.75rem" }}>Our Mission</span>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-heading)", margin: "0 0 0.75rem" }}>
                Demystifying Technical Hiring
              </h3>
              <p style={{ fontSize: "0.92rem", color: "var(--color-text)", lineHeight: 1.65, margin: 0 }}>
                Hiring processes have become heavily filtered by automated systems. Candidates frequently submit hundreds of applications without understanding why their profiles are passed over. We give professionals direct access to the same parsing and evaluation logic used by enterprise recruitment teams.
              </p>
            </div>

            <div className="card" style={{ padding: "2rem" }}>
              <span className="badge badge-neutral" style={{ marginBottom: "0.75rem" }}>Architecture</span>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-heading)", margin: "0 0 0.75rem" }}>
                Multi-Model Intelligence Pipeline
              </h3>
              <p style={{ fontSize: "0.92rem", color: "var(--color-text)", lineHeight: 1.65, margin: 0 }}>
                Built on high-performance Groq infrastructure running Llama models. Resume documents are normalized into structured data structures—identities, skills, projects, and career milestones—before computing ATS scoring heuristics and recruiter recommendations.
              </p>
            </div>
          </div>

          {/* Principles Grid */}
          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "1.5rem", textAlign: "center" }}>
              Core Design Principles
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
              {principles.map((p, idx) => (
                <div key={idx} className="card" style={{ padding: "1.5rem" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                    {p.icon}
                  </div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-heading)", margin: "0 0 0.4rem" }}>
                    {p.title}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.55, margin: 0 }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "3rem 2rem", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
              Start Optimizing Your Career Today
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", maxWidth: "480px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
              Upload your resume and get instant ATS compatibility feedback and personalized recruiter insights.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/upload")}
            >
              Analyze Your Resume <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;
