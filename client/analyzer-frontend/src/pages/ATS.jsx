import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import { ScoreCard, ATSBreakdown } from "../components/ResultBox";

function ATS() {
  const { result } = useAnalysis();
  const navigate = useNavigate();
  const analysis = result?.analysis;

  if (!analysis) {
    return (
      <div className="copilot-empty-state">
        <div className="copilot-empty-icon">🎯</div>
        <h2>No ATS Metrics Loaded</h2>
        <p>Upload and analyze a resume first to view the detailed ATS parser breakdown and section scores.</p>
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
        <span className="kinetic-eyebrow">KEYWORD &amp; COMPLIANCE RADAR</span>
        <h2 style={{ fontSize: "1.6rem", margin: "0.25rem 0 0.5rem" }}>ATS Optimization &amp; Score Breakdown</h2>
        <p style={{ color: "var(--clr-text-2)", fontSize: "0.9rem", margin: 0 }}>
          Analyze how formatting styles, contact info links, experience descriptions, project summaries, and required skills map to the target parser thresholds.
        </p>
      </div>

      <div className="detail-components-stack" style={{ marginTop: "1.5rem" }}>
        <ScoreCard analysis={analysis} />
        <ATSBreakdown analysis={analysis} />
      </div>
    </motion.div>
  );
}

export default ATS;
