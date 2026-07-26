import { useEffect, useMemo, useRef, useState } from "react";
import { useAnalysis } from "../hooks/useAnalysis";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import SuggestedQuestions from "../components/SuggestedQuestions";
import TypingIndicator from "../components/TypingIndicator";

const INITIAL_SUGGESTIONS = [
  "Improve my ATS",
  "Explain my recruiter review",
  "Am I ready for FAANG?",
  "How can I improve my projects?",
  "Interview me",
  "Suggest certifications",
  "Rewrite my summary",
];

const STORAGE_KEY = "resumeos-career-copilot-session";

function CareerCopilot() {
  const { result, resume, jobDesc } = useAnalysis();
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [sessionContext, setSessionContext] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const endRef = useRef(null);

  const analysis = result?.analysis;

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
      console.error("Unable to restore copilot session", error);
    }
  }, []);

  useEffect(() => {
    if (!analysis) {
      setIsReady(false);
      return;
    }

    const contextSnapshot = {
      parsedResume: analysis.parsedResume || {},
      ats: analysis.atsExplanation || "",
      recruiter: analysis.recruiterReview || {},
      health: analysis.summary || "",
      rewrite: analysis.rewriteStudio || {},
      strengths: analysis.strengths || [],
      weaknesses: analysis.improvements || [],
      missingSkills: analysis.missingSkills || [],
      sectionScores: analysis.sectionScores || {},
      matchScore: analysis.matchScore,
      jobDescription: jobDesc || analysis.jobDescription || "",
      roadmap: analysis.roadmap || null,
      interviewPrep: analysis.interviewPrep || null,
    };

    setSessionContext(contextSnapshot);
    setIsReady(true);

    if (messages.length === 0) {
      const atsScore = Math.round((analysis.matchScore || 0) * 100);
      const healthScore = Math.min(
        100,
        Math.round(
          ((analysis.parsedResume?.github ? 1 : 0) +
            (analysis.parsedResume?.linkedin ? 1 : 0) +
            (analysis.parsedResume?.portfolio ? 1 : 0) +
            ((analysis.parsedResume?.hardSkills?.length || 0) > 0 ? 1 : 0) +
            ((analysis.parsedResume?.softSkills?.length || 0) > 0 ? 1 : 0) +
            ((analysis.parsedResume?.certifications?.length || 0) > 0 ? 1 : 0) +
            ((analysis.parsedResume?.achievements?.length || 0) > 0 ? 1 : 0)) * 14.28
        )
      );

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          text: `Hello ${resume?.name ? resume.name.split(" ")[0] : "there"} 👋\n\nI've analyzed your resume and I can help you reason about your ATS performance, recruiter review, resume quality, and next steps.\n\nCurrent ATS: ${atsScore}%\nRecruiter Verdict: ${analysis.recruiterReview?.decision || "Consider"}\nResume Health: ${healthScore}%\nJob Match: ${atsScore}%\n\nAsk me anything about your career.`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [analysis, resume?.name]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, suggestions, context: sessionContext }));
    } catch (error) {
      console.error("Unable to persist copilot session", error);
    }
  }, [messages, suggestions, sessionContext]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async (userInput) => {
    if (!isReady) return;

    const newMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: userInput,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userInput,
          context: sessionContext,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Copilot request failed");
      }

      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: data.reply || "I’m unable to answer that from your current analysis context.",
        timestamp: Date.now(),
      };

      const nextSuggestions = [
        "Improve Projects",
        "Prepare Interview",
        "Show Recruiter Feedback",
      ];

      setMessages((prev) => [...prev, assistantMessage]);
      setSuggestions(nextSuggestions);
      setSessionContext((prev) => prev ? { ...prev, lastReply: data.reply } : prev);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: `I hit a snag while preparing your answer. ${error.message || "Please try again."}`,
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
    setMessages([]);
    setTyping(false);
  };

  if (!isReady) {
    return (
      <div className="copilot-empty-state">
        <div className="copilot-empty-icon">🤖</div>
        <h2>No resume found.</h2>
        <p>Upload and analyze a resume first.</p>
      </div>
    );
  }

  return (
    <div className="copilot-shell">
      <div className="copilot-header-card">
        <div>
          <p className="copilot-eyebrow">AI ASSISTANT</p>
          <h2>Career Copilot</h2>
          <p>Your resume, recruiter insights, and roadmap are already loaded into the conversation.</p>
        </div>
        <button type="button" className="copilot-clear-btn" onClick={handleClear}>
          Clear Conversation
        </button>
      </div>

      <div className="copilot-chat-card">
        <div className="copilot-surface">
          {messages.length === 0 ? (
            <div className="copilot-empty-chat">
              <h3>Hello there 👋</h3>
              <p>Ask me anything about your career and I’ll answer from your current analysis context.</p>
              <SuggestedQuestions suggestions={INITIAL_SUGGESTIONS} onSelect={handleSend} />
            </div>
          ) : (
            <div className="copilot-messages">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} onCopy={handleCopy} onRegenerate={handleRegenerate} />
              ))}
              {typing && <TypingIndicator />}
              <div ref={endRef} />
            </div>
          )}
        </div>

        <div className="copilot-footer">
          <SuggestedQuestions suggestions={suggestions} onSelect={handleSend} />
          <ChatInput onSend={handleSend} disabled={typing} placeholder="Ask about ATS, recruiter feedback, projects, interview prep, or next steps..." />
        </div>
      </div>
    </div>
  );
}

export default CareerCopilot;
