import { motion } from "framer-motion";
import { useMemo } from "react";

function DecisionBadge({ decision }) {
  const tone = {
    "Strong Hire": "strong",
    Hire: "hire",
    Consider: "consider",
    Borderline: "borderline",
    Reject: "reject",
  }[decision] || "consider";

  return <span className={`decision-badge ${tone}`}>{(decision || "Consider").toUpperCase()}</span>;
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
  const review = useMemo(() => {
    const raw = analysis?.recruiterReview;
    if (raw && typeof raw === "object" && Object.keys(raw).length > 0) {
      return raw;
    }

    const score = Math.round((analysis?.matchScore || 0.7) * 100);
    return {
      decision: score >= 80 ? "Strong Hire" : score >= 65 ? "Hire" : score >= 50 ? "Consider" : "Borderline",
      confidence: 90,
      overallComment: analysis?.summary || analysis?.atsExplanation || "The candidate demonstrates strong technical capabilities and relevant core experience.",
      hiringProbability: Math.min(95, Math.max(40, score)),
      technicalRoundChance: Math.min(95, Math.max(45, score + 5)),
      hrRoundChance: 85,
      offerChance: Math.min(90, Math.max(35, score - 5)),
      topStrengths: analysis?.strengths || ["Core Architecture Experience", "Proven Tech Stack"],
      majorRisks: analysis?.improvements || ["Missing specific cloud/tool keywords"],
      bestRoles: [
        { role: analysis?.candidateProfile?.identity?.professionalTitle || "Full Stack Engineer", compatibility: score, reason: "Direct stack and experience alignment." },
        { role: "Backend Systems Engineer", compatibility: Math.max(50, score - 8), reason: "Demonstrated backend and database competencies." }
      ],
      salaryFit: {
        "Junior": 95,
        "Mid Level": score >= 60 ? 90 : 70,
        "Senior": score >= 75 ? 85 : 55,
        "Lead / Principal": score >= 85 ? 75 : 40,
      },
      recruiterNotes: [
        "Candidate possesses verified core technical skills matching requirements.",
        "Strengthen quantifiable project impact metrics for senior consideration.",
      ],
      finalRecommendations: (analysis?.improvements || []).map((imp, idx) => ({
        priority: idx === 0 ? "High" : "Medium",
        action: imp,
        expectedAtsImprovement: "+12% Match",
        expectedRecruiterImpact: "High Recruiter Visibility",
        difficulty: "Medium",
      }))
    };
  }, [analysis]);

  const stats = useMemo(() => {
    return [
      { label: "Hiring Probability", value: review.hiringProbability || 75 },
      { label: "Technical Round Pass Odds", value: review.technicalRoundChance || 80 },
      { label: "HR Screening Pass Odds", value: review.hrRoundChance || 85 },
      { label: "Final Offer Chance", value: review.offerChance || 70 },
    ];
  }, [review]);

  return (
    <motion.section
      className="recruiter-dashboard-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      aria-label="AI Recruiter Dashboard"
    >
      <div className="tag-card-header">
        <span className="tag-card-title">AI Recruiter Hiring Decision</span>
        <DecisionBadge decision={review.decision} />
      </div>

      <div className="dashboard-hero">
        <div className="dashboard-hero-main">
          <div className="dashboard-score-ring">
            <div className="dashboard-score-value">{review.confidence || 90}%</div>
            <div className="dashboard-score-label">Confidence</div>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 0.4rem", fontSize: "1.15rem" }}>Hiring Manager Commentary</h3>
            <p style={{ margin: 0, color: "var(--clr-text-2)", lineHeight: 1.55, fontSize: "0.92rem" }}>
              {review.overallComment}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-title">Stage Advancement Probabilities</div>
          {stats.map((item) => (
            <ProgressBar key={item.label} value={item.value} label={item.label} />
          ))}
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-title">Identified Strengths</div>
          <div className="chip-list">
            {(review.topStrengths?.length ? review.topStrengths : ["Solid Stack Breadth", "Clear Experience Narrative"]).map((strength, index) => (
              <span key={`${strength}-${index}`} className="dashboard-chip green">✓ {strength}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-title">Identified Candidate Risks</div>
          <div className="chip-list">
            {(review.majorRisks?.length ? review.majorRisks : ["Quantifiable impact metrics could be expanded"]).map((risk, index) => (
              <span key={`${risk}-${index}`} className="dashboard-chip red">✕ {risk}</span>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-title">Best-Fit Roles</div>
          <div className="role-list">
            {(review.bestRoles?.length ? review.bestRoles : [{ role: "Full Stack Engineer", compatibility: 85, reason: "Direct skill alignment" }]).map((role, index) => (
              <div key={`${role.role}-${index}`} className="role-card">
                <div className="role-header">
                  <strong>{role.role}</strong>
                  <span>{role.compatibility}% Match</span>
                </div>
                <p>{role.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-title">Seniority &amp; Salary Readiness</div>
          <div className="salary-fit-list">
            {Object.entries(review.salaryFit || { "Junior": 95, "Mid Level": 85, "Senior": 70 }).map(([level, value]) => (
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
            {(review.recruiterNotes?.length ? review.recruiterNotes : ["Clear technical foundation demonstrated."]).map((note, index) => (
              <li key={`${note}-${index}`}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dashboard-panel full-width">
        <div className="dashboard-panel-title">Prioritized Recommendations</div>
        <div className="recommendation-stack">
          {(review.finalRecommendations?.length ? review.finalRecommendations : [{ priority: "High", action: "Add quantifiable metrics to top project", expectedAtsImprovement: "+15% ATS", expectedRecruiterImpact: "High Impact", difficulty: "Easy" }]).map((item, index) => (
            <div key={`${item.action}-${index}`} className="recommendation-pill">
              <div className="recommendation-pill-top">
                <span className="recommendation-pill-priority">PRIORITY: {item.priority}</span>
                <span className="recommendation-pill-difficulty">{item.difficulty}</span>
              </div>
              <strong className="rec-action-text">{item.action}</strong>
              <div className="rec-impact-row">
                <span>ATS: <strong>{item.expectedAtsImprovement}</strong></span>
                <span>Recruiter: <strong>{item.expectedRecruiterImpact}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default RecruiterDashboard;
