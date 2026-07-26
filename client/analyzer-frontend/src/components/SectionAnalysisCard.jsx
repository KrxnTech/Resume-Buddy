import { AnimatePresence, motion } from "framer-motion";
import KeywordList from "./KeywordList";
import RecommendationCard from "./RecommendationCard";
import SectionScore from "./SectionScore";

function SectionAnalysisCard({ section, isOpen, onToggle }) {
  const iconMap = {
    skills: "⚙️",
    projects: "🧩",
    experience: "💼",
    education: "🎓",
    formatting: "🧾",
    contact: "📇",
  };

  const hasProjectBreakdown = Array.isArray(section.projectBreakdown) && section.projectBreakdown.length > 0;
  const hasExperienceMetrics = section.leadershipScore !== undefined || section.technicalScore !== undefined;
  const hasEducationMetrics = section.educationScore !== undefined;
  const hasContactMetrics = section.contactScore !== undefined;

  return (
    <motion.article
      layout
      className="section-analysis-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button className="section-analysis-toggle" onClick={onToggle} type="button">
        <div className="section-analysis-header">
          <div className="section-analysis-title-wrap">
            <span className="section-analysis-icon">{iconMap[section.key] || "📌"}</span>
            <div>
              <h3>{section.label}</h3>
              <p>{section.subtitle || "Interactive ATS insight"}</p>
            </div>
          </div>
          <div className="section-analysis-score-wrap">
            <SectionScore score={section.score} size={54} />
            <span className="section-analysis-chevron">{isOpen ? "▾" : "▸"}</span>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="section-analysis-details"
          >
            <div className="section-analysis-summary">
              <p>{section.explanation}</p>
            </div>

            <div className="section-analysis-grid">
              <div className="section-analysis-stack">
                <div className="section-analysis-block">
                  <div className="section-analysis-block-title">Strengths</div>
                  <ul className="section-analysis-list">
                    {section.strengths?.length > 0 ? (
                      section.strengths.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
                    ) : (
                      <li>No strengths detected yet.</li>
                    )}
                  </ul>
                </div>

                <div className="section-analysis-block">
                  <div className="section-analysis-block-title">Weaknesses</div>
                  <ul className="section-analysis-list">
                    {section.weaknesses?.length > 0 ? (
                      section.weaknesses.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
                    ) : (
                      <li>No weaknesses detected yet.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="section-analysis-stack">
                <KeywordList title="Found" items={section.keywords?.found} emptyText="No keywords detected" />
                <KeywordList title="Missing" items={section.keywords?.missing} emptyText="No missing keywords identified" />
              </div>
            </div>

            {hasProjectBreakdown && (
              <div className="section-analysis-block section-analysis-block-full">
                <div className="section-analysis-block-title">Project Breakdown</div>
                <div className="project-breakdown-list">
                  {section.projectBreakdown.map((project, index) => (
                    <div key={`${project.name}-${index}`} className="project-breakdown-item">
                      <div className="project-breakdown-header">
                        <strong>{project.name}</strong>
                        <span>{project.score}/100</span>
                      </div>
                      <p>{project.summary}</p>
                      <div className="project-breakdown-meta">
                        <span>Complexity {project.complexity}</span>
                        <span>Impact {project.impact}</span>
                        <span>Depth {project.depth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasExperienceMetrics && (
              <div className="section-analysis-block section-analysis-block-full">
                <div className="section-analysis-block-title">Experience Signals</div>
                <div className="experience-metrics">
                  <div><span>Leadership</span><strong>{section.leadershipScore}/100</strong></div>
                  <div><span>Technical</span><strong>{section.technicalScore}/100</strong></div>
                  <div><span>Achievement</span><strong>{section.achievementScore}/100</strong></div>
                  <div><span>Recruiter Impression</span><strong>{section.recruiterImpression}</strong></div>
                </div>
              </div>
            )}

            {hasEducationMetrics && (
              <div className="section-analysis-block section-analysis-block-full">
                <div className="section-analysis-block-title">Education Highlights</div>
                <div className="education-metrics">
                  <p><strong>Education score:</strong> {section.educationScore}/100</p>
                  <p><strong>Relevant degree:</strong> {section.relevantDegree}</p>
                  <p><strong>Relevant coursework:</strong> {section.relevantCoursework}</p>
                  <p><strong>Missing certifications:</strong> {section.missingCertifications}</p>
                </div>
              </div>
            )}

            {hasContactMetrics && (
              <div className="section-analysis-block section-analysis-block-full">
                <div className="section-analysis-block-title">Contact Readiness</div>
                <div className="education-metrics">
                  <p><strong>Contact score:</strong> {section.contactScore}/100</p>
                  <p><strong>Missing fields:</strong> {section.missingFields}</p>
                  <p><strong>Professionalism rating:</strong> {section.professionalismRating}/100</p>
                </div>
              </div>
            )}

            <div className="section-analysis-block section-analysis-block-full">
              <div className="section-analysis-block-title">Recommendations</div>
              <div className="recommendation-list">
                {section.recommendations?.length > 0 ? (
                  section.recommendations.map((recommendation, index) => (
                    <RecommendationCard key={`${recommendation.title}-${index}`} recommendation={recommendation} />
                  ))
                ) : (
                  <p className="recommendation-empty">No recommendations available for this section.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default SectionAnalysisCard;
