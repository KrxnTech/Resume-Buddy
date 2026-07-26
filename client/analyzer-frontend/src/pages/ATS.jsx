import { motion } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";
import { ScoreCard, ATSBreakdown } from "../components/ResultBox";

function ATS() {
  const { result } = useAnalysis();
  const analysis = result?.analysis;

  if (!analysis) return null;

  return (
    <motion.div
      className="page-detail-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header-desc">
        <h3>ATS Optimization &amp; Score Breakdown</h3>
        <p>Analyze how formatting styles, contact info links, experience descriptions, project summaries, and required skills map to the target parser thresholds.</p>
      </div>

      <div className="detail-components-stack">
        <ScoreCard analysis={analysis} />
        <ATSBreakdown analysis={analysis} />
      </div>
    </motion.div>
  );
}

export default ATS;
