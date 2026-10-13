import { memo } from "react";
import { Mic, Volume2, Loader2, CheckCircle2, User, Sparkles } from "lucide-react";

/**
 * InterviewerRobot
 * Clean, minimal audio & session status monitor for the AI mock interview.
 */
function InterviewerRobot({
  state = "idle", // "idle" | "speaking" | "listening" | "thinking" | "processing" | "completed"
  candidateName = "Candidate",
  topic = "System Architecture",
}) {
  const getStatusInfo = () => {
    switch (state) {
      case "speaking":
        return {
          icon: <Volume2 size={20} style={{ color: "var(--color-primary)" }} />,
          label: "Interviewer Speaking",
          desc: "Please listen carefully to the question prompt.",
          badgeClass: "badge-primary",
        };
      case "listening":
        return {
          icon: <Mic size={20} style={{ color: "var(--color-success)" }} />,
          label: "Awaiting Candidate Answer",
          desc: "Your turn: speak into your microphone or type your response below.",
          badgeClass: "badge-success",
        };
      case "thinking":
      case "processing":
        return {
          icon: <Loader2 size={20} className="animate-spin" style={{ color: "var(--color-primary)", animation: "spin 1s linear infinite" }} />,
          label: "Evaluating Response...",
          desc: "AI is analyzing your explanation and preparing feedback.",
          badgeClass: "badge-warning",
        };
      case "completed":
        return {
          icon: <CheckCircle2 size={20} style={{ color: "var(--color-success)" }} />,
          label: "Interview Completed",
          desc: "Compilation of full performance metrics finished.",
          badgeClass: "badge-success",
        };
      case "idle":
      default:
        return {
          icon: <Sparkles size={20} style={{ color: "var(--color-primary)" }} />,
          label: "Session Ready",
          desc: "Ready to start interview session.",
          badgeClass: "badge-neutral",
        };
    }
  };

  const status = getStatusInfo();

  return (
    <div
      className="card"
      style={{
        padding: "1.25rem 1.5rem",
        marginBottom: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        background: "var(--color-bg-primary)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "var(--color-info)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {status.icon}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
              {status.label}
            </h4>
            <span className={`badge ${status.badgeClass}`} style={{ fontSize: "0.75rem" }}>
              {state.toUpperCase()}
            </span>
          </div>
          <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            {status.desc}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
        <div>
          Candidate: <strong style={{ color: "var(--color-heading)" }}>{candidateName}</strong>
        </div>
        <span>•</span>
        <div>
          Focus Topic: <strong style={{ color: "var(--color-heading)" }}>{topic}</strong>
        </div>
      </div>
    </div>
  );
}

export default memo(InterviewerRobot);
