import { interviewStore } from "../services/interviewSessionStore.js";
import {
  generateFirstQuestion,
  evaluateAnswerAndNext,
  generateFinalReport,
  getInterviewerHint,
} from "../services/interview.service.js";

export const startInterview = async (req, res) => {
  try {
    const { candidateContext, mode, difficulty, totalQuestions, targetRole } = req.body || {};

    if (!candidateContext) {
      return res.status(400).json({ error: "Candidate profile or context is required to start mock interview." });
    }

    const session = interviewStore.createSession({
      candidateContext,
      mode: mode || "technical",
      difficulty: difficulty || "adaptive",
      totalQuestions: totalQuestions || 5,
      targetRole: targetRole || "",
    });

    const firstQuestion = await generateFirstQuestion(session);
    session.currentQuestion = firstQuestion;

    res.status(200).json({
      success: true,
      sessionId: session.sessionId,
      question: firstQuestion,
      currentQuestionIndex: 1,
      totalQuestions: session.totalQuestions,
      mode: session.mode,
      difficulty: session.currentDifficulty,
      startedAt: session.startedAt,
    });
  } catch (error) {
    console.error("START INTERVIEW ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to initialize interview session." });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { sessionId, answer } = req.body || {};

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required." });
    }

    if (!answer || !answer.trim()) {
      return res.status(400).json({ error: "Answer cannot be empty." });
    }

    const session = interviewStore.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found or expired. Please start a new session." });
    }

    if (session.status === "completed") {
      return res.status(400).json({ error: "This interview session is already completed." });
    }

    // Evaluate answer and generate next question or completion
    const { evaluation, adaptiveDifficulty, nextQuestion, isComplete } = await evaluateAnswerAndNext(
      session,
      answer.trim()
    );

    // Save to history
    const turnRecord = {
      questionIndex: session.currentQuestionIndex,
      question: session.currentQuestion?.text || "",
      topic: session.currentQuestion?.topic || "",
      difficulty: session.currentDifficulty,
      answer: answer.trim(),
      evaluation,
      timestamp: new Date().toISOString(),
    };

    session.history.push(turnRecord);
    session.currentDifficulty = adaptiveDifficulty;

    if (isComplete) {
      // Finalize session & generate report
      session.status = "completed";
      session.endedAt = new Date().toISOString();
      const report = await generateFinalReport(session);
      session.report = report;

      return res.status(200).json({
        success: true,
        isComplete: true,
        report,
        evaluation,
        transcript: session.history,
      });
    }

    // Advance to next question
    session.currentQuestionIndex += 1;
    session.currentQuestion = nextQuestion;

    res.status(200).json({
      success: true,
      isComplete: false,
      evaluation,
      nextQuestion,
      currentQuestionIndex: session.currentQuestionIndex,
      totalQuestions: session.totalQuestions,
      difficulty: session.currentDifficulty,
    });
  } catch (error) {
    console.error("SUBMIT ANSWER ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to process interview answer." });
  }
};

export const getSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = interviewStore.getSession(id);

    if (!session) {
      return res.status(404).json({ error: "Session not found or expired." });
    }

    res.status(200).json({
      sessionId: session.sessionId,
      mode: session.mode,
      difficulty: session.currentDifficulty,
      totalQuestions: session.totalQuestions,
      currentQuestionIndex: session.currentQuestionIndex,
      status: session.status,
      currentQuestion: session.currentQuestion,
      transcript: session.history,
      report: session.report,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to retrieve session." });
  }
};

export const endInterview = async (req, res) => {
  try {
    const { sessionId } = req.body || {};
    const session = interviewStore.getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    session.status = "completed";
    session.endedAt = new Date().toISOString();

    const report = await generateFinalReport(session);
    session.report = report;

    res.status(200).json({
      success: true,
      report,
      transcript: session.history,
    });
  } catch (error) {
    console.error("END INTERVIEW ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to end interview." });
  }
};

export const getHint = async (req, res) => {
  try {
    const { sessionId } = req.body || {};
    const session = interviewStore.getSession(sessionId);

    if (!session || !session.currentQuestion) {
      return res.status(404).json({ error: "No active question found." });
    }

    const hint = await getInterviewerHint(session);
    res.status(200).json({ hint });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to generate hint." });
  }
};
