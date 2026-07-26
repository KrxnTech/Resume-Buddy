import { motion } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";
import ResumeRewriteStudio from "../components/ResumeRewriteStudio";

function RewriteStudio() {
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
        <h3>AI Resume Rewrite Studio</h3>
        <p>Enhance resume statements professionally. Compare drafts side-by-side, highlight diff edits, evaluate verb selections, and save version backups.</p>
      </div>

      <div className="detail-components-stack">
        <ResumeRewriteStudio analysis={analysis} />
      </div>
    </motion.div>
  );
}

export default RewriteStudio;
