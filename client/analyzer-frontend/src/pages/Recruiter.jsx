import { motion } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";
import RecruiterDashboard from "../components/RecruiterDashboard";

function Recruiter() {
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
        <h3>AI Recruiter Assessment</h3>
        <p>Read executive hiring commentary, evaluation checks, advancement probabilities (technical round, HR screening, offer chances), and salary/seniority alignment estimates.</p>
      </div>

      <div className="detail-components-stack">
        <RecruiterDashboard analysis={analysis} />
      </div>
    </motion.div>
  );
}

export default Recruiter;
