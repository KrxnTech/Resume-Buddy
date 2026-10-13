import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import RecruiterDashboard from "../components/RecruiterDashboard";

function Recruiter() {
  const { result } = useAnalysis();
  const navigate = useNavigate();
  const analysis = result?.analysis;

  if (!analysis) {
    return (
      <div className="copilot-empty-state">
        <div className="copilot-empty-icon">👔</div>
        <h2>No Recruiter Assessment Loaded</h2>
        <p>Upload and analyze a resume first to view the executive AI recruiter hiring matrix.</p>
        <button
          type="button"
          className="kinetic-cta-btn primary"
          style={{ marginTop: "1rem" }}
          onClick={() => navigate("/upload")}
        >
          UPLOAD RESUME →
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="page-detail-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header-desc">
        <span className="kinetic-eyebrow">HIRING MANAGER ASSESSMENT</span>
        <h2 style={{ fontSize: "1.6rem", margin: "0.25rem 0 0.5rem" }}>AI Recruiter Review Matrix</h2>
        <p style={{ color: "var(--clr-text-2)", fontSize: "0.9rem", margin: 0 }}>
          Read executive hiring commentary, advancement probabilities (technical round, HR screening, offer chances), and salary/seniority alignment estimates.
        </p>
      </div>

      <div className="detail-components-stack" style={{ marginTop: "1.5rem" }}>
        <RecruiterDashboard analysis={analysis} />
      </div>
    </motion.div>
  );
}

export default Recruiter;
