import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, ChevronDown, User, LogOut, Settings as SettingsIcon, UploadCloud } from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";
import { useAuth } from "../hooks/useAuth";

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

  // Map route pathname to clean human readable section headers
  const getPageHeader = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Overview";
    if (path === "/dashboard/profile") return "Candidate Profile";
    if (path === "/dashboard/ats") return "ATS Compatibility";
    if (path === "/dashboard/recruiter") return "Recruiter Review";
    if (path === "/dashboard/sections") return "Section Analysis";
    if (path === "/dashboard/health") return "Resume Health Audit";
    if (path === "/dashboard/interview") return "Interview Preparation";
    if (path === "/dashboard/roadmap") return "Career Roadmap";
    if (path === "/dashboard/export") return "Export Report";
    if (path === "/dashboard/copilot") return "Career Copilot";
    if (path === "/dashboard/settings") return "Settings";
    if (path === "/upload") return "Upload Resume";
    return "";
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

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <header className="top-navbar">
      <div className="navbar-container">
        {/* Left Side: Mobile Menu + Brand / Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {isMobile && isDashboard && (
            <button
              className="mobile-hamburger-btn"
              onClick={toggleMobileSidebar}
              aria-label="Toggle Navigation Sidebar"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Menu size={20} />
            </button>
          )}

          <Link to="/" className="navbar-brand">
            <span className="brand-dot" />
            <span>Resume Buddy</span>
            <span className="brand-badge">Career Intelligence</span>
          </Link>

          {isDashboard && getPageHeader() && (
            <div className="navbar-breadcrumb" style={{ marginLeft: "12px", paddingLeft: "16px", borderLeft: "1px solid var(--clr-border)" }}>
              <span className="breadcrumb-main">{getPageHeader()}</span>
            </div>
          )}
        </div>

        {/* Right Side: Navigation Links & Actions */}
        <div className="navbar-actions">
          <nav className="navbar-links">
            <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
              Home
            </Link>
            <Link to="/features" className={`nav-link ${location.pathname === "/features" ? "active" : ""}`}>
              Features
            </Link>
            <Link to="/about" className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}>
              About
            </Link>
            <Link to="/help" className={`nav-link ${location.pathname === "/help" ? "active" : ""}`}>
              Help
            </Link>
          </nav>

          {/* Quick upload / Re-scan button */}
          <Link to="/upload" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
            <UploadCloud size={14} />
            <span>{isDashboard ? "Analyze New" : "Upload Resume"}</span>
          </Link>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="btn btn-secondary btn-sm"
                style={{ padding: "5px 10px", gap: "6px" }}
              >
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: "var(--clr-brand-subtle)",
                    color: "var(--clr-brand)",
                    fontWeight: 600,
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getUserInitials(user.name)}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 500, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown size={14} color="var(--clr-muted)" />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    backgroundColor: "var(--clr-surface)",
                    border: "1px solid var(--clr-border)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px",
                    minWidth: "210px",
                    boxShadow: "var(--shadow-dropdown)",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ paddingBottom: "8px", borderBottom: "1px solid var(--clr-border-light)" }}>
                    <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--clr-heading)" }}>{user.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--clr-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                  </div>

                  <Link
                    to="/dashboard/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      color: "var(--clr-text)",
                      padding: "6px 8px",
                      borderRadius: "var(--radius-xs)",
                    }}
                  >
                    <SettingsIcon size={14} />
                    <span>Account Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      color: "var(--clr-error)",
                      padding: "6px 8px",
                      borderRadius: "var(--radius-xs)",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => openAuthModal("login")}
            >
              <User size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
