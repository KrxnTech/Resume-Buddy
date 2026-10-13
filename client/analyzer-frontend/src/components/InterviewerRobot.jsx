import { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";

/**
 * InterviewerRobot
 * Visual Representation of the AI Interviewer with video playback support
 * and procedural fallback cyber-avatar with dynamic audio waves & telemetry.
 */
function InterviewerRobot({
  state = "idle", // "idle" | "speaking" | "listening" | "thinking" | "processing" | "completed"
  candidateName = "Candidate",
  topic = "System Architecture",
}) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Control video playback based on robot state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    if (state === "speaking") {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [state, videoLoaded]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  const getStatusBadge = () => {
    switch (state) {
      case "speaking":
        return {
          dotClass: "speaking",
          label: "AI Interviewer Speaking...",
          sub: "Listen carefully to the question",
        };
      case "listening":
        return {
          dotClass: "listening",
          label: "AI Interviewer Listening...",
          sub: "Your turn: Speak or type your response",
        };
      case "thinking":
        return {
          dotClass: "thinking",
          label: "AI Evaluating Response...",
          sub: "Synthesizing answer & next technical probe",
        };
      case "processing":
        return {
          dotClass: "processing",
          label: "Processing Submission...",
          sub: "Scoring technical competencies",
        };
      case "completed":
        return {
          dotClass: "completed",
          label: "Interview Concluded",
          sub: "Generating comprehensive performance report",
        };
      case "idle":
      default:
        return {
          dotClass: "idle",
          label: "AI Interviewer Ready",
          sub: "Standing by for session start",
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div className={`interviewer-robot-container ${state}`}>
      {/* HUD Telemetry Top Bar */}
      <div className="robot-hud-top">
        <div className="hud-metric">
          <span className="hud-key">INTERVIEWER</span>
          <span className="hud-val">TITAN-AI // v2.6</span>
        </div>
        <div className="hud-metric right">
          <span className="hud-key">TOPIC</span>
          <span className="hud-val">{topic.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="robot-visual-viewport">
        {/* Optional Local Video Asset */}
        {!videoError && (
          <video
            ref={videoRef}
            src="/assets/interviewer-robot.webm"
            className={`robot-video-element ${videoLoaded ? "loaded" : "hidden"}`}
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
          />
        )}

        {/* Procedural Cybernetic AI Robot Avatar (High-Impact Minimalist) */}
        <div className={`robot-procedural-avatar ${state}`}>
          {/* Orbital Neural Rings */}
          <div className={`robot-neural-ring ${state === "thinking" || state === "processing" ? "rotating" : ""}`} />
          <div className="robot-chassis">
            {/* Robot Head Armor */}
            <div className="robot-head">
              {/* Antenna Sensors */}
              <div className="robot-antenna left" />
              <div className="robot-antenna right" />

              {/* Visor Screen */}
              <div className="robot-visor">
                {/* Visual Eye Elements */}
                {state === "speaking" ? (
                  <div className="robot-eyes speaking">
                    <span className="eye-bar bar-1" />
                    <span className="eye-bar bar-2" />
                    <span className="eye-bar bar-3" />
                    <span className="eye-bar bar-4" />
                    <span className="eye-bar bar-5" />
                    <span className="eye-bar bar-6" />
                  </div>
                ) : state === "listening" ? (
                  <div className="robot-eyes listening">
                    <span className="eye-circle left pulse" />
                    <span className="eye-circle right pulse" />
                  </div>
                ) : state === "thinking" || state === "processing" ? (
                  <div className="robot-eyes thinking">
                    <span className="thinking-scan-beam" />
                  </div>
                ) : (
                  <div className="robot-eyes idle">
                    <span className="eye-circle left" />
                    <span className="eye-circle right" />
                  </div>
                )}
              </div>

              {/* Voice Synthesizer Equalizer / Mouth Aperture */}
              <div className="robot-mouth-aperture">
                <span className={`mouth-wave ${state === "speaking" ? "wave-active" : ""}`} />
                <span className={`mouth-wave ${state === "speaking" ? "wave-active" : ""}`} />
                <span className={`mouth-wave ${state === "speaking" ? "wave-active" : ""}`} />
                <span className={`mouth-wave ${state === "speaking" ? "wave-active" : ""}`} />
                <span className={`mouth-wave ${state === "speaking" ? "wave-active" : ""}`} />
              </div>
            </div>

            {/* Neck / Collar */}
            <div className="robot-collar">
              <span className="collar-core-light" />
            </div>
          </div>
        </div>

        {/* Live Audio Equalizer Overlay for Speaking State */}
        {state === "speaking" && (
          <div className="robot-audio-spectrum">
            {[40, 75, 95, 60, 85, 100, 70, 90, 50, 80, 65, 45].map((height, i) => (
              <motion.span
                key={i}
                className="spectrum-bar"
                animate={{ height: [`${height * 0.3}%`, `${height}%`, `${height * 0.2}%`] }}
                transition={{ repeat: Infinity, duration: 0.6 + (i % 4) * 0.1, ease: "easeInOut" }}
              />
            ))}
          </div>
        )}

        {/* Live Radar Waves for Listening State */}
        {state === "listening" && (
          <div className="robot-listening-radar">
            <span className="radar-ring r1" />
            <span className="radar-ring r2" />
            <span className="radar-ring r3" />
          </div>
        )}
      </div>

      {/* Dynamic Status HUD Footer */}
      <div className="robot-hud-status-bar">
        <div className="status-label-group">
          <div className="status-indicator-dot">
            <span className={`status-dot ${status.dotClass}`} />
          </div>
          <div className="status-text-stack">
            <strong className="status-main-label">{status.label}</strong>
            <span className="status-sub-label">{status.sub}</span>
          </div>
        </div>

        <div className="status-badge-tag">
          {state === "speaking" && <span className="state-pill speaking">🔊 AUDIO TX</span>}
          {state === "listening" && <span className="state-pill listening">🎙️ MIC RX</span>}
          {state === "thinking" && <span className="state-pill thinking">⚡ REASONING</span>}
          {state === "processing" && <span className="state-pill processing">⏳ EVALUATING</span>}
          {state === "idle" && <span className="state-pill idle">IDLE</span>}
        </div>
      </div>
    </div>
  );
}

export default memo(InterviewerRobot);
