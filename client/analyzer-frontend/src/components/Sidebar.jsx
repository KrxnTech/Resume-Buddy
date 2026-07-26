import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";

const MENU_GROUPS = [
  {
    title: "Analysis Suite",
    items: [
      { path: "/dashboard", label: "Overview", icon: "•" },
      { path: "/dashboard/profile", label: "Resume Profile", icon: "•" },
      { path: "/dashboard/ats", label: "ATS Analysis", icon: "•" },
      { path: "/dashboard/recruiter", label: "Recruiter Review", icon: "•" },
      { path: "/dashboard/sections", label: "Section Analyzer", icon: "•" },
      { path: "/dashboard/rewrite", label: "Rewrite Studio", icon: "•" },
    ]
  },
  {
    title: "AI Assistant",
    items: [
      { path: "/dashboard/copilot", label: "🤖 Career Copilot", icon: "•" },
    ]
  },
  {
    title: "Career Utilities",
    items: [
      { path: "/dashboard/health", label: "Resume Health", icon: "•", badge: "Beta" },
      { path: "/dashboard/interview", label: "Interview Prep", icon: "•" },
      { path: "/dashboard/roadmap", label: "Career Roadmap", icon: "•" },
      { path: "/dashboard/export", label: "Export Report", icon: "•" },
    ]
  },
  {
    title: "System",
    items: [
      { path: "/dashboard/settings", label: "Settings", icon: "•" }
    ]
  }
];

function Sidebar({ isOpen, toggleOpen, isMobile, closeMobile }) {
  const { hasAnalysis } = useAnalysis();

  // If no analysis is done, we disable dashboard detail links to prevent errors (they will redirect to upload)
  return (
    <>
      {/* Mobile Sidebar backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className="sidebar-mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleOpen}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`app-sidebar ${isOpen ? "expanded" : "collapsed"} ${isMobile ? "mobile-drawer" : ""}`}
        animate={isMobile ? { x: isOpen ? 0 : "-100%" } : { width: isOpen ? 250 : 70 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {isOpen && <span className="logo-text">Analyzer Buddy <i class="fa-solid fa-shield-cat"></i> </span>}
          </div>
          {!isMobile && (
            <button className="sidebar-toggle" onClick={toggleOpen} title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}>
              {isOpen ? "◀" : "▶"}
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        <nav className="sidebar-nav">
          {MENU_GROUPS.map((group, groupIdx) => (
            <div key={group.title} className="sidebar-group">
              {isOpen && <div className="sidebar-group-title">{group.title}</div>}
              <div className="sidebar-group-items">
                {group.items.map((item) => {
                  const isDisabled = !hasAnalysis && item.path.startsWith("/dashboard") && item.path !== "/dashboard" && item.path !== "/dashboard/settings";

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
                          alert("Please upload and analyze a resume first!");
                          return;
                        }
                        if (isMobile) closeMobile();
                      }}
                      title={!isOpen ? item.label : ""}
                    >
                      <span className="sidebar-link-icon">{item.icon}</span>
                      {isOpen && (
                        <>
                          <span className="sidebar-link-label">{item.label}</span>
                          {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
              {groupIdx < MENU_GROUPS.length - 1 && <hr className="sidebar-divider" />}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {isOpen && (
          <div className="sidebar-footer">
            <div className="sidebar-user-avatar">AD</div>
            <div className="sidebar-user-info">
              <div className="user-name">Premium Pro</div>
              <div className="user-plan">SaaS User</div>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}

export default Sidebar;
