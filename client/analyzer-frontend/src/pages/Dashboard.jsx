import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import DashboardCard from "../components/DashboardCard";
import { TagCard } from "../components/ResultBox";

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
    const pr = analysis.parsedResume || {};
    const rw = analysis.rewriteStudio || {};

    return {
      hardSkillsCount: pr.hardSkills?.length ?? 0,
      softSkillsCount: pr.softSkills?.length ?? 0,
      experienceCount: pr.internships?.length ?? 0,
      projectsCount: rw.projects?.length ?? 0,
      achievementsCount: pr.achievements?.length ?? 0,
      languagesCount: pr.languages?.length ?? 0,
    };
  }, [analysis]);

  if (!analysis) return null;

  const atsScore = analysis.matchScore ?? 0;
  const recruiterVerdict = analysis.recruiterReview?.decision ?? "Consider";
  const hiringChance = analysis.recruiterReview?.hiringProbability ?? 50;

  // Simple calculation of profile checklist score
  const healthScore = Math.round(
    ((analysis.parsedResume?.github ? 1 : 0) +
      (analysis.parsedResume?.linkedin ? 1 : 0) +
      (analysis.parsedResume?.portfolio ? 1 : 0) +
      ((analysis.parsedResume?.hardSkills?.length ?? 0) > 0 ? 1 : 0) +
      ((analysis.parsedResume?.softSkills?.length ?? 0) > 0 ? 1 : 0) +
      ((analysis.parsedResume?.certifications?.length ?? 0) > 0 ? 1 : 0) +
      ((analysis.parsedResume?.achievements?.length ?? 0) > 0 ? 1 : 0)) * 14.28
  );

  return (
    <div className="dashboard-overview-page">
      {/* Welcome header panel */}
      <div className="dashboard-overview-header">
        <div className="overview-welcome-left">
          <h2>Resume Report Overview</h2>
          <p>
            Review summary metrics parsed from <strong className="ResumeHolderName">{resume?.name || "Active Resume"}</strong>
          </p>
        </div>
        <div className="overview-header-actions">
          <button className="dashboard-reanalyze-btn" onClick={handleScanNew}>
            Scan New Resume
          </button>
        </div>
      </div>

      {/* KPI metric grid */}
      <div className="overview-kpi-grid">
        <DashboardCard
          title="Overall ATS Score"
          value={`${Math.round(atsScore * 100)}%`}
          subtitle={analysis.atsExplanation ? analysis.atsExplanation.slice(0, 75) + "..." : "Resume alignment score against requirements."}
          icon=""
          type="score"
          linkText="Detailed ATS Metrics"
          to="/dashboard/ats"
        />
        <DashboardCard
          title="Recruiter Verdict"
          value={recruiterVerdict}
          subtitle={analysis.recruiterReview?.overallComment ? analysis.recruiterReview.overallComment.slice(0, 75) + "..." : "AI Recruiter evaluation verdict."}
          icon=""
          type="decision"
          linkText="Read Recruiter Assessment"
          to="/dashboard/recruiter"
        />
        <DashboardCard
          title="Hiring Probability"
          value={`${hiringChance}%`}
          subtitle="Chance of advancing past the initial recruiter screening."
          icon=""
          linkText="Hiring Breakdown"
          to="/dashboard/recruiter"
        />
        <DashboardCard
          title="Resume Profile Health"
          value={`${Math.min(100, healthScore)}%`}
          subtitle="Checklist score evaluating contact channels and assets."
          icon=""
          linkText="View Checklist"
          to="/dashboard/profile"
        />
      </div>

      {/* Quick Action Rows */}
      <div className="overview-section-label">Quick Actions</div>
      <div className="overview-quick-actions-row">
        <Link to="/dashboard/ats" className="quick-action-button-card">
          <span className="q-icon"></span>
          <div className="q-info">
            <strong>ATS Check</strong>
            <span>Formatting &amp; scoring details</span>
          </div>
        </Link>
        <Link to="/dashboard/recruiter" className="quick-action-button-card">
          <span className="q-icon"></span>
          <div className="q-info">
            <strong>Recruiter Screen</strong>
            <span>seniority &amp; salary fit metrics</span>
          </div>
        </Link>
        <Link to="/dashboard/rewrite" className="quick-action-button-card">
          <span className="q-icon"></span>
          <div className="q-info">
            <strong>Rewrite Studio</strong>
            <span>Grammarly/Notion AI inline edits</span>
          </div>
        </Link>
        <Link to="/dashboard/sections" className="quick-action-button-card">
          <span className="q-icon"></span>
          <div className="q-info">
            <strong>Section Inspector</strong>
            <span>Check bullet weaknesses</span>
          </div>
        </Link>
      </div>

      {/* Stats Counter grid + Tag lists widgets */}
      <div className="overview-details-grid">
        {/* Left Column - Stats & Resume Metadata */}
        <div className="overview-details-panel">
          <div className="panel-title-header">Resume Content Summary</div>
          <div className="summary-counters-grid">
            <div className="counter-item">
              <span className="counter-val">{stats?.hardSkillsCount}</span>
              <span className="counter-lbl">Hard Skills</span>
            </div>
            <div className="counter-item">
              <span className="counter-val">{stats?.softSkillsCount}</span>
              <span className="counter-lbl">Soft Skills</span>
            </div>
            <div className="counter-item">
              <span className="counter-val">{stats?.experienceCount}</span>
              <span className="counter-lbl">Internships / Roles</span>
            </div>
            <div className="counter-item">
              <span className="counter-val">{stats?.projectsCount}</span>
              <span className="counter-lbl">Projects</span>
            </div>
            <div className="counter-item">
              <span className="counter-val">{stats?.achievementsCount}</span>
              <span className="counter-lbl">Achievements</span>
            </div>
            <div className="counter-item">
              <span className="counter-val">{stats?.languagesCount}</span>
              <span className="counter-lbl">Languages</span>
            </div>
          </div>

          {/* Quick profile link summary */}
          <div className="overview-profile-links-widget">
            <span className="widget-label">Asset Connections</span>
            <div className="profile-links-row">
              {analysis.parsedResume?.github ? (
                <a href={analysis.parsedResume.github} target="_blank" rel="noopener noreferrer" className="profile-link mini">
                  Github ↗
                </a>
              ) : <span className="profile-link disabled">Github Missing</span>}

              {analysis.parsedResume?.linkedin ? (
                <a href={analysis.parsedResume.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link mini">
                  LinkedIn ↗
                </a>
              ) : <span className="profile-link disabled">LinkedIn Missing</span>}

              {analysis.parsedResume?.portfolio ? (
                <a href={analysis.parsedResume.portfolio} target="_blank" rel="noopener noreferrer" className="profile-link mini">
                  Portfolio ↗
                </a>
              ) : <span className="profile-link disabled">Portfolio Missing</span>}
            </div>
          </div>
        </div>

        {/* Right Column - Existing Improvements, Missing Skills, Strengths */}
        <div className="overview-details-panel flex-column gap-1">
          <div className="panel-title-header">Critical Scan Suggestions</div>

          <TagCard
            icon="🔥"
            iconClass="icon-green"
            title="Resume Strengths"
            items={analysis.strengths?.slice(0, 4)}
            tagClass="green"
          />

          <TagCard
            icon="🔥"
            iconClass="icon-red"
            title="Missing Job Keywords"
            items={analysis.missingSkills?.slice(0, 4)}
            tagClass="red"
          />

          <TagCard
            icon="🔥"
            iconClass="icon-yellow"
            title="Top Improvements Recommended"
            items={analysis.improvements?.slice(0, 3)}
            tagClass="yellow"
            numbered={true}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
