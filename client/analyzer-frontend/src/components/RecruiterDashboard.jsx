import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

function DecisionBadge({ decision }) {
  const tone = {
    "Strong Hire": "strong",
    Hire: "hire",
    Consider: "consider",
    Borderline: "borderline",
    Reject: "reject",
  }[decision] || "consider";

  return <span className={`decision-badge ${tone}`}>{decision || "Consider"}</span>;
}

function ProgressBar({ value, label }) {
  const safeValue = Math.min(100, Math.max(0, value || 0));
  return (
    <div className="progress-row">
      <div className="progress-meta">
        <span>{label}</span>
        <strong>{safeValue}%</strong>
      </div>
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function RecruiterDashboard({ analysis }) {
  const review = analysis?.recruiterReview;

  const stats = useMemo(() => {
    if (!review) return [];
    return [
      { label: "Hiring Probability", value: review.hiringProbability },
      { label: "Technical Round", value: review.technicalRoundChance },
      { label: "HR Round", value: review.hrRoundChance },
      { label: "Offer Chance", value: review.offerChance },
    ];
  }, [review]);

  if (!review) {
    return (
      <section className="recruiter-dashboard-card empty-state">
        <div className="tag-card-header">
          <span className="tag-card-title">AI Recruiter Dashboard</span>
        </div>
        <p className="interactive-analyzer-subtitle">Recruiter review data is not available yet for this analysis.</p>
      </section>
    );
  }

  return (
    <motion.section
      className="recruiter-dashboard-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      aria-label="AI Recruiter Dashboard"
    >
      <div className="tag-card-header">
        <span className="tag-card-title">AI Recruiter Dashboard</span>
        <DecisionBadge decision={review.decision} />
      </div>

      <div className="dashboard-hero">
        <div className="dashboard-hero-main">
          <div className="dashboard-score-ring">
            <div className="dashboard-score-value">{review.confidence}</div>
            <div className="dashboard-score-label">Confidence</div>
          </div>
          <div>
            <h3>Recruiter Summary</h3>
            <p>{review.overallComment}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-title">Hiring Probability</div>
          {stats.map((item) => (
            <ProgressBar key={item.label} value={item.value} label={item.label} />
          ))}
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-title">Top Strengths</div>
          <div className="chip-list">
            {review.topStrengths?.map((strength, index) => (
              <span key={`${strength}-${index}`} className="dashboard-chip green">{strength}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-title">Major Risks</div>
          <div className="chip-list">
            {review.majorRisks?.map((risk, index) => (
              <span key={`${risk}-${index}`} className="dashboard-chip red">{risk}</span>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-title">Best Roles</div>
          <div className="role-list">
            {review.bestRoles?.map((role, index) => (
              <div key={`${role.role}-${index}`} className="role-card">
                <div className="role-header">
                  <strong>{role.role}</strong>
                  <span>{role.compatibility}%</span>
                </div>
                <p>{role.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-title">Salary Fit</div>
          <div className="salary-fit-list">
            {Object.entries(review.salaryFit || {}).map(([level, value]) => (
              <div key={level} className="salary-fit-item">
                <span>{level}</span>
                <strong>{value}%</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-title">Recruiter Notes</div>
          <ul className="note-list">
            {review.recruiterNotes?.map((note, index) => (
              <li key={`${note}-${index}`}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dashboard-panel full-width">
        <div className="dashboard-panel-title">Final Recommendations</div>
        <div className="recommendation-stack">
          {review.finalRecommendations?.map((item, index) => (
            <div key={`${item.action}-${index}`} className="recommendation-pill">
              <div className="recommendation-pill-top">
                <span className="recommendation-pill-priority">{item.priority}</span>
                <span className="recommendation-pill-difficulty">{item.difficulty}</span>
              </div>
              <strong>{item.action}</strong>
              <p>ATS: {item.expectedAtsImprovement}</p>
              <p>Recruiter: {item.expectedRecruiterImpact}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default RecruiterDashboard;
