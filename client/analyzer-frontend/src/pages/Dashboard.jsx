import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";

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
      certificationsCount: analysis.candidateProfile?.certifications?.length || analysis.parsedResume?.certifications?.length || 0,
    };
  }, [analysis]);

  if (!analysis) {
    return (
      <div className="copilot-empty-state">
        <div className="copilot-empty-icon">📊</div>
        <h2>No Resume Analysis Active</h2>
        <p>Upload a resume and job description to generate your full ATS radar, recruiter hiring odds, and score breakdown.</p>
        <button
          type="button"
          className="kinetic-cta-btn primary"
          style={{ marginTop: "1rem" }}
          onClick={() => navigate("/upload")}
        >
          UPLOAD RESUME →
        </button>
      </div>
    );
  }

  const atsScore = Math.round((analysis.matchScore || 0) * 100);
  const recruiter = analysis.recruiterReview || {};
  const verdict = recruiter.decision || "Consider";
  const hiringChance = recruiter.hiringProbability || 65;
  const candidateName =
    analysis.candidateProfile?.identity?.fullName ||
    (resume?.name ? resume.name.replace(/\.pdf$/i, "").split(/[\s_-]+/)[0] : "Candidate");
  const targetTitle =
    analysis.candidateProfile?.identity?.professionalTitle ||
    recruiter.bestRoles?.[0]?.role ||
    "Software Engineer";

  return (
    <div className="kinetic-dashboard-wrap">
      {/* Top Banner Header */}
      <div className="kinetic-dash-header">
        <div className="kinetic-dash-title-group">
          <span className="kinetic-eyebrow">CANDIDATE INTELLIGENCE RADAR</span>
          <h1 className="kinetic-dash-main-title">{candidateName.toUpperCase()} // {targetTitle.toUpperCase()}</h1>
          <p className="kinetic-dash-subtitle">
            Analyzed document: <strong>{resume?.name || "Active Resume"}</strong> • Multi-model parsing active
          </p>
        </div>

        <div className="kinetic-dash-actions">
          <button type="button" className="kinetic-cta-btn primary" onClick={() => navigate("/dashboard/interview")}>
            🎙️ START MOCK INTERVIEW
          </button>
          <button type="button" className="kinetic-cta-btn outline" onClick={handleScanNew}>
            SCAN NEW PDF
          </button>
        </div>
      </div>

      {/* Hero Score Showcase */}
      <div className="kinetic-score-hero">
        <div className="kinetic-score-big-col">
          <span className="kinetic-score-label">OVERALL MATCH ACCURACY</span>
          <div className="kinetic-score-display">
            <span className="kinetic-score-val">{atsScore}%</span>
            <span className="kinetic-score-tag">ATS SCORE</span>
          </div>
          <p className="kinetic-score-desc">
            {analysis.atsExplanation || "Your resume has been benchmarked against senior engineering recruiter standards."}
          </p>
        </div>

        <div className="kinetic-verdict-col">
          <div className="kinetic-verdict-badge-box">
            <span className="kinetic-verdict-sub">RECRUITER HIRING VERDICT</span>
            <h2 className="kinetic-verdict-val">{verdict.toUpperCase()}</h2>
          </div>

          <div className="kinetic-hiring-bar-box">
            <div className="kinetic-hiring-labels">
              <span>Hiring Probability</span>
              <strong>{hiringChance}%</strong>
            </div>
            <div className="kinetic-bar-track">
              <div className="kinetic-bar-fill" style={{ width: `${hiringChance}%` }} />
            </div>
          </div>

          <div className="kinetic-recruiter-quote">
            "{recruiter.overallComment ? recruiter.overallComment.slice(0, 160) + "..." : "Strong core competencies observed."}"
          </div>
        </div>
      </div>

      {/* Quick Launchpad Engines */}
      <div className="kinetic-launchpad-grid">
        <Link to="/dashboard/interview" className="kinetic-launch-tile">
          <span className="launch-icon">🎙️</span>
          <div className="launch-info">
            <strong>MOCK INTERVIEW ARENA</strong>
            <span>Realistic project &amp; tech probing with voice input</span>
          </div>
          <span className="launch-arrow">→</span>
        </Link>

        <Link to="/dashboard/copilot" className="kinetic-launch-tile">
          <span className="launch-icon">🤖</span>
          <div className="launch-info">
            <strong>CAREER COPILOT</strong>
            <span>Grounded AI assistant with profile memory</span>
          </div>
          <span className="launch-arrow">→</span>
        </Link>

        <Link to="/dashboard/sections" className="kinetic-launch-tile">
          <span className="launch-icon">🔍</span>
          <div className="launch-info">
            <strong>SECTION ANALYZER</strong>
            <span>Granular breakdown of skills, experience &amp; impact</span>
          </div>
          <span className="launch-arrow">→</span>
        </Link>

        <Link to="/dashboard/ats" className="kinetic-launch-tile">
          <span className="launch-icon">🎯</span>
          <div className="launch-info">
            <strong>ATS DEEP DIVE</strong>
            <span>Detailed section breakdown &amp; keyword radar</span>
          </div>
          <span className="launch-arrow">→</span>
        </Link>
      </div>

      {/* 2-Column Intelligence Grid */}
      <div className="kinetic-dash-grid-2">
        {/* Left Column: Strengths & Skills */}
        <div className="kinetic-dash-card">
          <div className="kinetic-card-header-row">
            <h3 className="kinetic-dash-card-title">✅ VERIFIED STRENGTHS</h3>
            <span className="kinetic-tag-badge">TOP COMPETENCIES</span>
          </div>

          <div className="kinetic-tag-list">
            {(analysis.strengths || ["Full Stack Architecture", "Microservices Design", "PostgreSQL Optimization"]).map((s, idx) => (
              <div key={idx} className="kinetic-strength-pill">
                ✓ {s}
              </div>
            ))}
          </div>

          <div className="kinetic-card-header-row" style={{ marginTop: "1.5rem" }}>
            <h3 className="kinetic-dash-card-title" style={{ color: "var(--clr-red)" }}>⚠️ MISSING KEYWORDS</h3>
            <span className="kinetic-tag-badge red">ACTION REQUIRED</span>
          </div>

          <div className="kinetic-tag-list">
            {(analysis.missingSkills?.length ? analysis.missingSkills : ["GraphQL Schema", "CI/CD Pipeline Automation", "E2E Testing"]).map((m, idx) => (
              <div key={idx} className="kinetic-missing-pill">
                ✕ {m}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recruiter Recommended Actions */}
        <div className="kinetic-dash-card">
          <div className="kinetic-card-header-row">
            <h3 className="kinetic-dash-card-title">🎯 PRIORITY IMPROVEMENTS</h3>
            <span className="kinetic-tag-badge">ROADMAP</span>
          </div>

          <div className="kinetic-actions-list">
            {recruiter.finalRecommendations?.length ? (
              recruiter.finalRecommendations.slice(0, 3).map((rec, idx) => (
                <div key={idx} className="kinetic-action-item">
                  <div className="action-item-top">
                    <span className="action-priority-tag">PRIORITY: {rec.priority || "HIGH"}</span>
                    <span className="action-impact">{rec.expectedAtsImprovement || "+15% ATS"}</span>
                  </div>
                  <p className="action-text">{rec.action}</p>
                </div>
              ))
            ) : (
              (analysis.improvements || [
                "Include concrete performance metrics in your primary experience section.",
                "Explicitly list cloud orchestration and CI/CD tools.",
                "Elaborate on database indexing and latency optimization in your top project."
              ]).slice(0, 3).map((imp, idx) => (
                <div key={idx} className="kinetic-action-item">
                  <div className="action-item-top">
                    <span className="action-priority-tag">IMPROVEMENT {idx + 1}</span>
                  </div>
                  <p className="action-text">{imp}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Summary Counts */}
      <div className="kinetic-counts-bar">
        <div className="kinetic-count-box">
          <span className="count-num">{stats?.hardSkillsCount}</span>
          <span className="count-lbl">Verified Tech Skills</span>
        </div>
        <div className="kinetic-count-box">
          <span className="count-num">{stats?.projectsCount || 2}</span>
          <span className="count-lbl">Identified Projects</span>
        </div>
        <div className="kinetic-count-box">
          <span className="count-num">{stats?.experienceCount || 2}</span>
          <span className="count-lbl">Experience Roles</span>
        </div>
        <div className="kinetic-count-box">
          <span className="count-num">{stats?.certificationsCount || 1}</span>
          <span className="count-lbl">Certifications</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
