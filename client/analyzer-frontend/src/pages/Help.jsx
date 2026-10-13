import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import ThemeToggle from "../components/ThemeToggle";

function Help() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(0);

  const faqs = [
    {
      q: "HOW DOES RESUME BUDDY CALCULATE ATS MATCH PERCENTAGES?",
      a: "Our engine maps your verified skills, experience bullet points, and section structures directly against standard parser requirements (Greenhouse, Lever, Workday) and target Job Descriptions. Scores are weighted: 40% skills alignment, 30% experience depth, 15% project validation, and 15% formatting compliance.",
    },
    {
      q: "DOES RESUME BUDDY STORE OR LEAK MY RESUME DATA?",
      a: "No. Resume PDFs are processed in-memory as temporary buffers. We do not sell, publicize, or train public models on your personal documents. All conversation histories and evaluations are stored in your private browser session.",
    },
    {
      q: "HOW DOES THE AI MOCK INTERVIEWER GENERATE QUESTIONS?",
      a: "Rather than asking generic textbook questions, our interviewer reviews your structured candidate profile and generates dynamic, contextual questions based on the specific technologies, claims, and metrics you documented in your projects.",
    },
    {
      q: "WHAT FORMAT OF RESUMES WORK BEST?",
      a: "Standard single or double-column PDF files generated from Google Docs, Word, LaTeX, or Figma with clean text layers work best. Avoid image-only scans without OCR.",
    },
    {
      q: "CAN I USE RESUME BUDDY WITHOUT A JOB DESCRIPTION?",
      a: "Yes! If you upload only a resume, Resume Buddy analyzes your profile against general industry standards for your target role and gives comprehensive health, recruiter, and interview feedback.",
    },
    {
      q: "HOW DO I USE VOICE INPUT AND SPEECH SYNTHESIS?",
      a: "Both Career Copilot and Mock Interview Mode feature native Web Speech integration. Click the 🔊 button to have questions read aloud, or click the 🎙️ microphone icon to dictate your answers naturally.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <button type="button" className="kinetic-nav-link" onClick={() => navigate("/about")}>ABOUT</button>
          <button type="button" className="kinetic-nav-link" onClick={() => navigate("/features")}>FEATURES</button>
          <button type="button" className="kinetic-nav-link active" onClick={() => navigate("/help")}>HELP</button>
        </div>

        <div className="kinetic-nav-actions">
          <button type="button" className="kinetic-cta-btn mini" onClick={() => navigate("/upload")}>
            UPLOAD RESUME
          </button>
          <ThemeToggle compact={true} />
        </div>
      </nav>

      {/* Hero Header */}
      <header className="kinetic-hero-section">
        <span className="kinetic-eyebrow">HELP & DOCUMENTATION</span>
        <h1 className="kinetic-hero-title">
          KNOWLEDGE BASE.<br />
          <span className="kinetic-highlight">INSTANT CLARITY.</span>
        </h1>
        <p className="kinetic-hero-lead">
          Find fast answers regarding ATS parser rules, AI interview workflows, security, and profile optimization.
        </p>

        {/* Brutalist Search Bar */}
        <div className="kinetic-search-box">
          <input
            type="text"
            className="kinetic-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH ATS RULES, MOCK INTERVIEWS, REWRITES..."
          />
          {searchQuery && (
            <button type="button" className="kinetic-search-clear" onClick={() => setSearchQuery("")}>
              CLEAR
            </button>
          )}
        </div>
      </header>

      {/* Marquee */}
      <div className="kinetic-marquee-bar">
        <Marquee speed={70} gradient={false} autoFill={true}>
          <span className="kinetic-ticker-item">FREQUENTLY ASKED QUESTIONS ///</span>
          <span className="kinetic-ticker-item">ATS COMPLIANCE CHECKLIST ///</span>
          <span className="kinetic-ticker-item">LIVE SUPPORT & DOCUMENTATION ///</span>
          <span className="kinetic-ticker-item">PRIVACY & DATA SAFETY ///</span>
        </Marquee>
      </div>

      {/* FAQ Accordion Section */}
      <section className="kinetic-section">
        <div className="kinetic-section-header">
          <span className="kinetic-section-num">01 / FAQ</span>
          <h2 className="kinetic-section-heading">FREQUENTLY ASKED QUESTIONS</h2>
        </div>

        <div className="kinetic-accordion-list">
          {filteredFaqs.length === 0 ? (
            <div className="kinetic-empty-box">
              <p>No results found for "{searchQuery}". Try searching for "ATS", "Interview", or "PDF".</p>
            </div>
          ) : (
            filteredFaqs.map((item, idx) => {
              const isOpen = activeAccordion === idx;
              return (
                <div key={idx} className={`kinetic-accordion-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="kinetic-accordion-trigger"
                    onClick={() => setActiveAccordion(isOpen ? -1 : idx)}
                  >
                    <span className="kinetic-acc-title">{item.q}</span>
                    <span className="kinetic-acc-icon">{isOpen ? "—" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="kinetic-accordion-content">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Quick Best Practices Dos & Don'ts */}
      <section className="kinetic-section">
        <div className="kinetic-section-header">
          <span className="kinetic-section-num">02 / BEST PRACTICES</span>
          <h2 className="kinetic-section-heading">ATS DOS & DON'TS</h2>
        </div>

        <div className="kinetic-grid-2">
          <div className="kinetic-card" style={{ borderColor: "var(--clr-green)" }}>
            <h3 className="kinetic-card-title" style={{ color: "var(--clr-green)" }}>✅ WHAT TO DO</h3>
            <ul className="kinetic-card-bullet-list">
              <li>— Use standard section headings: "Experience", "Skills", "Education", "Projects".</li>
              <li>— Quantify results with metrics (e.g. "Reduced API latency by 45% using Redis").</li>
              <li>— Include standard tech stack categories (Languages, Frameworks, Databases, Tools).</li>
              <li>— Provide direct GitHub, LinkedIn, and live portfolio URLs.</li>
            </ul>
          </div>

          <div className="kinetic-card" style={{ borderColor: "var(--clr-red)" }}>
            <h3 className="kinetic-card-title" style={{ color: "var(--clr-red)" }}>❌ WHAT TO AVOID</h3>
            <ul className="kinetic-card-bullet-list">
              <li>— Embedding critical text in flattened raster images or canvas graphics.</li>
              <li>— Using vague skill bars (e.g. "Python: 80%") with no project evidence.</li>
              <li>— Multi-column nested tables that confuse standard ATS left-to-right line parsers.</li>
              <li>— Generic non-action bullets like "Responsible for maintenance".</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="kinetic-cta-banner">
        <h2 className="kinetic-cta-title">READY TO SCAN YOUR RESUME?</h2>
        <p className="kinetic-cta-subtitle">Get your full score report and recruiter feedback in under 10 seconds.</p>
        <button type="button" className="kinetic-cta-btn primary lg" onClick={() => navigate("/upload")}>
          UPLOAD YOUR RESUME NOW →
        </button>
      </section>
    </div>
  );
}

export default Help;
