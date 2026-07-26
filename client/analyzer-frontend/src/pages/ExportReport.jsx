import { motion } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";

function ExportReport() {
  const { resume } = useAnalysis();

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      className="page-detail-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header-desc">
        <h3>Export Report Workspace</h3>
        <p>Export your full ATS compatibility ratings, recruiter logs, and AI rewrite corrections to external files.</p>
      </div>

      <div className="dashboard-widget-card" style={{ textAlign: "center", padding: "3rem 2rem", maxWidth: "600px", margin: "1rem auto" }}>
        <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>📥</span>
        <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", color: "var(--clr-text)" }}>Download Summary Report</h4>
        <p style={{ color: "var(--clr-text-2)", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Generate a parsed PDF analysis detailing missing skills, sections match breakdown, and recruiter scores for <strong>{resume?.name || "Active Resume"}</strong>.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button className="landing-primary-btn" onClick={handlePrint} style={{ padding: "0.6rem 1.5rem", fontSize: "0.85rem" }}>
            Print PDF Report
          </button>
          <button className="landing-secondary-btn" onClick={() => alert("Structured JSON exports are in beta!")} style={{ padding: "0.6rem 1.5rem", fontSize: "0.85rem" }}>
            Export JSON
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ExportReport;
