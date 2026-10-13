import { generateCopilotReply } from "../services/ai.service.js";

export const copilotReply = async (req, res) => {
  try {
    const { question, context, history } = req.body || {};

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "A question is required" });
    }

    const reply = await generateCopilotReply(question.trim(), context || {}, history || []);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("COPILOT ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to generate copilot reply. Please try again." });
  }
};
