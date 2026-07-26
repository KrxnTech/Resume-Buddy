import { motion } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";
import InteractiveSectionAnalyzer from "../components/InteractiveSectionAnalyzer";

function SectionAnalyzer() {
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
        <h3>Resume Section Analyzer</h3>
        <p>Analyze scoring benchmarks for individual sections of your resume. Review section formatting rules, weakness alerts, and targeted text corrections.</p>
      </div>

      <div className="detail-components-stack">
        <InteractiveSectionAnalyzer analysis={analysis} />
      </div>
    </motion.div>
  );
}

export default SectionAnalyzer;
