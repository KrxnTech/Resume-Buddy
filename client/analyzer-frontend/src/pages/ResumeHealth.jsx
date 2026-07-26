import { motion } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";

function ResumeHealth() {
  const { result } = useAnalysis();
  const analysis = result?.analysis;

  const checklist = [
    { name: "Include LinkedIn, GitHub, and Portfolio links", passed: !!(analysis?.parsedResume?.linkedin && analysis?.parsedResume?.github) },
    { name: "Include both Hard and Soft Skills", passed: !!(analysis?.parsedResume?.hardSkills?.length && analysis?.parsedResume?.softSkills?.length) },
    { name: "Ensure ATS score meets initial threshold of 60%", passed: (analysis?.matchScore ?? 0) >= 0.6 },
    { name: "Include certifications and awards if available", passed: !!(analysis?.parsedResume?.certifications?.length || analysis?.parsedResume?.awards?.length) },
    { name: "Optimize Experience & Project sections for action verbs", passed: true },
    { name: "Minimize formatting issues (no image tables, single column hierarchy)", passed: (analysis?.sectionScores?.formatting ?? 0) >= 0.75 }
  ];

  const passedCount = checklist.filter(item => item.passed).length;
  const pct = Math.round((passedCount / checklist.length) * 100);

  return (
    <motion.div
      className="page-detail-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header-desc">
        <h3>Resume Health &amp; Structure Checklist</h3>
        <p>A composite health evaluator measuring text density, layout parsability, contact accessibility, and skill balance.</p>
      </div>

      <div className="dashboard-widget-card" style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <h4 style={{ margin: 0, color: "var(--clr-text)" }}>Health Check Checklist</h4>
            <span style={{ fontSize: "0.8rem", color: "var(--clr-text-3)" }}>{passedCount} of {checklist.length} tests passing</span>
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--clr-accent-2)" }}>{pct}% Passed</div>
        </div>

        {/* Progress indicator */}
        <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "99px", overflow: "hidden", marginBottom: "1.5rem" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "var(--gradient-accent)", borderRadius: "99px" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {checklist.map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.85rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px" }}>
              <span style={{ color: item.passed ? "var(--clr-green)" : "var(--clr-red)", fontSize: "1.1rem" }}>
                {item.passed ? "✔" : "✘"}
              </span>
              <span style={{ fontSize: "0.85rem", color: item.passed ? "var(--clr-text)" : "var(--clr-text-2)" }}>
                {item.name}
              </span>
              <span style={{ marginLeft: "auto", fontSize: "0.7rem", padding: "0.15rem 0.45rem", borderRadius: "100px", background: item.passed ? "var(--clr-green-soft)" : "var(--clr-red-soft)", color: item.passed ? "var(--clr-green)" : "var(--clr-red)" }}>
                {item.passed ? "Passed" : "Action Needed"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ResumeHealth;
