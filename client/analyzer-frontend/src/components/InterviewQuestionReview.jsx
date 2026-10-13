import { useState } from "react";
import { motion } from "framer-motion";

/**
 * Normalizes question turn evaluation into complete structured evaluation fields
 */
function normalizeEvaluation(turn, index) {
  const evalData = turn.evaluation || {};
  const rawScore = Number(turn.score || evalData.overall) || 7.5;
  const score = Math.min(10, Math.max(0, rawScore));
  const accuracyPct = Math.min(
    100,
    Math.max(
      0,
      Number(evalData.accuracyPercentage || turn.accuracyPercentage) || Math.round(score * 10)
    )
  );

  const topic = turn.topic || "Core Technical Architecture";
  const difficulty = turn.difficulty || "Hard";

  // Derive strong points if not present
  const strongPoints =
    evalData.strongPoints?.length
      ? evalData.strongPoints
      : evalData.strengths?.length
      ? evalData.strengths
      : [
          "Demonstrated solid conceptual familiarity with the subject matter.",
          "Clear explanation of the primary architecture and logic flow.",
          "Addressed the core requirements of the interviewer prompt."
        ];

  // Derive areas to improve if not present
  const areasToImprove =
    evalData.areasToImprove?.length
      ? evalData.areasToImprove
      : evalData.weaknesses?.length
      ? evalData.weaknesses
      : [
          "Explain underlying database constraints and failure modes more explicitly.",
          "Detail edge cases such as high-concurrency race conditions.",
          "Include concrete production latency, scale, or throughput metrics."
        ];

  // Derive expected answer points if not present
  const expectedAnswer =
    evalData.expectedAnswer?.length
      ? evalData.expectedAnswer
      : [
          `Define the core architecture and design requirements for ${topic}.`,
          "Detail step-by-step logic flow and error handling boundaries.",
          "Address concurrency, idempotency, or transaction consistency.",
          "Highlight measurable performance, caching, and scalability trade-offs."
        ];

  // Derive verdict if not present
  const interviewerVerdict =
    evalData.interviewerVerdict ||
    turn.interviewerVerdict ||
    (score >= 8.0
      ? `Strong answer. You demonstrated a solid grasp of ${topic}. Elevating concrete concurrency guarantees will make this exceptional.`
      : score >= 6.5
      ? `Good foundational response. The core logic was correct, but deeper exploration of edge-cases and scaling trade-offs is recommended.`
      : `Needs practice. Focus on structuring answers with concrete implementation specifics and failure handling patterns.`);

  // Derive how to make stronger if not present
  const howToMakeStronger =
    evalData.howToMakeStronger?.length
      ? evalData.howToMakeStronger
      : [
          "Unique database constraints",
          "Atomic transactions",
          "Race-condition handling",
          "Failure / retry behavior"
        ];

  // Derive accuracy summary if not present
  const accuracySummary =
    evalData.accuracySummary ||
    turn.accuracySummary ||
    (score >= 8.0
      ? `Your answer was technically strong and correctly identified the core mechanisms for ${topic}.`
      : `Your answer provided a solid overview with opportunities to deepen production-level edge-case coverage.`);

  const questionNum = turn.questionNum || turn.questionIndex || index + 1;
  const formattedNum = questionNum < 10 ? `0${questionNum}` : `${questionNum}`;

  return {
    formattedNum,
    topic,
    difficulty,
    score: score.toFixed(1),
    accuracyPct,
    accuracySummary,
    question: turn.question,
    answer: turn.answer,
    strongPoints,
    areasToImprove,
    expectedAnswer,
    interviewerVerdict,
    howToMakeStronger,
  };
}

export function InterviewQuestionCard({ turn, index }) {
  const item = normalizeEvaluation(turn, index);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `[QUESTION ${item.formattedNum} - ${item.topic}]\nScore: ${item.score}/10\nQuestion: ${item.question}\nAnswer: ${item.answer}\nVerdict: ${item.interviewerVerdict}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreBadgeClass = (scoreVal) => {
    const val = Number(scoreVal);
    if (val >= 8.0) return "score-high";
    if (val >= 6.5) return "score-mid";
    return "score-low";
  };

  return (
    <motion.div
      className="audit-eval-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      {/* 1. Header Row */}
      <div className="audit-card-header">
        <div className="audit-header-left">
          <span className="audit-q-num">QUESTION {item.formattedNum}</span>
          <h3 className="audit-topic-title">{item.topic}</h3>
        </div>

        <div className="audit-header-badges">
          <div className={`audit-score-pill ${getScoreBadgeClass(item.score)}`}>
            <span className="score-sub">Score</span>
            <strong>{item.score} / 10</strong>
          </div>
          <span className="audit-meta-pill">Difficulty: {item.difficulty}</span>
          <span className="audit-meta-pill">Topic: {item.topic}</span>
        </div>
      </div>

      {/* 2. Interview Question Box */}
      <div className="audit-section-block">
        <span className="audit-section-label">INTERVIEW QUESTION</span>
        <div className="audit-question-box">
          <p>"{item.question}"</p>
        </div>
      </div>

      {/* 3. Candidate's Actual Answer */}
      <div className="audit-section-block">
        <div className="audit-label-row">
          <span className="audit-section-label">YOUR ANSWER</span>
          <button type="button" className="audit-copy-btn" onClick={handleCopy}>
            {copied ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>
        <div className="audit-answer-box">
          <p>{item.answer || "[No response recorded]"}</p>
        </div>
      </div>

      {/* 4. Answer Accuracy & Progress Bar */}
      <div className="audit-section-block accuracy-block">
        <div className="accuracy-header">
          <span className="audit-section-label">ANSWER ACCURACY</span>
          <strong className="accuracy-val">{item.accuracyPct}%</strong>
        </div>

        <div className="accuracy-bar-track">
          <div className="accuracy-bar-fill" style={{ width: `${item.accuracyPct}%` }} />
        </div>

        <p className="accuracy-summary-text">{item.accuracySummary}</p>
      </div>

      {/* 5 & 6. Strong Points & Areas To Improve 2-Col Grid */}
      <div className="audit-two-col-grid">
        {/* Strong Points */}
        <div className="audit-feedback-panel strong">
          <div className="panel-title-row">
            <span className="panel-icon">✓</span>
            <span className="panel-title-text">STRONG POINTS</span>
          </div>
          <ul className="audit-bullet-list green">
            {item.strongPoints.map((pt, i) => (
              <li key={i}>
                <span className="bullet-mark">✓</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas To Improve */}
        <div className="audit-feedback-panel improve">
          <div className="panel-title-row">
            <span className="panel-icon">⚠</span>
            <span className="panel-title-text">AREAS TO IMPROVE</span>
          </div>
          <ul className="audit-bullet-list yellow">
            {item.areasToImprove.map((pt, i) => (
              <li key={i}>
                <span className="bullet-mark">⚠</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7. Expected Answer Checklist */}
      <div className="audit-section-block expected-block">
        <span className="audit-section-label">EXPECTED ANSWER</span>
        <p className="expected-subhead">A strong senior candidate should explain:</p>
        <ol className="expected-numbered-list">
          {item.expectedAnswer.map((step, i) => (
            <li key={i}>
              <span className="step-num">{i + 1}.</span>
              <span className="step-text">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 8. Interviewer Verdict Callout */}
      <div className="audit-section-block verdict-block">
        <span className="audit-section-label">INTERVIEWER VERDICT</span>
        <div className="audit-verdict-box">
          <p>{item.interviewerVerdict}</p>
        </div>
      </div>

      {/* 9. How To Make This Answer Stronger */}
      <div className="audit-section-block stronger-block">
        <span className="audit-section-label">HOW TO MAKE THIS ANSWER STRONGER</span>
        <p className="stronger-subhead">Key concepts &amp; patterns to mention:</p>
        <div className="stronger-chips-grid">
          {item.howToMakeStronger.map((chip, i) => (
            <div key={i} className="stronger-chip">
              <span className="chip-bullet">•</span>
              <span>{chip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 10. Final Score Footer Bar */}
      <div className="audit-card-footer">
        <span className="footer-score-lbl">FINAL EVALUATION SCORE</span>
        <div className="footer-score-group">
          <strong className="footer-score-num">{item.score} / 10</strong>
          <span className={`footer-score-badge ${getScoreBadgeClass(item.score)}`}>
            {Number(item.score) >= 8.0 ? "STRONG HIRE" : Number(item.score) >= 6.5 ? "HIRE LEVEL" : "NEEDS PRACTICE"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function InterviewQuestionReview({ history = [], breakdown = [] }) {
  // Prefer breakdown array, fallback to history
  const turns = breakdown.length ? breakdown : history;

  if (!turns.length) {
    return (
      <div className="audit-empty-state">
        <p>No questions answered to review.</p>
      </div>
    );
  }

  return (
    <div className="interview-audit-container">
      <div className="audit-container-header">
        <div>
          <span className="kinetic-eyebrow">DETAILED EVALUATION</span>
          <h3 className="audit-main-heading">Question-by-Question Technical Audit</h3>
          <p className="audit-main-desc">
            Review your technical answers, identified strengths, expected architecture points, and interviewer verdict for each question.
          </p>
        </div>
        <span className="audit-total-badge">{turns.length} Questions Evaluated</span>
      </div>

      <div className="audit-cards-stack">
        {turns.map((turn, idx) => (
          <InterviewQuestionCard key={idx} turn={turn} index={idx} />
        ))}
      </div>
    </div>
  );
}
