import { randomUUID } from "crypto";

/**
 * In-memory session store for active mock interviews.
 * Sessions expire automatically after 3 hours.
 */
class InterviewSessionStore {
  constructor() {
    this.sessions = new Map();
    // Clean expired sessions every 30 minutes
    setInterval(() => this.cleanup(), 30 * 60 * 1000);
  }

  createSession({
    candidateContext,
    mode = "technical",
    difficulty = "adaptive",
    totalQuestions = 5,
    targetRole = "",
  }) {
    const sessionId = randomUUID();
    const session = {
      sessionId,
      mode,
      difficulty,
      currentDifficulty: difficulty === "adaptive" ? "medium" : difficulty,
      totalQuestions: Number(totalQuestions) || 5,
      currentQuestionIndex: 1,
      status: "active", // "active" | "completed" | "abandoned"
      candidateContext: candidateContext || {},
      targetRole: targetRole || candidateContext?.candidateProfile?.identity?.professionalTitle || "Software Engineer",
      history: [], // [{ questionIndex, question, topic, difficulty, answer, evaluation, timestamp }]
      currentQuestion: null,
      report: null,
      startedAt: new Date().toISOString(),
      endedAt: null,
      lastActivityAt: Date.now(),
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivityAt = Date.now();
    }
    return session;
  }

  updateSession(sessionId, updates) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    Object.assign(session, updates, { lastActivityAt: Date.now() });
    return session;
  }

  deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }

  cleanup() {
    const maxAge = 3 * 60 * 60 * 1000; // 3 hours
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.lastActivityAt > maxAge) {
        this.sessions.delete(id);
      }
    }
  }
}

export const interviewStore = new InterviewSessionStore();
