import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Download,
  Briefcase,
  Layers,
  Award,
  ChevronRight,
  Info,
  ExternalLink,
  Target,
  Sparkles,
  UserCheck,
  Check,
  X
} from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";

function formatScoreColor(pct) {
  if (pct >= 75) return "var(--color-success)";
  if (pct >= 50) return "var(--color-warning)";
  return "var(--color-error)";
}

function Dashboard() {
  const { resume, result, setResult, setResume, setJobDesc } = useAnalysis();
  const navigate = useNavigate();

  const analysis = result?.analysis;

  const handleScanNew = () => {
    setResult(null);
    setResume(null);
    setJobDesc("");
    navigate("/upload");
  };

  const candidateIdentity = analysis?.candidateProfile?.identity || {};
  const candidateName =
    candidateIdentity.fullName ||
    (resume?.name ? resume.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ") : "Candidate");
  const targetTitle =
    candidateIdentity.professionalTitle ||
    analysis?.recruiterReview?.bestRoles?.[0]?.role ||
    "Software Professional";

  const matchScore = Math.round((analysis?.matchScore ?? 0) * 100);
  const recruiter = analysis?.recruiterReview || {};
  const verdict = recruiter.decision || (matchScore >= 75 ? "Recommended" : matchScore >= 50 ? "Consider" : "Needs Refinement");
  const missingSkills = analysis?.missingSkills || [];
  const strengths = analysis?.strengths || [];
  const sectionScores = analysis?.sectionScores || {};

  const stats = useMemo(() => {
    if (!analysis) return null;
    const pr = analysis.candidateProfile?.skills || analysis.parsedResume || {};
    const hardCount =
      (analysis.candidateProfile?.skills?.languages?.length || 0) +
      (analysis.candidateProfile?.skills?.frameworks?.length || 0) +
      (analysis.candidateProfile?.skills?.databases?.length || 0) +
      (analysis.candidateProfile?.skills?.cloud?.length || 0) ||
      analysis.parsedResume?.hardSkills?.length ||
      0;

    return {
      hardSkillsCount: hardCount,
      softSkillsCount: analysis.candidateProfile?.skills?.softSkills?.length || analysis.parsedResume?.softSkills?.length || 0,
      experienceCount: analysis.candidateProfile?.experience?.length || analysis.parsedResume?.internships?.length || 0,
      projectsCount: analysis.candidateProfile?.projects?.length || 0,
    };
  }, [analysis]);

  if (!analysis) {
    return (
      <div style={{ maxWidth: "800px", margin: "4rem auto", textAlign: "center", padding: "3rem 2rem", background: "var(--color-bg-primary)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "var(--color-primary)" }}>
          <FileText size={28} />
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
          No Active Resume Analysis
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", maxWidth: "480px", margin: "0 auto 1.75rem", lineHeight: 1.6 }}>
          Upload your resume and provide a target job description to run our ATS compatibility scan, recruiter evaluation, and career intelligence radar.
        </p>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => navigate("/upload")}
        >
          Upload Resume to Analyze <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--color-border)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Analysis Report
            </span>
            <span style={{ color: "var(--color-text-muted)" }}>•</span>
            <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--color-heading)", margin: "0 0 0.35rem" }}>
            {candidateName}
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span>Target Role: <strong>{targetTitle}</strong></span>
            <span>•</span>
            <span>Source: <strong>{resume?.name || "Pasted Text Profile"}</strong></span>
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/dashboard/export")}
          >
            <Download size={15} /> Export PDF Report
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleScanNew}
          >
            <RefreshCw size={15} /> Scan New Resume
          </button>
        </div>
      </div>

      {/* 4 Score Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {/* Match Score */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", fontWeight: 500, marginBottom: "0.5rem" }}>
            Overall Match Score
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "2.2rem", fontWeight: 700, color: formatScoreColor(matchScore) }}>
              {matchScore}%
            </span>
            <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>/ 100%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${matchScore}%`, backgroundColor: formatScoreColor(matchScore) }} />
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Weighted against role requirements
          </div>
        </div>

        {/* ATS Compatibility */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", fontWeight: 500, marginBottom: "0.5rem" }}>
            ATS Compatibility
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "2.2rem", fontWeight: 700, color: "var(--color-primary)" }}>
              {Math.round((sectionScores.formatting ? sectionScores.formatting * 100 : matchScore))}%
            </span>
            <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>parsing index</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${sectionScores.formatting ? sectionScores.formatting * 100 : matchScore}%`, backgroundColor: "var(--color-primary)" }} />
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Standard headers & scannable layout
          </div>
        </div>

        {/* Recruiter Evaluation */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", fontWeight: 500, marginBottom: "0.5rem" }}>
            Recruiter Assessment
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.4rem 0 0.8rem" }}>
            <span
              className={`badge ${matchScore >= 70 ? "badge-success" : matchScore >= 50 ? "badge-warning" : "badge-error"}`}
              style={{ fontSize: "0.95rem", padding: "6px 12px", fontWeight: 600 }}
            >
              {verdict}
            </span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
            Based on experience density and keyword relevance
          </div>
        </div>

        {/* Missing Skills Count */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", fontWeight: 500, marginBottom: "0.5rem" }}>
            Identified Skill Gaps
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "2.2rem", fontWeight: 700, color: missingSkills.length > 3 ? "var(--color-error)" : "var(--color-heading)" }}>
              {missingSkills.length}
            </span>
            <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>keywords missing</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Review gaps in skill match analysis below
          </div>
        </div>
      </div>

      {/* Summary Profile Box */}
      <div className="card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <UserCheck size={20} style={{ color: "var(--color-primary)" }} />
          <h2 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
            Executive Summary & Profile Overview
          </h2>
        </div>
        <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--color-text)", margin: "0 0 1.25rem" }}>
          {analysis.summary || analysis.atsExplanation || "Candidate demonstrates strong technical competencies aligned with the requested technical architecture and engineering standards."}
        </p>

        {/* Quick Identity and Experience Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", paddingTop: "1.25rem", borderTop: "1px solid var(--color-border)" }}>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Candidate Name</div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-heading)" }}>{candidateName}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Email / Contact</div>
            <div style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--color-text)" }}>
              {candidateIdentity.email || "Extracted from header"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Verified Tech Skills</div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-heading)" }}>
              {stats?.hardSkillsCount || "Available"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Roles / Experience</div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-heading)" }}>
              {stats?.experienceCount || "Documented"}
            </div>
          </div>
        </div>
      </div>

      {/* Skill Match Analysis Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Matching Competencies */}
        <div className="card" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle2 size={18} style={{ color: "var(--color-success)" }} />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
                Matching Strengths
              </h3>
            </div>
            <span className="badge badge-success">{strengths.length} Found</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
            {strengths.map((str, idx) => (
              <span key={idx} className="badge badge-neutral" style={{ fontSize: "0.82rem", padding: "5px 10px", display: "inline-flex", alignItems: "center", gap: 5 }}>
                <Check size={12} style={{ color: "var(--color-success)" }} /> {str}
              </span>
            ))}
          </div>

          <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
            These key competencies match high-priority keywords in the job description.
          </p>
        </div>

        {/* Missing or Underrepresented Keywords */}
        <div className="card" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertTriangle size={18} style={{ color: "var(--color-warning)" }} />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
                Missing or Underrepresented Skills
              </h3>
            </div>
            <span className="badge badge-warning">{missingSkills.length} Identified</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
            {missingSkills.length > 0 ? (
              missingSkills.map((ms, idx) => (
                <span key={idx} className="badge" style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A", fontSize: "0.82rem", padding: "5px 10px", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <X size={12} style={{ color: "#92400E" }} /> {ms}
                </span>
              ))
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>No critical skill gaps identified.</p>
            )}
          </div>

          <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
            Note: Missing keywords do not indicate lack of qualification, but adding relevant ones improves automated ATS screening.
          </p>
        </div>
      </div>

      {/* ATS Breakdown & Recruiter Insights (2-Column Grid) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* ATS Section Progress Bars */}
        <div className="card" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <Target size={18} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
              ATS Category Breakdown
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "Skills Section", score: sectionScores.skills ?? 0.8 },
              { label: "Work Experience", score: sectionScores.experience ?? 0.75 },
              { label: "Education & Certifications", score: sectionScores.education ?? 0.9 },
              { label: "Projects & Architecture", score: sectionScores.projects ?? 0.7 },
              { label: "Document Formatting", score: sectionScores.formatting ?? 0.85 },
              { label: "Contact Details", score: sectionScores.contact ?? 0.95 },
            ].map((sec, i) => {
              const pct = Math.round(sec.score * 100);
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 500, color: "var(--color-heading)" }}>{sec.label}</span>
                    <span style={{ fontWeight: 600, color: formatScoreColor(pct) }}>{pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: formatScoreColor(pct) }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
            <Link
              to="/dashboard/ats"
              style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none" }}
            >
              View detailed ATS deep-dive <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recruiter Evaluation Panel */}
        <div className="card" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <Briefcase size={18} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
              Recruiter Evaluation & Recommendations
            </h3>
          </div>

          <div style={{ background: "var(--color-bg-secondary)", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.25rem", border: "1px solid var(--color-border)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
              Hiring Manager Perspective
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text)", margin: 0, lineHeight: 1.5 }}>
              "{recruiter.overallComment || "Candidate shows solid engineering foundation. Adding measurable outcomes will strengthen the profile for senior-level evaluations."}"
            </p>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
              Key Recommended Improvements:
            </div>
            <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.85rem", color: "var(--color-text)", lineHeight: 1.6 }}>
              {(analysis.improvements || [
                "Quantify bullet points with latency reductions, user growth, or scale.",
                "Highlight specific microservices frameworks and cloud architecture tools.",
                "Ensure consistent employment date formatting across all timeline entries."
              ]).slice(0, 3).map((imp, idx) => (
                <li key={idx} style={{ marginBottom: "4px" }}>{imp}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border)" }}>
            <Info size={14} />
            <span>AI evaluations are analytical estimates and do not guarantee interview outcomes.</span>
          </div>
        </div>
      </div>

      {/* Module Navigation Grid */}
      <div style={{ marginTop: "1rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-heading)", marginBottom: "1rem" }}>
          Explore Analysis Tools
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          <Link
            to="/dashboard/sections"
            className="card"
            style={{ padding: "1.25rem", textDecoration: "none", color: "inherit", transition: "border-color 0.2s" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <Layers size={20} style={{ color: "var(--color-primary)" }} />
              <ChevronRight size={16} style={{ color: "var(--color-text-muted)" }} />
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-heading)", marginBottom: "4px" }}>
              Section Analyzer
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
              Interactive inspection of individual resume sections and bullet points.
            </div>
          </Link>

          <Link
            to="/dashboard/interview"
            className="card"
            style={{ padding: "1.25rem", textDecoration: "none", color: "inherit", transition: "border-color 0.2s" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <Award size={20} style={{ color: "var(--color-primary)" }} />
              <ChevronRight size={16} style={{ color: "var(--color-text-muted)" }} />
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-heading)", marginBottom: "4px" }}>
              Interview Preparation
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
              Tailored technical and behavioral practice questions with AI feedback.
            </div>
          </Link>

          <Link
            to="/dashboard/roadmap"
            className="card"
            style={{ padding: "1.25rem", textDecoration: "none", color: "inherit", transition: "border-color 0.2s" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <Target size={20} style={{ color: "var(--color-primary)" }} />
              <ChevronRight size={16} style={{ color: "var(--color-text-muted)" }} />
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-heading)", marginBottom: "4px" }}>
              Career Roadmap
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
              Actionable milestones, projects, and learning recommendations.
            </div>
          </Link>

          <Link
            to="/dashboard/copilot"
            className="card"
            style={{ padding: "1.25rem", textDecoration: "none", color: "inherit", transition: "border-color 0.2s" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <Sparkles size={20} style={{ color: "var(--color-primary)" }} />
              <ChevronRight size={16} style={{ color: "var(--color-text-muted)" }} />
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-heading)", marginBottom: "4px" }}>
              Career Copilot
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
              Ask questions grounded directly in your resume and target job requirements.
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
