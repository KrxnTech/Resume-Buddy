import { AnimatePresence, motion } from "framer-motion";
import { Code, FolderGit2, Briefcase, GraduationCap, FileText, PhoneCall, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react";
import KeywordList from "./KeywordList";
import RecommendationCard from "./RecommendationCard";
import SectionScore from "./SectionScore";

const iconMap = {
  skills: <Code size={18} style={{ color: "var(--color-primary)" }} />,
  projects: <FolderGit2 size={18} style={{ color: "var(--color-primary)" }} />,
  experience: <Briefcase size={18} style={{ color: "var(--color-primary)" }} />,
  education: <GraduationCap size={18} style={{ color: "var(--color-primary)" }} />,
  formatting: <FileText size={18} style={{ color: "var(--color-primary)" }} />,
  contact: <PhoneCall size={18} style={{ color: "var(--color-primary)" }} />,
};

function SectionAnalysisCard({ section, isOpen, onToggle }) {
  const hasProjectBreakdown = Array.isArray(section.projectBreakdown) && section.projectBreakdown.length > 0;
  const hasExperienceMetrics = section.leadershipScore !== undefined || section.technicalScore !== undefined;
  const hasEducationMetrics = section.educationScore !== undefined;
  const hasContactMetrics = section.contactScore !== undefined;

  return (
    <div
      className="card"
      style={{
        marginBottom: "0.75rem",
        overflow: "hidden",
        borderColor: isOpen ? "var(--color-primary)" : "var(--color-border)",
        transition: "border-color 0.2s ease",
      }}
    >
      <button
        onClick={onToggle}
        type="button"
        style={{
          width: "100%",
          padding: "1.25rem 1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {iconMap[section.key] || <FileText size={18} style={{ color: "var(--color-primary)" }} />}
          </div>
          <div>
            <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-heading)", margin: "0 0 2px" }}>
              {section.label}
            </h4>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
              {section.subtitle || "ATS alignment inspection"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <SectionScore score={section.score} size={48} />
          {isOpen ? <ChevronDown size={18} style={{ color: "var(--color-text-muted)" }} /> : <ChevronRight size={18} style={{ color: "var(--color-text-muted)" }} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid var(--color-border)", paddingTop: "1.25rem" }}>
              <div style={{ background: "var(--color-bg-secondary)", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.25rem" }}>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-text)", lineHeight: 1.5 }}>
                  {section.explanation}
                </p>
              </div>

              {/* Strengths & Weaknesses 2-Column Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-success)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={14} /> Strengths
                  </div>
                  <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.85rem", color: "var(--color-text)", lineHeight: 1.6 }}>
                    {section.strengths?.length > 0 ? (
                      section.strengths.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
                    ) : (
                      <li>No specific strengths identified.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-error)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "4px" }}>
                    <AlertTriangle size={14} /> Areas to Improve
                  </div>
                  <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.85rem", color: "var(--color-text)", lineHeight: 1.6 }}>
                    {section.weaknesses?.length > 0 ? (
                      section.weaknesses.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
                    ) : (
                      <li>No critical weaknesses identified.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Keywords */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <KeywordList title="Found Keywords" items={section.keywords?.found} emptyText="No target keywords detected in this section" />
                <KeywordList title="Missing Keywords" items={section.keywords?.missing} emptyText="All primary keywords present" />
              </div>

              {hasProjectBreakdown && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
                    Project Breakdown
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {section.projectBreakdown.map((project, index) => (
                      <div key={`${project.name}-${index}`} style={{ padding: "0.75rem", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <strong style={{ fontSize: "0.85rem", color: "var(--color-heading)" }}>{project.name}</strong>
                          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary)" }}>{project.score}/100</span>
                        </div>
                        <p style={{ margin: "0 0 6px", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{project.summary}</p>
                        <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                          <span>Complexity: <strong>{project.complexity}</strong></span>
                          <span>Impact: <strong>{project.impact}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
                  Actionable Recommendations
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {section.recommendations?.length > 0 ? (
                    section.recommendations.map((recommendation, index) => (
                      <RecommendationCard key={`${recommendation.title}-${index}`} recommendation={recommendation} />
                    ))
                  ) : (
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", margin: 0 }}>
                      No specific recommendations needed for this section.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SectionAnalysisCard;
