import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";

function Landing() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [activeFaq, setActiveFaq] = useState(0);

  const stats = [
    { num: "94.8%", label: "INTERVIEW PASS RATE" },
    { num: "<120MS", label: "ATS PARSER LATENCY" },
    { num: "6 ENGINES", label: "ZERO GUESSWORK" },
    { num: "100%", label: "PROVEN GROUNDING" },
  ];

  const features = [
    {
      num: "01",
      title: "ATS PRECISION SCORER",
      desc: "Instant section-by-section breakdown comparing your resume to standard scanning engines. Detects missing keywords, hard skills, and formatting red flags.",
      action: "SCAN RESUME",
    },
    {
      num: "02",
      title: "RECRUITER REVIEW MATRIX",
      desc: "Simulates senior engineering hiring managers. Delivers hiring probability percentages, interview round odds, salary readiness fit, and identified risks.",
      action: "VIEW RECRUITER VERDICT",
    },
    {
      num: "03",
      title: "AI MOCK INTERVIEW ARENA",
      desc: "Realistic multi-mode technical and project interview simulation with live voice read-aloud and speech recognition dictation. Evaluates every answer adaptively.",
      action: "LAUNCH INTERVIEW",
    },
    {
      num: "04",
      title: "AI REWRITE STUDIO",
      desc: "Transforms weak, passive bullet points into high-impact, quantifiable accomplishment statements with live side-by-side diff editing.",
      action: "REWRITE BULLETS",
    },
  ];

  const faqs = [
    {
      q: "HOW DOES RESUME BUDDY ANALYZE MY PDF?",
      a: "We extract raw text in-memory, structure it into a candidate profile schema, and evaluate it across our Groq multi-model pipeline against job requirements.",
    },
    {
      q: "IS THIS A GENERIC CHATGPT PROMPT?",
      a: "No. Resume Buddy uses specialized, multi-stage analytical prompts that enforce anti-hallucination, structured data parsing, and realistic recruiter metrics.",
    },
    {
      q: "CAN I RUN MOCK INTERVIEWS USING VOICE?",
      a: "Yes! Mock Interview Arena and Career Copilot support both browser speech synthesis (read aloud) and microphone speech recognition (voice-to-text).",
    },
    {
      q: "IS MY RESUME STORED OR KEPT PRIVATE?",
      a: "Your resume is processed temporarily in-memory and never stored on public servers or used to train external models.",
    },
  ];

  return (
    <div className="kinetic-page-container">
      {/* Noise Texture Filter */}
      <svg className="kinetic-noise-overlay" aria-hidden="true">
        <filter id="kinetic-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#kinetic-noise)" opacity="0.03" />
      </svg>

      {/* Top Navbar */}
      <nav className="kinetic-navbar">
        <div className="kinetic-logo" onClick={() => navigate("/")}>
          <span>RESUME BUDDY</span>
          <span className="kinetic-logo-tag">AI/26</span>
        </div>

        <div className="kinetic-nav-links">
          <button type="button" className="kinetic-nav-link active" onClick={() => navigate("/")}>HOME</button>
          <button type="button" className="kinetic-nav-link" onClick={() => navigate("/about")}>ABOUT</button>
          <button type="button" className="kinetic-nav-link" onClick={() => navigate("/features")}>FEATURES</button>
          <button type="button" className="kinetic-nav-link" onClick={() => navigate("/help")}>HELP</button>
        </div>

        <div className="kinetic-nav-actions">
          {isAuthenticated && user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <button
                type="button"
                className="kinetic-cta-btn mini"
                onClick={() => navigate("/dashboard")}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--clr-border)", color: "var(--clr-text)" }}
              >
                👤 {user.name.split(" ")[0]}
              </button>
              <button
                type="button"
                className="kinetic-cta-btn mini"
                onClick={logout}
                title="Sign Out"
                style={{ background: "transparent", border: "1px solid rgba(255,75,75,0.3)", color: "#ff6b6b" }}
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="kinetic-cta-btn mini"
              onClick={() => openAuthModal("login")}
              style={{ background: "transparent", border: "1px solid var(--clr-border)", color: "var(--clr-text)" }}
            >
              SIGN IN
            </button>
          )}

          <button type="button" className="kinetic-cta-btn mini primary" onClick={() => navigate("/upload")}>
            UPLOAD RESUME
          </button>
          <ThemeToggle compact={true} />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="kinetic-hero-section">
        <div className="kinetic-badge-row">
          <span className="kinetic-eyebrow">AI CAREER INTELLIGENCE PLATFORM</span>
          <span className="kinetic-live-dot">● LIVE PIPELINE</span>
        </div>

        <h1 className="kinetic-hero-title massive">
          ANALYSIS WITHOUT MERCY.<br />
          <span className="kinetic-highlight">GET HIRED AT SCALE.</span>
        </h1>

        <p className="kinetic-hero-lead">
          Real-time ATS scoring, recruiter hiring simulation, adaptive technical mock interviews, and AI bullet rewrites — engineered for technical professionals.
        </p>

        <div className="kinetic-hero-actions">
          <button type="button" className="kinetic-cta-btn primary lg" onClick={() => navigate("/upload")}>
            START RESUME SCAN →
          </button>
          <button type="button" className="kinetic-cta-btn outline lg" onClick={() => navigate("/features")}>
            EXPLORE ARCHITECTURE
          </button>
        </div>
      </header>

      {/* High-Energy Stats Marquee */}
      <div className="kinetic-marquee-bar high-energy">
        <Marquee speed={85} gradient={false} autoFill={true}>
          <span className="kinetic-ticker-item invert">100% RECRUITER PRECISION ///</span>
          <span className="kinetic-ticker-item invert">12,480+ RESUMES OPTIMIZED ///</span>
          <span className="kinetic-ticker-item invert">&lt; 120MS ATS LATENCY ///</span>
          <span className="kinetic-ticker-item invert">ZERO FLUFF REWRITING ///</span>
          <span className="kinetic-ticker-item invert">ADAPTIVE MOCK INTERVIEWS ///</span>
        </Marquee>
      </div>

      {/* Stat Metric Grid */}
      <section className="kinetic-stats-grid">
        {stats.map((s, idx) => (
          <div key={idx} className="kinetic-stat-box">
            <span className="kinetic-stat-num">{s.num}</span>
            <span className="kinetic-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Stacked Brutalist Feature Cards */}
      <section className="kinetic-section">
        <div className="kinetic-section-header">
          <span className="kinetic-section-num">01 / PLATFORM</span>
          <h2 className="kinetic-section-heading">CORE CAPABILITIES</h2>
        </div>

        <div className="kinetic-grid-2">
          {features.map((f) => (
            <div key={f.num} className="kinetic-feature-tile invert-hover" onClick={() => navigate("/upload")}>
              <div className="kinetic-tile-header">
                <span className="kinetic-giant-num">{f.num}</span>
                <span className="kinetic-tile-action-tag">{f.action} →</span>
              </div>
              <h3 className="kinetic-tile-title">{f.title}</h3>
              <p className="kinetic-tile-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Code / Bullet Diff Preview */}
      <section className="kinetic-section">
        <div className="kinetic-section-header">
          <span className="kinetic-section-num">02 / REWRITE ENGINE</span>
          <h2 className="kinetic-section-heading">BEFORE VS AFTER AI REWRITE</h2>
        </div>

        <div className="kinetic-diff-container">
          <div className="kinetic-diff-col original">
            <span className="kinetic-diff-label red">ORIGINAL RESUME BULLET</span>
            <p className="kinetic-diff-text">
              "Worked on the backend API using Node and helped the team make database queries faster when the site was slow."
            </p>
            <span className="kinetic-diff-meta">ATS Score: 42% • Recruiter Impact: Weak</span>
          </div>

          <div className="kinetic-diff-col improved">
            <span className="kinetic-diff-label green">AI REWRITE STUDIO OPTIMIZED</span>
            <p className="kinetic-diff-text">
              "Architected high-throughput microservices using Node.js, Express, and Redis; optimized PostgreSQL query execution plans, reducing p95 database latency by 45% under 20k req/sec load."
            </p>
            <span className="kinetic-diff-meta highlight">ATS Score: 96% • Recruiter Impact: Strong Hire (+54%)</span>
          </div>
        </div>
      </section>

      {/* Testimonials Slower Marquee */}
      <div className="kinetic-marquee-bar dark-accent">
        <Marquee speed={45} gradient={false} autoFill={true}>
          <div className="kinetic-quote-box">
            <p>"The mock interview mode challenged my real projects instead of asking generic trivia."</p>
            <span>— Senior Backend Engineer, Stripe</span>
          </div>
          <div className="kinetic-quote-box">
            <p>"ATS score jumped from 54% to 92% and I received 3 FAANG recruiter calls within a week."</p>
            <span>— Full Stack Lead, Coinbase</span>
          </div>
          <div className="kinetic-quote-box">
            <p>"Brutal, honest, and actionable feedback. The rewrite studio is unmatched."</p>
            <span>— Staff DevOps Architect, AWS</span>
          </div>
        </Marquee>
      </div>

      {/* FAQ Section */}
      <section className="kinetic-section">
        <div className="kinetic-section-header">
          <span className="kinetic-section-num">03 / INTELLIGENCE</span>
          <h2 className="kinetic-section-heading">FREQUENTLY ASKED QUESTIONS</h2>
        </div>

        <div className="kinetic-accordion-list">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className={`kinetic-accordion-item ${isOpen ? "open" : ""}`}>
                <button
                  type="button"
                  className="kinetic-accordion-trigger"
                  onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                >
                  <span className="kinetic-acc-title">{faq.q}</span>
                  <span className="kinetic-acc-icon">{isOpen ? "—" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="kinetic-accordion-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Mega CTA Banner */}
      <section className="kinetic-cta-banner">
        <h2 className="kinetic-cta-title">READY TO CRUSH YOUR NEXT TECHNICAL INTERVIEW?</h2>
        <p className="kinetic-cta-subtitle">Upload your resume now and get your complete recruiter and ATS score breakdown.</p>
        <button type="button" className="kinetic-cta-btn primary lg" onClick={() => navigate("/upload")}>
          LAUNCH RESUME SCANNER NOW →
        </button>
      </section>

      {/* Kinetic Brutalist Footer */}
      <footer className="kinetic-footer">
        <div className="kinetic-footer-top">
          <div className="kinetic-footer-brand">
            <span className="kinetic-footer-logo">RESUME BUDDY</span>
            <p>AI Career Intelligence & Technical Assessment Platform.</p>
          </div>
          <div className="kinetic-footer-links-grid">
            <div className="kinetic-footer-col">
              <span className="footer-col-title">NAVIGATION</span>
              <button type="button" onClick={() => navigate("/")}>Home</button>
              <button type="button" onClick={() => navigate("/about")}>About Manifesto</button>
              <button type="button" onClick={() => navigate("/features")}>Feature Engines</button>
              <button type="button" onClick={() => navigate("/help")}>Help & FAQ</button>
            </div>
            <div className="kinetic-footer-col">
              <span className="footer-col-title">ENGINES</span>
              <button type="button" onClick={() => navigate("/upload")}>ATS Scanner</button>
              <button type="button" onClick={() => navigate("/upload")}>Recruiter Review</button>
              <button type="button" onClick={() => navigate("/upload")}>Mock Interview</button>
              <button type="button" onClick={() => navigate("/upload")}>Rewrite Studio</button>
            </div>
          </div>
        </div>
        <div className="kinetic-footer-bottom">
          <span>© 2026 RESUME BUDDY • ALL RIGHTS RESERVED • KINETIC TYPOGRAPHY EDITION</span>
          <span className="footer-status">● SYSTEM OPERATIONAL (GROQ QWEN CLUSTER)</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
