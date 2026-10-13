import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  UserCheck,
  Target,
  Briefcase,
  FileText,
  Bot,
  HeartPulse,
  Mic,
  Map,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";
import { useAuth } from "../hooks/useAuth";

const MENU_GROUPS = [
  {
    title: "Analysis Suite",
    items: [
      { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { path: "/dashboard/profile", label: "Resume Profile", icon: UserCheck },
      { path: "/dashboard/ats", label: "ATS Compatibility", icon: Target },
      { path: "/dashboard/recruiter", label: "Recruiter Review", icon: Briefcase },
      { path: "/dashboard/sections", label: "Section Analysis", icon: FileText },
    ],
  },
  {
    title: "AI Tools",
    items: [
      { path: "/dashboard/copilot", label: "Career Copilot", icon: Bot },
      { path: "/dashboard/interview", label: "Interview Prep", icon: Mic },
    ],
  },
  {
    title: "Career Utilities",
    items: [
      { path: "/dashboard/health", label: "Resume Health", icon: HeartPulse },
      { path: "/dashboard/roadmap", label: "Career Roadmap", icon: Map },
      { path: "/dashboard/export", label: "Export Report", icon: Download },
    ],
  },
  {
    title: "System",
    items: [
      { path: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

function Sidebar({ isOpen, toggleOpen, isMobile, closeMobile }) {
  const { hasAnalysis } = useAnalysis();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className="sidebar-mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={toggleOpen}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "#000",
              zIndex: 90,
            }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`app-sidebar ${isOpen ? "expanded" : "collapsed"}`}
        animate={isMobile ? { x: isOpen ? 0 : "-100%" } : { width: isOpen ? 240 : 68 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="brand-dot" />
            {isOpen && <span>Dashboard</span>}
          </div>
          {!isMobile && (
            <button
              className="sidebar-toggle"
              onClick={toggleOpen}
              title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>

        {/* Nav Groups */}
        <nav className="sidebar-nav">
          {MENU_GROUPS.map((group) => (
            <div key={group.title} className="sidebar-group">
              {isOpen && <div className="sidebar-group-title">{group.title}</div>}
              <div className="sidebar-group-items">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isDisabled =
                    !hasAnalysis &&
                    item.path.startsWith("/dashboard") &&
                    item.path !== "/dashboard" &&
                    item.path !== "/dashboard/settings";

                  return (
                    <NavLink
                      key={item.path}
                      to={isDisabled ? "#" : item.path}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive && !isDisabled ? "active" : ""} ${isDisabled ? "disabled" : ""}`
                      }
                      onClick={(e) => {
                        if (isDisabled) {
                          e.preventDefault();
                          alert("Please upload and analyze a resume first.");
                          return;
                        }
                        if (isMobile) closeMobile();
                      }}
                      title={!isOpen ? item.label : ""}
                    >
                      <span className="sidebar-link-icon">
                        <Icon size={16} />
                      </span>
                      {isOpen && (
                        <span className="sidebar-link-label">{item.label}</span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer User Info */}
        {isOpen && (
          <div className="sidebar-footer">
            {isAuthenticated && user ? (
              <>
                <div className="sidebar-user-avatar">{getInitials(user.name)}</div>
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name" title={user.name}>{user.name}</div>
                  <div className="sidebar-user-plan">{user.role || "Member"}</div>
                </div>
              </>
            ) : (
              <div
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", width: "100%" }}
                onClick={() => openAuthModal("login")}
              >
                <div className="sidebar-user-avatar">
                  <User size={15} />
                </div>
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name" style={{ color: "var(--clr-brand)" }}>Sign In</div>
                  <div className="sidebar-user-plan">Guest Session</div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.aside>
    </>
  );
}

export default Sidebar;
