import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

function TopNavbar({ toggleMobileSidebar, isMobile }) {
  const { resume, result, loading } = useAnalysis();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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
    if (path === "/dashboard") return "ANALYSIS RADAR";
    if (path === "/dashboard/profile") return "CANDIDATE PROFILE";
    if (path === "/dashboard/ats") return "ATS PRECISION SCORING";
    if (path === "/dashboard/recruiter") return "RECRUITER REVIEW MATRIX";
    if (path === "/dashboard/sections") return "SECTION DEEP-DIVE";
    if (path === "/dashboard/health") return "RESUME HEALTH AUDIT";
    if (path === "/dashboard/interview") return "AI MOCK INTERVIEW ARENA";
    if (path === "/dashboard/roadmap") return "CAREER ROADMAP";
    if (path === "/dashboard/export") return "EXPORT ANALYSIS REPORT";
    if (path === "/dashboard/copilot") return "CAREER COPILOT";
    if (path === "/dashboard/settings") return "ACCOUNT & SETTINGS";
    if (path === "/upload") return "UPLOAD RESUME";
    return "ANALYZER SUITE";
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="top-navbar">
      {/* Left side: Mobile hamburger & breadcrumb */}
      <div className="navbar-left">
        {isMobile && (
          <button className="mobile-hamburger-btn" onClick={toggleMobileSidebar} aria-label="Toggle Navigation Sidebar">
            ☰
          </button>
        )}
        <div className="navbar-breadcrumb">
          <span className="breadcrumb-main">{getPageHeader()}</span>
        </div>
      </div>

      {/* Right side: Links + Resume score meta + Theme toggle + Auth */}
      <div className="navbar-actions" style={{ position: "relative" }}>
        <div className="navbar-nav-quick-links">
          <Link to="/" className="top-nav-quick-link">HOME</Link>
          <Link to="/features" className="top-nav-quick-link">FEATURES</Link>
          <Link to="/help" className="top-nav-quick-link">HELP</Link>
        </div>

        {resume && (
          <div className="navbar-meta-pane">
            {result && (
              <div className="navbar-score-badge" title="Overall Match Score">
                <span className="score-badge-circle" />
                MATCH: <strong>{scorePercent}%</strong>
              </div>
            )}

            <button className="navbar-reanalyze-btn" onClick={handleReanalyze} disabled={loading}>
              SCAN NEW
            </button>
          </div>
        )}

        {/* User Auth Section */}
        {isAuthenticated && user ? (
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.3rem 0.6rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--clr-border)",
                borderRadius: "20px",
                color: "var(--clr-text)",
                cursor: "pointer",
                fontSize: "0.82rem",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "var(--clr-accent)",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getUserInitials(user.name)}
              </span>
              <span style={{ fontWeight: 600, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name.split(" ")[0]}
              </span>
              <span style={{ fontSize: "0.65rem", color: "var(--clr-text-3)" }}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  background: "var(--clr-card-bg, #141417)",
                  border: "1px solid var(--clr-border)",
                  borderRadius: "12px",
                  padding: "0.75rem",
                  minWidth: "200px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  zIndex: 1000,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div style={{ paddingBottom: "0.5rem", borderBottom: "1px solid var(--clr-border)" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--clr-text)" }}>{user.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--clr-text-3)", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                  <span style={{ display: "inline-block", marginTop: "0.25rem", fontSize: "0.65rem", background: "rgba(230,254,83,0.15)", color: "var(--clr-accent)", padding: "2px 6px", borderRadius: "4px" }}>
                    {user.role || "Pro Member"}
                  </span>
                </div>

                <Link
                  to="/dashboard/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  style={{ textDecoration: "none", color: "var(--clr-text)", fontSize: "0.8rem", padding: "0.35rem 0.5rem", borderRadius: "6px" }}
                >
                  ⚙️ Account Settings
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  style={{
                    background: "rgba(255, 75, 75, 0.1)",
                    border: "1px solid rgba(255, 75, 75, 0.3)",
                    color: "#ff6b6b",
                    padding: "0.4rem 0.6rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    textAlign: "center",
                    marginTop: "0.25rem",
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="navbar-reanalyze-btn"
            onClick={() => openAuthModal("login")}
            style={{ background: "var(--clr-accent)", color: "#000", fontWeight: 700 }}
          >
            SIGN IN
          </button>
        )}

        <ThemeToggle compact={true} />
      </div>
    </header>
  );
}

export default TopNavbar;
