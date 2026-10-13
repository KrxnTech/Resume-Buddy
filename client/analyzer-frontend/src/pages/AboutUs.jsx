import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import ThemeToggle from "../components/ThemeToggle";

function AboutUs() {
  const navigate = useNavigate();

  const values = [
    {
      num: "01",
      title: "ZERO HALLUCINATIONS",
      desc: "Resumes are ground-truth data. We never invent claims, metrics, or technologies that the candidate did not build.",
    },
    {
      num: "02",
      title: "RECRUITER HONESTY",
      desc: "No vague praise or generic sugar-coating. We tell candidates exactly why an ATS parser drops them or a recruiter passes.",
    },
    {
      num: "03",
      title: "PRECISION OVER BULK",
      desc: "Bullet points should be quantified impact statements. We replace fluffy adjectives with verified action verbs and metrics.",
    },
    {
      num: "04",
      title: "DYNAMIC ADAPTATION",
      desc: "From adaptive mock interviewers to contextual copilots, intelligence adapts to the candidate’s real-world seniority.",
    },
  ];

  return (
    <div className="kinetic-page-container">
      {/* Top Navbar */}
      <nav className="kinetic-navbar">
        <div className="kinetic-logo" onClick={() => navigate("/")}>
          <span>RESUME BUDDY</span>
          <span className="kinetic-logo-tag">AI/26</span>
        </div>

        <div className="kinetic-nav-links">
          <button type="button" className="kinetic-nav-link" onClick={() => navigate("/")}>HOME</button>
          <button type="button" className="kinetic-nav-link active" onClick={() => navigate("/about")}>ABOUT</button>
          <button type="button" className="kinetic-nav-link" onClick={() => navigate("/features")}>FEATURES</button>
          <button type="button" className="kinetic-nav-link" onClick={() => navigate("/help")}>HELP</button>
        </div>

        <div className="kinetic-nav-actions">
          <button type="button" className="kinetic-cta-btn mini" onClick={() => navigate("/upload")}>
            UPLOAD RESUME
          </button>
          <ThemeToggle compact={true} />
        </div>
      </nav>

      {/* Hero Headline */}
      <header className="kinetic-hero-section">
        <span className="kinetic-eyebrow">OUR MANIFESTO</span>
        <h1 className="kinetic-hero-title">
          RESUMES ARE NOT DOCUMENTS.<br />
          THEY ARE <span className="kinetic-highlight">TECHNICAL CONTRACTS</span>.
        </h1>
        <p className="kinetic-hero-lead">
          We built Resume Buddy because traditional career advice is slow, outdated, and filled with generic buzzwords.
          Engineers and tech professionals deserve automated precision, brutal honesty, and real-time intelligence.
        </p>
      </header>

      {/* Ticker Marquee */}
      <div className="kinetic-marquee-bar">
        <Marquee speed={70} gradient={false} autoFill={true}>
          <span className="kinetic-ticker-item">FAANG TESTED ///</span>
          <span className="kinetic-ticker-item">ZERO FLUFF ///</span>
          <span className="kinetic-ticker-item">ATS COMPLIANT ///</span>
          <span className="kinetic-ticker-item">MULTI-MODEL ARCHITECTURE ///</span>
          <span className="kinetic-ticker-item">REACTIVE INTERVIEWS ///</span>
        </Marquee>
      </div>

      {/* Mission & Philosophy Grid */}
      <section className="kinetic-section">
        <div className="kinetic-section-header">
          <span className="kinetic-section-num">01 / ARCHITECTURE</span>
          <h2 className="kinetic-section-heading">HOW THE ENGINE REASONS</h2>
        </div>

        <div className="kinetic-grid-2">
          <div className="kinetic-card">
            <span className="kinetic-card-num">A1</span>
            <h3 className="kinetic-card-title">MULTI-MODEL FALLBACK PIPELINE</h3>
            <p className="kinetic-card-body">
              Resume Buddy executes across a high-throughput Groq cluster (Qwen 2.5 72B, DeepSeek, and specialized parsers).
              If any model approaches token or rate thresholds, the controller gracefully cascades to guaranteed fallbacks in under 80ms.
            </p>
          </div>

          <div className="kinetic-card">
            <span className="kinetic-card-num">A2</span>
            <h3 className="kinetic-card-title">STRUCTURED CANDIDATE PROFILING</h3>
            <p className="kinetic-card-body">
              PDFs are stripped, cleaned, and parsed into a fully normalized schema: verified identities, categorized tech stacks,
              quantified project accomplishments, and historical metrics. Raw text is never re-dumped into LLM prompts.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="kinetic-section">
        <div className="kinetic-section-header">
          <span className="kinetic-section-num">02 / PILLARS</span>
          <h2 className="kinetic-section-heading">OUR CORE PRINCIPLES</h2>
        </div>

        <div className="kinetic-grid-4">
          {values.map((v) => (
            <div key={v.num} className="kinetic-card invert-hover">
              <span className="kinetic-card-num">{v.num}</span>
              <h3 className="kinetic-card-title">{v.title}</h3>
              <p className="kinetic-card-body">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="kinetic-cta-banner">
        <h2 className="kinetic-cta-title">ELEVATE YOUR TECHNICAL PROFILE NOW</h2>
        <p className="kinetic-cta-subtitle">Free to start. No account required. Instant recruiter feedback.</p>
        <button type="button" className="kinetic-cta-btn primary lg" onClick={() => navigate("/upload")}>
          LAUNCH SCANNER →
        </button>
      </section>
    </div>
  );
}

export default AboutUs;
