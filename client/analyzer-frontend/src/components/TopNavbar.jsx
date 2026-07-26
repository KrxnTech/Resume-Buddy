import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";

function TopNavbar({ toggleMobileSidebar, isMobile }) {
  const { resume, result, loading } = useAnalysis();
  const navigate = useNavigate();
  const location = useLocation();

  const handleReanalyze = () => {
    navigate("/upload");
  };

  const score = result?.analysis?.matchScore ?? 0;
  const scorePercent = Math.round(score * 100);

  // Map route pathname to beautiful human readable section headers
  const getPageHeader = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard Overview";
    if (path === "/dashboard/profile") return "Resume Profile Card";
    if (path === "/dashboard/ats") return "ATS & Match Breakdown";
    if (path === "/dashboard/recruiter") return "AI Recruiter Assessment";
    if (path === "/dashboard/sections") return "ATS Section Deep-Dive";
    if (path === "/dashboard/rewrite") return "Resume Rewrite Studio";
    if (path === "/dashboard/health") return "Resume Health Analysis";
    if (path === "/dashboard/interview") return "Interview Prep Assistant";
    if (path === "/dashboard/roadmap") return "Personal Career Roadmap";
    if (path === "/dashboard/settings") return "Account & System Settings";
    if (path === "/upload") return "Upload Resume";
    return "SaaS Suite";
  };

  return (
    <header className="top-navbar">
      {/* Mobile Sidebar Hamburger Toggle */}
      {isMobile && (
        <button className="mobile-hamburger-btn" onClick={toggleMobileSidebar} aria-label="Toggle Navigation Sidebar">
          ☰
        </button>
      )}

      {/* Page Title Header */}
      <div className="navbar-breadcrumb">
        <span className="breadcrumb-main">{getPageHeader()}</span>
      </div>

      {/* Context metadata (Resume name + score) */}
      {resume && (
        <div className="navbar-meta-pane">
          <div className="navbar-resume-info">
            <span className="navbar-file-icon"></span>
            <div className="navbar-file-details">
              {/* <span className="file-name" title={resume.name}>{resume.name}</span> */}
              {/* Extract The Main Name From Resume and Paste Here ? */}
            </div>
          </div>

          {result && (
            <div className="navbar-score-badge" title="Overall Match Score">
              <span className="score-badge-circle" />
              Match: <strong>{scorePercent}%</strong>
            </div>
          )}

          <button className="navbar-reanalyze-btn" onClick={handleReanalyze} disabled={loading}>
            Scan New
          </button>
        </div>
      )}

    </header>
  );
}

export default TopNavbar;
