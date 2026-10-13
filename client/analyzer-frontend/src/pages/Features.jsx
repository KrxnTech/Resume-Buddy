import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Target,
  Briefcase,
  Layers,
  Award,
  Sparkles,
  HeartPulse,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import TopNavbar from "../components/TopNavbar";
import Footer from "../components/Footer";

function Features() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const featureList = [
    {
      id: "ats",
      category: "analysis",
      icon: <Target size={22} style={{ color: "var(--color-primary)" }} />,
      title: "ATS Compatibility Analysis",
      tagline: "Break through automated screening filters",
      desc: "Evaluates your resume against applicant tracking standards. Identifies missing keywords, analyzes formatting compatibility, and computes a mathematical 0–100% alignment score.",
      points: [
        "Real-time keyword gap detection",
        "Section-by-section weighting and scoring",
        "Document formatting and hierarchy validation",
        "Role-specific keyword density checks"
      ],
    },
    {
      id: "recruiter",
      category: "analysis",
      icon: <Briefcase size={22} style={{ color: "var(--color-primary)" }} />,
      title: "Recruiter Perspective & Insights",
      tagline: "Honest hiring manager assessments before you apply",
      desc: "Simulates senior engineering hiring managers. Delivers hiring alignment indicators, technical round pass probability estimates, and seniority fit notes.",
      points: [
        "Executive hiring manager commentary",
        "Identified candidate strengths and potential concerns",
        "Best-fit role recommendations",
        "Prioritized resume enhancement checklist"
      ],
    },
    {
      id: "interview",
      category: "interactive",
      icon: <Award size={22} style={{ color: "var(--color-primary)" }} />,
      title: "AI Interview Preparation Arena",
      tagline: "Realistic technical and project probing",
      desc: "Simulates interactive technical interviews based directly on your verified projects, technical stack, and target job description with dynamic audio and AI feedback.",
      points: [
        "Technical, Project Deep-Dive, and Behavioral modes",
        "Adaptive difficulty that scales with answer quality",
        "Voice audio playback and microphone answer capture",
        "Comprehensive post-interview evaluation report and full transcript"
      ],
    },
    {
      id: "sections",
      category: "analysis",
      icon: <Layers size={22} style={{ color: "var(--color-primary)" }} />,
      title: "Interactive Section Analyzer",
      tagline: "Detailed audit of each resume component",
      desc: "Inspects individual sections—Professional Summary, Skills, Work History, Projects, Education, and Contact Details—with targeted suggestions.",
      points: [
        "Impact metrics and action verb audit",
        "Technical skills grouping and categorization",
        "Project complexity and contribution depth",
        "Concrete bullet point refinement tips"
      ],
    },
    {
      id: "copilot",
      category: "interactive",
      icon: <Sparkles size={22} style={{ color: "var(--color-primary)" }} />,
      title: "Career Copilot",
      tagline: "Grounded AI career advisor with profile memory",
      desc: "An intelligent career assistant that holds your full analyzed resume in memory. Ask questions about your qualifications, career pivots, or target role requirements without repeating context.",
      points: [
        "Strictly grounded in your actual uploaded profile",
        "Full conversation history retention",
        "Voice synthesis read-aloud option",
        "Direct advice on framing complex experience"
      ],
    },
    {
      id: "export",
      category: "utilities",
      icon: <Download size={22} style={{ color: "var(--color-primary)" }} />,
      title: "Standardized PDF Export",
      tagline: "Clean, machine-readable document generation",
      desc: "Reconstructs your profile into a clean, single-column machine-readable format tested for optimal parsing across major ATS engines.",
      points: [
        "Standardized ATS typographic layout",
        "Printable executive recruiter dossier",
        "Raw structured JSON profile export",
        "Client-side secure PDF compilation"
      ],
    },
  ];

  const filteredFeatures = activeTab === "all" ? featureList : featureList.filter((f) => f.category === activeTab);

  return (
    <div style={{ background: "var(--color-bg-primary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNavbar />

      <main style={{ flex: 1, padding: "3rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Platform Features
            </span>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 700, color: "var(--color-heading)", margin: "0.5rem 0 1rem" }}>
              Comprehensive Career Intelligence
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
              Explore the specialized modules built to analyze your resume, measure ATS compatibility, run mock interviews, and optimize your job applications.
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {[
              { id: "all", label: `All Features (${featureList.length})` },
              { id: "analysis", label: "Analysis Engines" },
              { id: "interactive", label: "Interactive Tools" },
              { id: "utilities", label: "Export & Utilities" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "8px 16px" }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Features Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem", marginBottom: "4rem" }}>
            {filteredFeatures.map((f) => (
              <div key={f.id} className="card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--color-heading)", margin: "0 0 0.35rem" }}>
                  {f.title}
                </h3>
                <div style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: 500, marginBottom: "0.75rem" }}>
                  {f.tagline}
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.5, margin: "0 0 1.25rem", flex: 1 }}>
                  {f.desc}
                </p>

                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                  <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.82rem", color: "var(--color-text)", lineHeight: 1.6 }}>
                    {f.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "3rem 2rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "0.75rem" }}>
              Ready to evaluate your resume?
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", maxWidth: "520px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
              Upload your document and get detailed ATS scores, recruiter evaluation, and interview practice questions in seconds.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/upload")}
            >
              Analyze My Resume <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Features;
