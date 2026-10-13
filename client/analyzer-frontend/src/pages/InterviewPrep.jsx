import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";
import { useSpeech } from "../hooks/useSpeech";
import InterviewerRobot from "../components/InterviewerRobot";
import InterviewQuestionReview from "../components/InterviewQuestionReview";

const INTERVIEW_MODES = [
  {
    id: "technical",
    title: "Technical Interview",
    icon: "💻",
    desc: "Core stack, API architecture, data structures, databases, and system performance.",
  },
  {
    id: "project",
    title: "Project Deep-Dive",
    icon: "🚀",
    desc: "Progressive architectural questions based directly on your verified resume projects.",
  },
  {
    id: "resume",
    title: "Resume & Claims Audit",
    icon: "📄",
    desc: "Targeted drill-down into your metrics, achievements, responsibilities, and claims.",
  },
  {
    id: "behavioral",
    title: "HR & Behavioral",
    icon: "🤝",
    desc: "STAR-method behavioral questions personalized with your real career experiences.",
  },
  {
    id: "mixed",
    title: "Mixed Simulation",
    icon: "🔀",
    desc: "A balanced real-world blend of technical, project architecture, and behavioral questions.",
  },
  {
    id: "job_specific",
    title: "Job-Specific Interview",
    icon: "🎯",
    desc: "Tailored to the active target job description and specific role competencies.",
  },
];

const DIFFICULTIES = [
  { id: "easy", label: "Easy", icon: "🟢", desc: "Foundations & straightforward explanations" },
  { id: "medium", label: "Medium", icon: "🟡", desc: "Industry standard mid-level rigor" },
  { id: "hard", label: "Hard", icon: "🔴", desc: "Senior depth, edge-cases & scaling" },
  { id: "adaptive", label: "Adaptive", icon: "⚡", desc: "Dynamically scales based on your answers" },
];

const LENGTH_OPTIONS = [
  { count: 5, label: "Quick", time: "~10 mins" },
  { count: 10, label: "Standard", time: "~20 mins" },
  { count: 15, label: "Deep Dive", time: "~30 mins" },
];

function InterviewPrep() {
  const { result, setResult, resume, jobDesc } = useAnalysis();
  const analysis = result?.analysis;

  // Stages: "setup" | "interview" | "report"
  const [stage, setStage] = useState("setup");
  const [selectedMode, setSelectedMode] = useState("technical");
  const [selectedDifficulty, setSelectedDifficulty] = useState("adaptive");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [targetRole, setTargetRole] = useState("");

  // Centralized Robot & Interviewer State:
  // "idle" | "speaking" | "listening" | "thinking" | "processing" | "completed"
  const [interviewerState, setInterviewerState] = useState("idle");

  // Live session state
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [currentDifficulty, setCurrentDifficulty] = useState("medium");
  const [userAnswer, setUserAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const answerInputRef = useRef(null);

  // Voice capabilities
  const {
    speak,
    stopSpeech,
    isSpeaking,
    isPaused,
    isRecording,
    startRecording,
    stopRecording,
    isRecognitionSupported,
  } = useSpeech();

  // Initialize candidate target role from profile if available
  useEffect(() => {
    if (analysis) {
      const candidate = analysis.candidateProfile || analysis.parsedResume;
      const initialTitle =
        candidate?.identity?.professionalTitle ||
        analysis.recruiterReview?.bestRoles?.[0]?.role ||
        "Software Engineer";
      setTargetRole(initialTitle);
    }
  }, [analysis]);

  // Elapsed timer during interview
  useEffect(() => {
    let timer = null;
    if (stage === "interview") {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [stage]);

  // Cleanup all speech and recording on unmount or stage change
  useEffect(() => {
    return () => {
      stopSpeech();
      stopRecording();
    };
  }, [stopSpeech, stopRecording]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Speak question helper with automatic listening transition
  const speakQuestion = useCallback(
    (questionText) => {
      if (!questionText) return;
      setInterviewerState("speaking");
      speak("interviewer-q", questionText, () => {
        setInterviewerState("listening");
      });
    },
    [speak]
  );

  // Start mock interview
  const handleStartInterview = async () => {
    if (!analysis) return;
    setLoading(true);
    setErrorMsg(null);
    stopSpeech();

    const candidateContext = {
      candidateProfile: analysis.candidateProfile || {},
      parsedResume: analysis.parsedResume || {},
      atsExplanation: analysis.atsExplanation || "",
      recruiterReview: analysis.recruiterReview || {},
      strengths: analysis.strengths || [],
      missingSkills: analysis.missingSkills || [],
      jobDescription: jobDesc || analysis.jobDescription || "",
    };

    try {
      const response = await fetch("http://localhost:5000/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateContext,
          mode: selectedMode,
          difficulty: selectedDifficulty,
          totalQuestions,
          targetRole: targetRole || "Software Engineer",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to start interview session.");
      }

      setSessionId(data.sessionId);
      setCurrentQuestion(data.question);
      setCurrentQuestionIndex(data.currentQuestionIndex || 1);
      setCurrentDifficulty(data.difficulty || selectedDifficulty);
      setHistory([]);
      setUserAnswer("");
      setHint(null);
      setStage("interview");

      // Auto speak first question
      if (data.question?.text) {
        speakQuestion(data.question.text);
      }
    } catch (err) {
      console.error("Start interview error:", err);
      setErrorMsg(err.message || "Failed to initialize interview.");
      setInterviewerState("idle");
    } finally {
      setLoading(false);
    }
  };

  // Submit candidate answer
  const handleSubmitAnswer = async (e) => {
    e?.preventDefault();
    if (!userAnswer.trim() || loading || interviewerState === "speaking") return;

    if (isRecording) {
      stopRecording();
    }
    stopSpeech();

    setLoading(true);
    setInterviewerState("processing");
    setErrorMsg(null);
    setHint(null);

    try {
      // Transition to thinking briefly
      setTimeout(() => {
        setInterviewerState("thinking");
      }, 400);

      const response = await fetch("http://localhost:5000/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          answer: userAnswer.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to evaluate answer.");
      }

      // Update history
      const answeredTurn = {
        questionIndex: currentQuestionIndex,
        question: currentQuestion.text,
        topic: currentQuestion.topic,
        difficulty: currentDifficulty,
        answer: userAnswer.trim(),
        evaluation: data.evaluation,
      };

      setHistory((prev) => [...prev, answeredTurn]);
      setUserAnswer("");

      if (data.isComplete) {
        setInterviewerState("completed");
        setFinalReport(data.report);

        // Store interview report in analysis context & localStorage for Career Copilot
        if (result && data.report) {
          try {
            const updated = {
              ...result,
              analysis: {
                ...result.analysis,
                interviewReport: data.report,
              },
            };
            setResult(updated);
            localStorage.setItem("resume_buddy_last_interview", JSON.stringify(data.report));
          } catch (e) {
            console.warn("Could not cache interview report:", e);
          }
        }

        // Completion speech
        speak(
          "interview-complete",
          "That concludes our technical interview today. I am compiling your comprehensive performance evaluation report now.",
          () => {
            setStage("report");
          }
        );
        setTimeout(() => setStage("report"), 2500);
      } else {
        setCurrentQuestion(data.nextQuestion);
        setCurrentQuestionIndex(data.currentQuestionIndex);
        setCurrentDifficulty(data.difficulty || currentDifficulty);

        // Auto speak next question
        if (data.nextQuestion?.text) {
          speakQuestion(data.nextQuestion.text);
        }
      }
    } catch (err) {
      console.error("Submit answer error:", err);
      setErrorMsg(err.message || "Failed to submit answer. Please try again.");
      setInterviewerState("listening");
    } finally {
      setLoading(false);
    }
  };

  // Replay current question voice
  const handleReplayQuestion = () => {
    if (!currentQuestion?.text) return;
    if (interviewerState === "speaking") {
      stopSpeech();
      setInterviewerState("listening");
    } else {
      speakQuestion(currentQuestion.text);
    }
  };

  // Skip current question
  const handleSkipQuestion = async () => {
    if (loading || interviewerState === "speaking") return;
    if (!sessionId) return;

    stopSpeech();
    if (isRecording) stopRecording();

    setLoading(true);
    setInterviewerState("thinking");

    try {
      const response = await fetch("http://localhost:5000/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          answer: "[Candidate requested to skip this question]",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to skip question.");
      }

      setHistory((prev) => [
        ...prev,
        {
          questionIndex: currentQuestionIndex,
          question: currentQuestion.text,
          topic: currentQuestion.topic,
          difficulty: currentDifficulty,
          answer: "[Skipped]",
          evaluation: { overall: 5, feedback: "Question skipped by candidate." },
        },
      ]);
      setUserAnswer("");

      if (data.isComplete) {
        setFinalReport(data.report);
        setStage("report");
      } else {
        setCurrentQuestion(data.nextQuestion);
        setCurrentQuestionIndex(data.currentQuestionIndex);
        setCurrentDifficulty(data.difficulty || currentDifficulty);

        // Speak natural skip acknowledgment + next question
        speak(
          "interviewer-skip",
          `Understood. Let's move to another topic. ${data.nextQuestion.text}`,
          () => {
            setInterviewerState("listening");
          }
        );
        setInterviewerState("speaking");
      }
    } catch (err) {
      console.warn("Skip error:", err);
      setInterviewerState("listening");
    } finally {
      setLoading(false);
    }
  };

  // Request interviewer hint
  const handleRequestHint = async () => {
    if (hintLoading || hint) return;
    setHintLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/interview/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await response.json();
      if (response.ok && data.hint) {
        setHint(data.hint);
        // Speak the hint
        speak("hint-speech", `Here is a hint: ${data.hint}`);
      }
    } catch (err) {
      console.warn("Hint error:", err);
    } finally {
      setHintLoading(false);
    }
  };

  // Prematurely finish interview
  const handleConfirmEndEarly = async () => {
    setShowEndModal(false);
    setLoading(true);
    stopSpeech();
    if (isRecording) stopRecording();

    if (!sessionId || history.length === 0) {
      setStage("setup");
      setInterviewerState("idle");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/interview/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await response.json();
      if (response.ok && data.report) {
        setFinalReport(data.report);
        setStage("report");
      } else {
        setStage("setup");
      }
    } catch (err) {
      console.error("End interview error:", err);
      setStage("setup");
    } finally {
      setLoading(false);
      setInterviewerState("idle");
    }
  };

  const handleCopyTranscript = () => {
    if (!history.length) return;
    const transcriptText = history
      .map(
        (h) =>
          `[Question ${h.questionIndex} - ${h.topic}]\nInterviewer: ${h.question}\nCandidate: ${h.answer}\nScore: ${h.evaluation?.overall}/10\nFeedback: ${h.evaluation?.idealImprovement || ""}\n`
      )
      .join("\n----------------------------------------\n\n");

    navigator.clipboard.writeText(transcriptText);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  // If no resume uploaded
  if (!analysis) {
    return (
      <div className="copilot-empty-state">
        <div className="copilot-empty-icon">🎙️</div>
        <h2>No Resume Profile Loaded</h2>
        <p>Upload and analyze a resume first to launch the AI Mock Interview system.</p>
      </div>
    );
  }

  const candidateProfile = analysis.candidateProfile || analysis.parsedResume || {};
  const candidateName =
    candidateProfile.identity?.fullName ||
    (resume?.name ? resume.name.replace(/\.pdf$/i, "").split(/[\s_-]+/)[0] : "Candidate");

  // ==========================================
  // VIEW 1: SETUP WIZARD
  // ==========================================
  if (stage === "setup") {
    return (
      <motion.div
        className="interview-wizard-wrapper"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header card */}
        <div className="interview-hero-card">
          <div className="interview-hero-badge">AI MOCK INTERVIEW ARENA</div>
          <h2>Ready for your interview, {candidateName}?</h2>
          <p>
            The AI interviewer has studied your resume, verified projects, and ATS recruiter metrics.
            Select your interview mode, challenge level, and question length to begin.
          </p>

          <div className="interview-candidate-pill-bar">
            <span className="interview-pill">👤 {candidateName}</span>
            <span className="interview-pill">💼 {targetRole || "Software Engineer"}</span>
            <span className="interview-pill">
              ⭐ {candidateProfile.skills?.languages?.slice(0, 3).join(", ") || "Full Stack"}
            </span>
            <span className="interview-pill">
              🚀 {candidateProfile.projects?.[0]?.name || "Verified Projects"}
            </span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="interview-section-card">
          <div className="interview-section-title">
            <span className="section-step">1</span>
            <div>
              <h3>Choose Interview Mode</h3>
              <p>Select what type of assessment you want to simulate.</p>
            </div>
          </div>

          <div className="interview-grid modes">
            {INTERVIEW_MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;
              const isJdMode = mode.id === "job_specific";
              const isJdAvailable = Boolean(jobDesc || analysis.jobDescription);

              return (
                <button
                  key={mode.id}
                  type="button"
                  className={`interview-card-tile ${isSelected ? "active" : ""}`}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  <div className="tile-top-row">
                    <span className="tile-icon">{mode.icon}</span>
                    {isJdMode && (
                      <span className={`tile-tag ${isJdAvailable ? "available" : ""}`}>
                        {isJdAvailable ? "JD Loaded" : "Optional"}
                      </span>
                    )}
                  </div>
                  <h4 className="tile-title">{mode.title}</h4>
                  <p className="tile-desc">{mode.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty & Length Row */}
        <div className="interview-two-col-grid">
          {/* Difficulty Selector */}
          <div className="interview-section-card">
            <div className="interview-section-title">
              <span className="section-step">2</span>
              <div>
                <h3>Select Difficulty</h3>
                <p>Adaptive mode adjusts live based on your answer quality.</p>
              </div>
            </div>

            <div className="interview-grid difficulties">
              {DIFFICULTIES.map((diff) => {
                const isSelected = selectedDifficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    className={`interview-card-tile compact ${isSelected ? "active" : ""}`}
                    onClick={() => setSelectedDifficulty(diff.id)}
                  >
                    <div className="tile-inline-header">
                      <span className="tile-icon mini">{diff.icon}</span>
                      <h4 className="tile-title">{diff.label}</h4>
                    </div>
                    <p className="tile-desc">{diff.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions Count & Target Role */}
          <div className="interview-section-card">
            <div className="interview-section-title">
              <span className="section-step">3</span>
              <div>
                <h3>Interview Length &amp; Target Role</h3>
                <p>Customize the question volume and specific target job title.</p>
              </div>
            </div>

            <div className="length-selection-row">
              {LENGTH_OPTIONS.map((opt) => (
                <button
                  key={opt.count}
                  type="button"
                  className={`length-btn ${totalQuestions === opt.count ? "active" : ""}`}
                  onClick={() => setTotalQuestions(opt.count)}
                >
                  <span className="length-count">{opt.count} Questions</span>
                  <span className="length-time">{opt.time} ({opt.label})</span>
                </button>
              ))}
            </div>

            <div className="target-role-input-wrap">
              <label htmlFor="target-role-input">Target Job Title / Specialization:</label>
              <input
                id="target-role-input"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer, Full Stack Lead..."
                className="target-role-input"
              />
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="copilot-error-banner" role="alert">
            <span>⚠️ {errorMsg}</span>
            <button type="button" onClick={() => setErrorMsg(null)}>✕</button>
          </div>
        )}

        {/* Start Action */}
        <div className="interview-start-bar">
          <button
            type="button"
            className="interview-start-btn"
            onClick={handleStartInterview}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner mini" /> Initializing AI Interviewer...
              </>
            ) : (
              <>Launch AI Mock Interview →</>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE VISUAL AI INTERVIEWER ARENA
  // ==========================================
  if (stage === "interview" && currentQuestion) {
    const progressPercent = Math.round((currentQuestionIndex / totalQuestions) * 100);
    const isSpeakingQuestion = interviewerState === "speaking";
    const isCandidateTurn = interviewerState === "listening";

    return (
      <motion.div
        className="interview-arena-wrapper visual-robot-edition"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        {/* Top Control Bar */}
        <div className="interview-arena-header">
          <div className="arena-header-left">
            <span className="arena-badge mode-badge">
              {INTERVIEW_MODES.find((m) => m.id === selectedMode)?.icon}{" "}
              {INTERVIEW_MODES.find((m) => m.id === selectedMode)?.title}
            </span>
            <span className="arena-badge diff-badge">
              ⚡ {currentDifficulty.toUpperCase()} LEVEL
            </span>
            <span className="arena-timer">⏱️ {formatTimer(elapsedSeconds)}</span>
          </div>

          <div className="arena-header-right">
            <button
              type="button"
              className="arena-secondary-btn"
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              title="View interview transcript so far"
            >
              📜 Transcript ({history.length})
            </button>
            <button
              type="button"
              className="arena-end-btn"
              onClick={() => setShowEndModal(true)}
              title="Conclude interview early"
            >
              End Interview
            </button>
          </div>
        </div>

        {/* Visual AI Interviewer Robot Hero Card */}
        <InterviewerRobot
          state={interviewerState}
          candidateName={candidateName}
          topic={currentQuestion.topic || "System Design"}
        />

        {/* Progress bar */}
        <div className="arena-progress-container">
          <div className="arena-progress-labels">
            <span>
              Question <strong>{currentQuestionIndex}</strong> of {totalQuestions}
            </span>
            <span>
              Topic: <strong>{currentQuestion.topic || "Core Architecture"}</strong> • {progressPercent}% Progress
            </span>
          </div>
          <div className="arena-progress-track">
            <div className="arena-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Prominent Question Box */}
        <div className={`interviewer-question-card ${isSpeakingQuestion ? "speaking-highlight" : ""}`}>
          <div className="question-header">
            <div className="question-meta-wrap">
              <span className="question-topic-pill">QUESTION {currentQuestionIndex} // {totalQuestions}</span>
              <span className="interviewer-label">
                {isSpeakingQuestion ? "🔊 AI Interviewer Speaking Question..." : "● Question Delivered"}
              </span>
            </div>
          </div>

          <h3 className="question-text">{currentQuestion.text}</h3>

          {/* Audio Controls & Hint Bar */}
          <div className="question-voice-bar">
            <button
              type="button"
              className={`voice-listen-btn ${isSpeakingQuestion ? "active" : ""}`}
              onClick={handleReplayQuestion}
              aria-label="Replay interview question"
            >
              {isSpeakingQuestion ? (
                <>⏹ Stop Speaking</>
              ) : (
                <>🔊 Replay Question</>
              )}
            </button>

            <button
              type="button"
              className="hint-btn"
              onClick={handleRequestHint}
              disabled={hintLoading || Boolean(hint) || isSpeakingQuestion}
            >
              {hintLoading ? "Thinking hint..." : hint ? "💡 Hint Provided" : "💡 Need a Hint?"}
            </button>
          </div>

          {/* Hint callout */}
          {hint && (
            <div className="interviewer-hint-box">
              <strong>Interviewer Hint:</strong> {hint}
            </div>
          )}
        </div>

        {/* Candidate Answer Box */}
        <form className="candidate-answer-card" onSubmit={handleSubmitAnswer}>
          <div className="answer-card-header">
            <div className="answer-header-meta">
              <span className="candidate-label">
                {isSpeakingQuestion
                  ? "🔒 Input locked while AI interviewer speaks..."
                  : `Your Technical Response (${candidateName}):`}
              </span>
              <span className="word-counter">
                {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          </div>

          <textarea
            ref={answerInputRef}
            className={`candidate-textarea ${isRecording ? "recording" : ""} ${isSpeakingQuestion ? "locked" : ""}`}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={
              isSpeakingQuestion
                ? "Interviewer is speaking the question. Please listen..."
                : isRecording
                ? "🎙️ Listening to your voice... Speak naturally now..."
                : "Type or speak your technical explanation here. Mention trade-offs, architecture, design choices, or concrete examples..."
            }
            rows={6}
            disabled={loading || isSpeakingQuestion}
          />

          {errorMsg && (
            <div className="copilot-error-banner" style={{ margin: "0.5rem 0" }} role="alert">
              <span>⚠️ {errorMsg}</span>
              <button type="button" onClick={() => setErrorMsg(null)}>✕</button>
            </div>
          )}

          <div className="answer-actions-bar">
            <div className="voice-input-group">
              {isRecognitionSupported && (
                <button
                  type="button"
                  className={`voice-mic-btn ${isRecording ? "recording" : ""}`}
                  onClick={() => {
                    if (isRecording) {
                      stopRecording();
                    } else {
                      startRecording(
                        (transcript) => {
                          setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
                        },
                        (err) => setErrorMsg(err)
                      );
                    }
                  }}
                  disabled={loading || isSpeakingQuestion}
                  title={isRecording ? "Stop microphone recording" : "Speak your answer"}
                  aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
                >
                  {isRecording ? "🔴 Stop Speaking" : "🎙️ Speak Answer"}
                </button>
              )}

              {userAnswer && (
                <button
                  type="button"
                  className="clear-text-btn"
                  onClick={() => setUserAnswer("")}
                  disabled={loading || isSpeakingQuestion}
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                className="skip-question-btn"
                onClick={handleSkipQuestion}
                disabled={loading || isSpeakingQuestion}
                title="Skip this question and move to next topic"
              >
                Skip Question ⏭
              </button>
            </div>

            <button
              type="submit"
              className="submit-answer-btn"
              disabled={loading || isSpeakingQuestion || !userAnswer.trim()}
            >
              {loading ? (
                <>
                  <span className="btn-spinner mini" /> AI Evaluating Answer...
                </>
              ) : currentQuestionIndex === totalQuestions ? (
                <>Submit Final Answer &amp; View Report 🏁</>
              ) : (
                <>Submit Answer →</>
              )}
            </button>
          </div>
        </form>

        {/* End Interview Confirmation Modal */}
        {showEndModal && (
          <div className="interview-modal-backdrop">
            <div className="interview-modal-box">
              <h3>Conclude Mock Interview?</h3>
              <p>
                Are you sure you want to conclude the session early? The AI will compile your score
                report based on the questions answered so far.
              </p>
              <div className="modal-actions-row">
                <button type="button" className="modal-btn secondary" onClick={() => setShowEndModal(false)}>
                  Continue Interview
                </button>
                <button type="button" className="modal-btn primary" onClick={handleConfirmEndEarly}>
                  End &amp; View Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slide-out Transcript Drawer */}
        <AnimatePresence>
          {showHistoryDrawer && (
            <motion.div
              className="arena-history-drawer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="drawer-header">
                <h4>Interview Transcript So Far ({history.length} Questions)</h4>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" className="copy-transcript-btn" onClick={handleCopyTranscript}>
                    {copiedTranscript ? "✓ Copied" : "📋 Copy All"}
                  </button>
                  <button type="button" onClick={() => setShowHistoryDrawer(false)}>✕</button>
                </div>
              </div>

              <div className="drawer-body">
                {history.length === 0 ? (
                  <p style={{ color: "var(--clr-text-3)", padding: "1rem", textAlign: "center" }}>
                    No answered questions yet. Your answers will appear here.
                  </p>
                ) : (
                  history.map((h, idx) => (
                    <div key={idx} className="drawer-turn-card">
                      <div className="turn-top-row">
                        <span className="turn-badge">Q{h.questionIndex} • {h.topic}</span>
                        <span className="turn-score">Score: {h.evaluation?.overall || 7}/10</span>
                      </div>
                      <p className="turn-q"><strong>AI:</strong> {h.question}</p>
                      <p className="turn-a"><strong>You:</strong> {h.answer}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ==========================================
  // VIEW 3: COMPREHENSIVE PERFORMANCE REPORT
  // ==========================================
  if (stage === "report" && finalReport) {
    const overall = finalReport.overallScore || 7.5;
    const isPassing = overall >= 7.0;

    return (
      <motion.div
        className="interview-report-wrapper"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Executive Verdict Hero Card */}
        <div className="report-hero-card">
          <div className="report-score-ring-wrap">
            <div className={`report-score-circle ${isPassing ? "pass" : "review"}`}>
              <span className="score-num">{overall.toFixed(1)}</span>
              <span className="score-max">/ 10</span>
            </div>
            <div className="verdict-label-wrap">
              <span className={`verdict-pill ${overall >= 8.5 ? "strong-hire" : overall >= 7.0 ? "hire" : "borderline"}`}>
                {overall >= 8.5 ? "STRONG HIRE" : overall >= 7.0 ? "HIRE VERDICT" : "NEEDS PRACTICE"}
              </span>
              <h3>Interview Performance Summary</h3>
              <p className="verdict-text">{finalReport.verdict}</p>
            </div>
          </div>

          <div className="report-meta-row">
            <span>🎯 <strong>Mode:</strong> {INTERVIEW_MODES.find((m) => m.id === selectedMode)?.title}</span>
            <span>⚡ <strong>Difficulty:</strong> {selectedDifficulty.toUpperCase()}</span>
            <span>📝 <strong>Questions:</strong> {history.length} Answered</span>
            <span>⏱️ <strong>Duration:</strong> {formatTimer(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Category Competency Gauges */}
        <div className="report-metrics-grid">
          {finalReport.categoryScores &&
            Object.entries(finalReport.categoryScores).map(([key, score]) => {
              const label =
                key === "technical"
                  ? "Technical Accuracy"
                  : key === "communication"
                  ? "Clarity & Structure"
                  : key === "problemSolving"
                  ? "Problem Solving"
                  : key === "depth"
                  ? "Architectural Depth"
                  : "Confidence & Evidence";

              const val = Number(score) || 7.0;
              const barWidth = Math.min(100, Math.round((val / 10) * 100));

              return (
                <div key={key} className="metric-score-card">
                  <div className="metric-header">
                    <span className="metric-label">{label}</span>
                    <span className="metric-val">{val.toFixed(1)}/10</span>
                  </div>
                  <div className="metric-track">
                    <div className="metric-fill" style={{ width: `${barWidth}%` }} />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Strengths & Weaknesses Grids */}
        <div className="report-feedback-grid">
          <div className="feedback-card strengths">
            <h4>✅ Key Observed Strengths</h4>
            <ul>
              {(finalReport.strengths || [
                "Accurate technical explanation of backend patterns.",
                "Demonstrated solid familiarity with core stack.",
              ]).map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="feedback-card weaknesses">
            <h4>⚠️ Identified Growth Areas</h4>
            <ul>
              {(finalReport.weaknesses || [
                "Elaborate more on distributed scaling and caching trade-offs.",
                "Quantify production performance improvements.",
              ]).map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Structured Question-by-Question Technical Audit */}
        <InterviewQuestionReview
          history={history}
          breakdown={finalReport.breakdown || []}
        />

        {/* Report Action Buttons */}
        <div className="report-actions-footer">
          <button type="button" className="report-action-btn primary" onClick={() => setStage("setup")}>
            🔄 Start New Mock Interview
          </button>
          <button type="button" className="report-action-btn secondary" onClick={handleCopyTranscript}>
            {copiedTranscript ? "✓ Transcript Copied" : "📋 Copy Full Transcript"}
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
}

export default InterviewPrep;
