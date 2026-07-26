import { motion } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";

function InterviewPrep() {
  const { result } = useAnalysis();
  const analysis = result?.analysis;

  const questions = [
    { type: "Technical", text: `Can you walk us through a complex system design problem you solved, and how you integrated ${analysis?.parsedResume?.hardSkills?.[0] || "relevant skills"} to achieve a stable outcome?` },
    { type: "Behavioral", text: "Describe a situation where you had to collaborate under a tight deadline. How did you organize tasks and ensure clear communications?" },
    { type: "Role Specific", text: "How do you align project development goals with the requirements and skills outlined in this job description? Can you share details from a past project?" },
    { type: "Growth & Focus", text: `What certifications or tools (e.g. ${analysis?.parsedResume?.hardSkills?.[1] || "key tech"}) are you planning to learn next, and why?` }
  ];

  return (
    <motion.div
      className="page-detail-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header-desc">
        <h3>Interview Prep Assistant</h3>
        <p>Prepare behavioral and technical mock interview questions tailored directly to your resume achievements and target job requirements.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {questions.map((q, idx) => (
          <div key={idx} className="dashboard-widget-card" style={{ width: "100%", borderLeft: "3px solid var(--clr-accent)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--clr-accent-2)", padding: "0.2rem 0.5rem", background: "var(--clr-blue-soft)", borderRadius: "4px" }}>
                {q.type} Question
              </span>
            </div>
            <p style={{ margin: "0.5rem 0", fontSize: "0.9rem", color: "var(--clr-text)", lineHeight: 1.6 }}>
              {q.text}
            </p>
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button className="rewrite-action-btn rewrite-copy-btn" onClick={() => {
                navigator.clipboard.writeText(q.text);
                alert("Question copied!");
              }}>
                Copy Question
              </button>
              <button className="rewrite-action-btn rewrite-save-btn" onClick={() => alert("Simulation answer features coming soon!")}>
                Draft Answer
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default InterviewPrep;
