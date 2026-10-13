import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import ThemeToggle from "../components/ThemeToggle";

function Features() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const featureList = [
    {
      id: "ats",
      num: "01",
      category: "analysis",
      title: "ATS PRECISION SCORING",
      tagline: "Break through automated keyword filters",
      desc: "Scores your resume against standard parsing schemas. Highlights missing keywords, hard skills, soft skills, formatting flaws, and gives a direct 0-100% match breakdown.",
      points: ["Real-time keyword gap analysis", "Section-by-section score weighting", "Parsing error detection", "Format compliance checks"],
    },
    {
      id: "recruiter",
      num: "02",
      category: "analysis",
      title: "RECRUITER REVIEW MATRIX",
      tagline: "Honest hiring decisions before you apply",
      desc: "Simulates senior engineering hiring managers. Delivers hiring probability percentages, interview round odds, salary readiness fit, and identified risks.",
      points: ["Decision: Strong Hire / Hire / Consider / Reject", "Top strengths & identified candidate risks", "Best-fit role recommendations", "Prioritized action checklist"],
    },
    {
      id: "interview",
      num: "03",
      category: "interactive",
      title: "AI MOCK INTERVIEW ARENA",
      tagline: "Realistic technical & project probing",
      desc: "Simulates live 5, 10, or 15-question technical interviews. The interviewer inspects your real projects, challenges claims, evaluates every answer, and adjusts difficulty dynamically.",
      points: ["6 Modes: Tech, Project, Claims, Behavioral, Mixed, Job-Specific", "Adaptive difficulty adjustment", "Web Speech TTS voice questions & STT microphone answers", "Comprehensive post-interview score report & transcript"],
    },
    {
      id: "rewrite",
      num: "04",
      category: "generation",
      title: "AI REWRITE STUDIO",
      tagline: "Instant before/after bullet optimization",
      desc: "Transforms weak bullet points into high-impact, quantifiable accomplishment statements. Provides before/after side-by-side diff comparisons with copy tools.",
      points: ["Summary, Experience, and Project rewrites", "Strong action verbs injection", "Quantified metric suggestions", "Live side-by-side diff comparison"],
    },
    {
      id: "copilot",
      num: "05",
      category: "interactive",
      title: "CAREER COPILOT CHATBOT",
      tagline: "Your grounded personal career advisor",
      desc: "An AI career assistant that already knows your complete parsed profile. Answers questions about your background, career pivot, or ATS score without asking you to repeat yourself.",
      points: ["Strict anti-hallucination grounding", "Full conversational history memory", "Voice read-aloud on every response", "Zero bulky filler essays"],
    },
    {
      id: "health",
      num: "06",
      category: "utilities",
      title: "RESUME HEALTH AUDIT",
      tagline: "Complete profile structural integrity",
      desc: "Verifies contact links, GitHub repositories, LinkedIn profile presence, education completeness, section balance, and portfolio readiness.",
      points: ["Social & Portfolio link verification", "Skill balance checker", "Certification & awards scanner", "Overall health percentage score"],
    },
  ];

  const filteredFeatures = activeTab === "all" ? featureList : featureList.filter((f) => f.category === activeTab);

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
          <button type="button" className="kinetic-nav-link active" onClick={() => navigate("/features")}>FEATURES</button>
          <button type="button" className="kinetic-nav-link" onClick={() => navigate("/help")}>HELP</button>
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
        <span className="kinetic-eyebrow">SYSTEM CAPABILITIES</span>
        <h1 className="kinetic-hero-title">
          SIX ENGINES.<br />
          <span className="kinetic-highlight">ZERO GUESSWORK.</span>
        </h1>
        <p className="kinetic-hero-lead">
          Every tool inside Resume Buddy is built for high-conviction engineering careers. Explore how our pipeline turns raw PDFs into hireable portfolios.
        </p>
      </header>

      {/* Ticker */}
      <div className="kinetic-marquee-bar">
        <Marquee speed={75} gradient={false} autoFill={true}>
          <span className="kinetic-ticker-item">ATS OPTIMIZER ///</span>
          <span className="kinetic-ticker-item">RECRUITER REVIEW ///</span>
          <span className="kinetic-ticker-item">MOCK INTERVIEW ARENA ///</span>
          <span className="kinetic-ticker-item">REWRITE STUDIO ///</span>
          <span className="kinetic-ticker-item">CAREER COPILOT ///</span>
          <span className="kinetic-ticker-item">HEALTH AUDITOR ///</span>
        </Marquee>
      </div>

      {/* Feature Filter Tabs */}
      <section className="kinetic-section">
        <div className="kinetic-tabs-bar">
          <button type="button" className={`kinetic-tab-btn ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
            ALL ENGINES ({featureList.length})
          </button>
          <button type="button" className={`kinetic-tab-btn ${activeTab === "analysis" ? "active" : ""}`} onClick={() => setActiveTab("analysis")}>
            ANALYSIS
          </button>
          <button type="button" className={`kinetic-tab-btn ${activeTab === "interactive" ? "active" : ""}`} onClick={() => setActiveTab("interactive")}>
            INTERACTIVE
          </button>
          <button type="button" className={`kinetic-tab-btn ${activeTab === "generation" ? "active" : ""}`} onClick={() => setActiveTab("generation")}>
            REWRITING
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="kinetic-grid-2">
          {filteredFeatures.map((f) => (
            <div key={f.id} className="kinetic-feature-card">
              <div className="kinetic-card-top-row">
                <span className="kinetic-card-num">{f.num}</span>
                <span className="kinetic-tag-badge">{f.category.toUpperCase()}</span>
              </div>
              <h3 className="kinetic-card-title lg">{f.title}</h3>
              <p className="kinetic-card-tagline">{f.tagline}</p>
              <p className="kinetic-card-body">{f.desc}</p>
              <ul className="kinetic-card-bullet-list">
                {f.points.map((pt, i) => (
                  <li key={i}>— {pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="kinetic-cta-banner">
        <h2 className="kinetic-cta-title">TEST YOUR RESUME ON ALL 6 ENGINES</h2>
        <p className="kinetic-cta-subtitle">Upload your PDF and get instant ATS, recruiter, and interview feedback.</p>
        <button type="button" className="kinetic-cta-btn primary lg" onClick={() => navigate("/upload")}>
          START SCANNING NOW →
        </button>
      </section>
    </div>
  );
}

export default Features;
