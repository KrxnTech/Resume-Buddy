import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import InteractiveSectionAnalyzer from "../components/InteractiveSectionAnalyzer";

function SectionAnalyzer() {
  const { result } = useAnalysis();
  const navigate = useNavigate();
  const analysis = result?.analysis;

  if (!analysis) {
    return (
      <div className="copilot-empty-state">
        <div className="copilot-empty-icon">📑</div>
        <h2>No Section Analysis Loaded</h2>
        <p>Upload and analyze a resume first to inspect individual section health and formatting scores.</p>
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
        <span className="kinetic-eyebrow">STRUCTURAL AUDIT</span>
        <h2 style={{ fontSize: "1.6rem", margin: "0.25rem 0 0.5rem" }}>Resume Section Analyzer</h2>
        <p style={{ color: "var(--clr-text-2)", fontSize: "0.9rem", margin: 0 }}>
          Analyze scoring benchmarks for individual sections of your resume. Review section formatting rules, weakness alerts, and targeted text corrections.
        </p>
      </div>

      <div className="detail-components-stack" style={{ marginTop: "1.5rem" }}>
        <InteractiveSectionAnalyzer analysis={analysis} />
      </div>
    </motion.div>
  );
}

export default SectionAnalyzer;
