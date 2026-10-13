import { useEffect, useMemo, useRef, useState } from "react";
import { useAnalysis } from "../hooks/useAnalysis";
import { useSpeech } from "../hooks/useSpeech";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import SuggestedQuestions from "../components/SuggestedQuestions";
import TypingIndicator from "../components/TypingIndicator";

const DEFAULT_SUGGESTIONS = [
  "What are my strongest technical skills?",
  "Tell me about my key projects",
  "Am I suitable for senior engineering roles?",
  "What skills am I missing for this role?",
  "How can I improve my ATS match score?",
  "What certifications would benefit me most?",
];

const STORAGE_KEY = "resumeos-career-copilot-session-v2";

function CareerCopilot() {
  const { result, resume, jobDesc } = useAnalysis();
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [sessionContext, setSessionContext] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const [errorBanner, setErrorBanner] = useState(null);
  const endRef = useRef(null);

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

  const analysis = result?.analysis;

  // Restore saved session from sessionStorage
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.messages?.length) {
          setMessages(parsed.messages);
        }
        if (parsed.suggestions?.length) {
          setSuggestions(parsed.suggestions);
        }
        if (parsed.context) {
          setSessionContext(parsed.context);
        }
      }
    } catch (error) {
      console.warn("Unable to restore copilot session", error);
    }
  }, []);

  // Build candidate profile context snapshot
  useEffect(() => {
    if (!analysis) {
      setIsReady(false);
      return;
    }

    const candidateProfile = analysis.candidateProfile || {};
    const parsedResume = analysis.parsedResume || {};

    const contextSnapshot = {
      candidateProfile,
      parsedResume,
      atsExplanation: analysis.atsExplanation || "",
      recruiterReview: analysis.recruiterReview || {},
      summary: analysis.summary || "",
      strengths: analysis.strengths || [],
      missingSkills: analysis.missingSkills || [],
      improvements: analysis.improvements || [],
      sectionScores: analysis.sectionScores || {},
      matchScore: analysis.matchScore,
      jobDescription: jobDesc || analysis.jobDescription || "",
      roadmap: analysis.roadmap || null,
      interviewPrep: analysis.interviewPrep || null,
    };

    setSessionContext(contextSnapshot);
    setIsReady(true);

    if (messages.length === 0) {
      const candidateName =
        candidateProfile.identity?.fullName ||
        (resume?.name ? resume.name.replace(/\.pdf$/i, "").split(/[\s_-]+/)[0] : "there");

      const atsScore = Math.round((analysis.matchScore || 0) * 100);
      const recruiterDecision = analysis.recruiterReview?.decision || "Consider";
      const topStrengthsCount = (candidateProfile.skills?.languages?.length || 0) + (candidateProfile.skills?.frameworks?.length || 0) || parsedResume.hardSkills?.length || 0;

      setMessages([
        {
          id: "welcome-message",
          role: "assistant",
          text: `Hello **${candidateName}** 👋\n\nI have loaded and analyzed your full resume profile.\n\n- **ATS Match:** ${atsScore}%\n- **Recruiter Verdict:** ${recruiterDecision}\n- **Verified Skills:** ${topStrengthsCount} tech skills identified\n\nAsk me anything about your projects, skills, interview readiness, or resume enhancements.`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [analysis, resume?.name]);

  // Persist session
  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, suggestions, context: sessionContext })
      );
    } catch (error) {
      console.warn("Unable to persist copilot session", error);
    }
  }, [messages, suggestions, sessionContext]);

  // Auto-scroll on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async (userInput) => {
    if (!isReady || !userInput || !userInput.trim()) return;

    setErrorBanner(null);

    const newMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: userInput.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setTyping(true);

    try {
      // Build conversation history (excluding welcome message, limited to last 8 turns)
      const history = updatedMessages
        .filter((m) => m.id !== "welcome-message")
        .slice(-8)
        .map((m) => ({
          role: m.role,
          content: m.text,
        }));

      const response = await fetch("http://localhost:5000/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userInput.trim(),
          context: sessionContext,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Copilot request failed");
      }

      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: data.reply || "I don't have enough information in your profile to answer that.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Provide dynamic contextual follow-up suggestions
      const nextSuggestions = [
        "How can I highlight this in my resume?",
        "What project would boost my profile?",
        "What interview questions should I expect?",
      ];
      setSuggestions(nextSuggestions);
    } catch (error) {
      console.error("Copilot communication error:", error);
      setErrorBanner(error.message || "Failed to reach Copilot AI");
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: "I hit an issue processing your request. Please try asking again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
  };

  const handleRegenerate = (message) => {
    if (message?.role !== "assistant") return;
    const lastUserMessage = [...messages].reverse().find((entry) => entry.role === "user");
    if (lastUserMessage) {
      handleSend(lastUserMessage.text);
    }
  };

  const handleClear = () => {
    stopSpeech();
    setMessages([]);
    setTyping(false);
    setErrorBanner(null);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleVoiceError = (errorMessage) => {
    setErrorBanner(errorMessage);
  };

  if (!isReady) {
    return (
      <div className="copilot-empty-state">
        <div className="copilot-empty-icon">🤖</div>
        <h2>No Resume Profile Loaded</h2>
        <p>Upload and analyze a resume first to chat with your personal AI Career Copilot.</p>
      </div>
    );
  }

  return (
    <div className="copilot-shell">
      {/* Header card */}
      <div className="copilot-header-card">
        <div>
          <p className="copilot-eyebrow">RESUME-AWARE AI</p>
          <h2>Career Copilot</h2>
          <p>Your complete candidate profile, verified skills, and ATS recruiter metrics are loaded.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button type="button" className="copilot-clear-btn" onClick={handleClear} title="Clear conversation history">
            Clear Chat
          </button>
        </div>
      </div>

      {/* Main chat window */}
      <div className="copilot-chat-card">
        <div className="copilot-surface">
          {messages.length === 0 ? (
            <div className="copilot-empty-chat">
              <h3>Hello there 👋</h3>
              <p>Ask me anything about your skills, projects, ATS score, or career recommendations.</p>
              <SuggestedQuestions suggestions={DEFAULT_SUGGESTIONS} onSelect={handleSend} />
            </div>
          ) : (
            <div className="copilot-messages">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onCopy={handleCopy}
                  onRegenerate={handleRegenerate}
                  onSpeak={speak}
                  onStopSpeech={stopSpeech}
                  isSpeaking={isSpeaking(message.id)}
                  isPaused={isPaused(message.id)}
                />
              ))}

              {typing && <TypingIndicator />}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {errorBanner && (
          <div className="copilot-error-banner" role="alert">
            <span>⚠️ {errorBanner}</span>
            <button type="button" onClick={() => setErrorBanner(null)}>✕</button>
          </div>
        )}

        <div className="copilot-footer">
          <SuggestedQuestions suggestions={suggestions} onSelect={handleSend} />
          <ChatInput
            onSend={handleSend}
            disabled={typing}
            placeholder="Ask about your skills, projects, recruiter notes, or interview prep..."
            isRecording={isRecording}
            onStartVoice={(onTranscript) => startRecording(onTranscript, handleVoiceError)}
            onStopVoice={stopRecording}
            isVoiceSupported={isRecognitionSupported}
          />
        </div>
      </div>
    </div>
  );
}

export default CareerCopilot;
