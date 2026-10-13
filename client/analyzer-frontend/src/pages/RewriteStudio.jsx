import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import ResumeRewriteStudio from "../components/ResumeRewriteStudio";

function RewriteStudio() {
  const { result } = useAnalysis();
  const navigate = useNavigate();
  const analysis = result?.analysis;

  if (!analysis) {
    return (
      <div className="copilot-empty-state">
        <div className="copilot-empty-icon">✍️</div>
        <h2>No Resume Rewrites Loaded</h2>
        <p>Upload and analyze a resume first to generate AI-powered bullet and section rewrites.</p>
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
        <span className="kinetic-eyebrow">BULLET &amp; SECTION REWRITER</span>
        <h2 style={{ fontSize: "1.6rem", margin: "0.25rem 0 0.5rem" }}>AI Resume Rewrite Studio</h2>
        <p style={{ color: "var(--clr-text-2)", fontSize: "0.9rem", margin: 0 }}>
          Enhance resume statements professionally. Compare drafts side-by-side, highlight diff edits, evaluate verb selections, and save version backups.
        </p>
      </div>

      <div className="detail-components-stack" style={{ marginTop: "1.5rem" }}>
        <ResumeRewriteStudio analysis={analysis} />
      </div>
    </motion.div>
  );
}

export default RewriteStudio;
