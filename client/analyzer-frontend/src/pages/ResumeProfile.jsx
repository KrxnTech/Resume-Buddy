import { motion } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";
import { ResumeProfile as ProfileWidget } from "../components/ResultBox";

function ResumeProfile() {
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
        <h3>Extracted Resume Profile Data</h3>
        <p>Inspect parsed contact links, Normalized hard &amp; soft skills lists, certifications, awards, internships, and language details extracted by our parser.</p>
      </div>

      <div className="detail-components-stack">
        <ProfileWidget analysis={analysis} />
      </div>
    </motion.div>
  );
}

export default ResumeProfile;
