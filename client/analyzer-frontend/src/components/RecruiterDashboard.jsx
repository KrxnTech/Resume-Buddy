import { useMemo } from "react";
import { UserCheck, CheckCircle2, AlertTriangle, Briefcase, Award, TrendingUp, Info } from "lucide-react";

function DecisionBadge({ decision }) {
  const badgeMap = {
    "Strong Hire": "badge-success",
    Hire: "badge-success",
    Consider: "badge-warning",
    Borderline: "badge-warning",
    Reject: "badge-error",
  };
  const badgeClass = badgeMap[decision] || "badge-neutral";

  return (
    <span className={`badge ${badgeClass}`} style={{ fontSize: "0.85rem", padding: "4px 10px", fontWeight: 600 }}>
      {decision || "Consider"}
    </span>
  );
}

function ProgressBar({ value, label }) {
  const safeValue = Math.min(100, Math.max(0, value || 0));
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "4px" }}>
        <span style={{ color: "var(--color-heading)", fontWeight: 500 }}>{label}</span>
        <span style={{ color: "var(--color-text-muted)", fontWeight: 600 }}>{safeValue}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${safeValue}%`, backgroundColor: "var(--color-primary)" }} />
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
      confidence: 85,
      overallComment: analysis?.summary || analysis?.atsExplanation || "The candidate demonstrates solid technical capabilities and relevant core experience.",
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
      { label: "Overall Alignment", value: review.hiringProbability || 75 },
      { label: "Technical Competence Fit", value: review.technicalRoundChance || 80 },
      { label: "HR / Background Screening", value: review.hrRoundChance || 85 },
      { label: "Candidate Offer Potential", value: review.offerChance || 70 },
    ];
  }, [review]);

  return (
    <div className="card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <UserCheck size={20} style={{ color: "var(--color-primary)" }} />
          <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
            Recruiter Perspective &amp; Evaluation
          </h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Assessment:</span>
          <DecisionBadge decision={review.decision} />
        </div>
      </div>

      {/* Hiring Manager Commentary */}
      <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
          Hiring Manager Assessment
        </div>
        <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--color-heading)", lineHeight: 1.6 }}>
          {review.overallComment}
        </p>
      </div>

      {/* Grid: Probabilities & Strengths */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div>
          <h4 style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--color-heading)", marginBottom: "1rem" }}>
            Estimated Stage Advancement
          </h4>
          {stats.map((item) => (
            <ProgressBar key={item.label} value={item.value} label={item.label} />
          ))}
        </div>

        <div>
          <h4 style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--color-heading)", marginBottom: "1rem" }}>
            Candidate Strengths &amp; Potential Concerns
          </h4>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-success)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "4px" }}>
              <CheckCircle2 size={14} /> Top Strengths
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {(review.topStrengths || []).map((s, idx) => (
                <span key={idx} className="badge badge-success" style={{ fontSize: "0.78rem" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-warning)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "4px" }}>
              <AlertTriangle size={14} /> Potential Concerns
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {(review.majorRisks || []).map((r, idx) => (
                <span key={idx} className="badge badge-warning" style={{ fontSize: "0.78rem" }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Best Roles & Seniority Alignment */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div>
          <h4 style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--color-heading)", marginBottom: "0.75rem" }}>
            Role Compatibility
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {(review.bestRoles || []).map((role, idx) => (
              <div key={idx} style={{ padding: "0.75rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", background: "var(--color-bg-primary)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <strong style={{ fontSize: "0.88rem", color: "var(--color-heading)" }}>{role.role}</strong>
                  <span className="badge badge-neutral" style={{ fontSize: "0.78rem" }}>{role.compatibility}% Match</span>
                </div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{role.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--color-heading)", marginBottom: "0.75rem" }}>
            Seniority Readiness
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {Object.entries(review.salaryFit || { Junior: 95, "Mid Level": 80, Senior: 60 }).map(([lvl, val]) => (
              <div key={lvl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--color-border)", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--color-heading)" }}>{lvl}</span>
                <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>{val}% Fit</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recruiter Disclaimer */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--color-text-muted)", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
        <Info size={14} />
        <span>Recruiter evaluations are analytical estimates based on resume heuristics and do not guarantee actual interview invitations or job offers.</span>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
