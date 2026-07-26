import { generateCopilotReply } from "../services/ai.service.js";

const buildCopilotPrompt = (question, context) => {
  const safeContext = context || {};
  const parsedResume = safeContext.parsedResume || {};
  const recruiter = safeContext.recruiter || {};
  const rewrite = safeContext.rewrite || {};
  const roadmap = safeContext.roadmap || null;
  const interviewPrep = safeContext.interviewPrep || null;

  return `
You are ResumeOS Career Copilot.

You must answer using ONLY the analysis context provided below.
If the information is missing, say so clearly and do not hallucinate.

User Question:
${question}

Context:
- Parsed Resume: ${JSON.stringify(parsedResume)}
- ATS Summary: ${safeContext.ats || "Not available"}
- Recruiter Review: ${JSON.stringify(recruiter)}
- Resume Health Summary: ${safeContext.health || "Not available"}
- Strengths: ${JSON.stringify(safeContext.strengths || [])}
- Weaknesses/Improvements: ${JSON.stringify(safeContext.weaknesses || [])}
- Missing Skills: ${JSON.stringify(safeContext.missingSkills || [])}
- Section Scores: ${JSON.stringify(safeContext.sectionScores || {})}
- Match Score: ${safeContext.matchScore ?? "Not available"}
- Rewrite Studio: ${JSON.stringify(rewrite)}
- Career Roadmap: ${JSON.stringify(roadmap)}
- Interview Prep: ${JSON.stringify(interviewPrep)}

Instructions:
- Answer in concise, actionable, premium SaaS style.
- Use bullet points when helpful.
- Never invent facts.
- If the question asks about ATS, recruiter review, rewrite, roadmap, interview, salary readiness, or project suggestions, base the answer on the available context.
- End with 3 concise follow-up suggestions in a numbered list.
`;
};

export const copilotReply = async (req, res) => {
  try {
    const { question, context } = req.body || {};

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "A question is required" });
    }

    const reply = await generateCopilotReply(question, context);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("COPILOT ERROR:", error);
    res.status(500).json({ error: "Copilot response failed" });
  }
};
