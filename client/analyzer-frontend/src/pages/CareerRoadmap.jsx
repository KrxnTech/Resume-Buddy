import { motion } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";

function CareerRoadmap() {
  const { result } = useAnalysis();
  const analysis = result?.analysis;

  const steps = [
    { title: "Bridge Core Skill Gaps", desc: `Focus on acquiring key missing keywords: ${analysis?.missingSkills?.slice(0, 3)?.join(", ") || "target job skills"}.`, label: "Step 1" },
    { title: "Optimize Resume Bullets", desc: "Use Action Verbs from the Rewrite Studio to rewrite weak achievements in your Experience sections.", label: "Step 2" },
    { title: "Acquire Certifications", desc: "Gain certifications or update your portfolio projects to validate technical competencies.", label: "Step 3" },
    { title: "Target Strategic Roles", desc: `Apply for positions matches like: ${analysis?.recruiterReview?.bestRoles?.slice(0, 2)?.map(r => r.role)?.join(" or ") || "Hiring Roles"}.`, label: "Step 4" }
  ];

  return (
    <motion.div
      className="page-detail-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header-desc">
        <h3>Career Progression Roadmap</h3>
        <p>A step-by-step roadmap mapping career advancement milestones based on current gaps and recruiter recommendations.</p>
      </div>

      <div style={{ position: "relative", paddingLeft: "1.5rem", borderLeft: "2px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "1.5rem", margin: "1rem 0" }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ position: "relative" }}>
            {/* Timeline node */}
            <div style={{ position: "absolute", left: "-2.05rem", top: "0.2rem", width: "16px", height: "16px", background: "var(--clr-accent)", border: "4px solid var(--clr-bg)", borderRadius: "50%", boxShadow: "0 0 10px var(--clr-accent-glow)" }} />

            <div className="dashboard-widget-card" style={{ width: "100%", margin: 0 }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--clr-accent-2)" }}>{step.label}</span>
              <h4 style={{ margin: "0.25rem 0", color: "var(--clr-text)" }}>{step.title}</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--clr-text-2)", lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default CareerRoadmap;
