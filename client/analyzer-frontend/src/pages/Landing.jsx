import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Target,
  FileSearch,
  Briefcase,
  Layers,
  Mic,
  Map,
  FileText,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  UploadCloud,
  Bot,
  Download,
} from "lucide-react";
import TopNavbar from "../components/TopNavbar";

function Landing() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      icon: Target,
      title: "ATS Compatibility",
      desc: "Detailed scoring across skills, experience, formatting, and keyword density to ensure your resume clears applicant tracking filters.",
    },
    {
      icon: FileSearch,
      title: "Resume and Job Description Matching",
      desc: "Contextual comparison against any job description, identifying exact skill matches and critical missing qualifications.",
    },
    {
      icon: Briefcase,
      title: "Recruiter Insights",
      desc: "Simulates an experienced technical recruiter evaluating career progression, project depth, and role alignment.",
    },
    {
      icon: FileText,
      title: "Section-by-Section Analysis",
      desc: "Granular breakdown of your Professional Summary, Experience, Projects, Education, and Skills with targeted advice.",
    },
    {
      icon: Mic,
      title: "AI Interview Preparation",
      desc: "Interactive technical and behavioral mock interview sessions based on your specific projects and target role requirements.",
    },
    {
      icon: Map,
      title: "Career Roadmap",
      desc: "Actionable milestone progression to bridge core skill gaps, strengthen weak points, and target strategic career roles.",
    },
    {
      icon: Bot,
      title: "Career Copilot",
      desc: "Real-time AI career advisory to query your resume strengths, negotiate compensation, and formulate application strategies.",
    },
    {
      icon: Download,
      title: "PDF Report Export",
      desc: "Generate and download a clean, structured audit report summarizing your complete resume scores and recommendations.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload your resume.",
      desc: "Upload your existing PDF resume or paste raw resume text into the secure scanner.",
    },
    {
      number: "02",
      title: "Add a job description.",
      desc: "Paste the complete requirements and responsibilities for the target role you want.",
    },
    {
      number: "03",
      title: "Analyze your profile.",
      desc: "Our engine performs contextual evaluation against ATS standards and recruiter criteria.",
    },
    {
      number: "04",
      title: "Improve your resume.",
      desc: "Review match scores, address skill gaps, and practice tailored interview questions.",
    },
  ];

  const faqs = [
    {
      q: "How does Resume Buddy evaluate my resume?",
      a: "Resume Buddy structures your resume into a standardized candidate profile and evaluates it against the job description using large language models. Rather than relying on simple keyword counts, it evaluates context, relevance, and alignment.",
    },
    {
      q: "Does this guarantee an interview or job offer?",
      a: "No. Resume Buddy provides data-driven estimates and recommendations to help you present your experience clearly and pass initial filters. Final hiring decisions always depend on individual employers.",
    },
    {
      q: "Is my resume data private and secure?",
      a: "Yes. Resumes are processed in-memory during analysis. Your data is not sold or shared with third parties.",
    },
    {
      q: "What file formats are supported?",
      a: "You can upload standard PDF resumes or directly paste text from any document format.",
    },
  ];

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="landing-page">
      {/* Top Navigation */}
      <TopNavbar />

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="container hero-content">
          <h1 className="hero-headline">Build a Resume That Gets Noticed.</h1>
          <p className="hero-subtitle">
            Analyze your resume against real job requirements, understand ATS compatibility, discover skill gaps, and prepare for your next opportunity with AI-powered career insights.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/upload")}
            >
              <UploadCloud size={18} />
              <span>Analyze My Resume</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate("/features")}
            >
              <span>Explore Features</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="hero-trust-caption">
            <CheckCircle2 size={14} color="var(--clr-success)" />
            <span>Compare your resume against any target job description with contextual AI evaluation.</span>
          </div>

          {/* Minimalist Dashboard Preview */}
          <div className="dashboard-preview-card">
            <div className="preview-card-header">
              <div className="preview-browser-dots">
                <span className="browser-dot" />
                <span className="browser-dot" />
                <span className="browser-dot" />
              </div>
              <span style={{ fontSize: "12px", color: "var(--clr-muted)" }}>Sample Analysis Preview</span>
              <span className="badge badge-neutral">Sample Output</span>
            </div>

            <div className="preview-card-body">
              <div className="preview-score-widget">
                <div style={{ fontSize: "12px", color: "var(--clr-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                  Overall Match Score
                </div>
                <div className="preview-score-number">88%</div>
                <span className="badge badge-success" style={{ marginTop: "6px" }}>Strong Alignment</span>
                <p style={{ fontSize: "12px", color: "var(--clr-muted)", marginTop: "12px", lineHeight: "1.5" }}>
                  Candidate demonstrates solid experience with core backend requirements.
                </p>
              </div>

              <div className="preview-metrics-list">
                <div>
                  <div className="preview-metric-row">
                    <span style={{ fontWeight: 500, color: "var(--clr-heading)" }}>Skills Compatibility</span>
                    <span style={{ fontWeight: 600 }}>92%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill success" style={{ width: "92%" }} />
                  </div>
                </div>

                <div>
                  <div className="preview-metric-row">
                    <span style={{ fontWeight: 500, color: "var(--clr-heading)" }}>Experience Relevance</span>
                    <span style={{ fontWeight: 600 }}>85%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill success" style={{ width: "85%" }} />
                  </div>
                </div>

                <div>
                  <div className="preview-metric-row">
                    <span style={{ fontWeight: 500, color: "var(--clr-heading)" }}>ATS Formatting Standard</span>
                    <span style={{ fontWeight: 600 }}>90%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill success" style={{ width: "90%" }} />
                  </div>
                </div>

                <div style={{ paddingTop: "8px", borderTop: "1px solid var(--clr-border-light)" }}>
                  <div style={{ fontSize: "12px", color: "var(--clr-muted)", marginBottom: "6px" }}>Verified Skill Matches:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    <span className="chip chip-blue">React</span>
                    <span className="chip chip-blue">Node.js</span>
                    <span className="chip chip-blue">TypeScript</span>
                    <span className="chip chip-blue">PostgreSQL</span>
                    <span className="chip chip-amber">+ 2 Missing: Redis, Docker</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="landing-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Comprehensive Platform</span>
            <h2 className="section-title">Engineered for Clear Career Decisions</h2>
            <p className="section-desc">
              Every tool is designed to give you transparent, structured feedback on your qualifications without hype or decorative complexity.
            </p>
          </div>

          <div className="features-grid">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="feature-card">
                  <div className="feature-icon-wrapper">
                    <Icon size={20} />
                  </div>
                  <h3 className="feature-card-title">{item.title}</h3>
                  <p className="feature-card-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="landing-section alt">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Simple Workflow</span>
            <h2 className="section-title">How Resume Buddy Works</h2>
            <p className="section-desc">
              Get detailed analysis and actionable recommendations in four straightforward steps.
            </p>
          </div>

          <div className="steps-row">
            {steps.map((s, idx) => (
              <div key={idx} className="step-card">
                <span className="step-number">{s.number}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="landing-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Why Resume Buddy</span>
            <h2 className="section-title">Contextual AI Evaluation</h2>
            <p className="section-desc">
              Traditional scanners count keyword occurrences. Resume Buddy evaluates depth of experience, relevance to requirements, and recruiter credibility.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            <div className="card">
              <h4 style={{ fontSize: "16px", marginBottom: "8px", color: "var(--clr-heading)" }}>Dual-Perspective Scoring</h4>
              <p style={{ fontSize: "14px", color: "var(--clr-muted)" }}>
                Evaluates your document from both an algorithmic ATS compatibility standpoint and an experienced hiring manager perspective.
              </p>
            </div>
            <div className="card">
              <h4 style={{ fontSize: "16px", marginBottom: "8px", color: "var(--clr-heading)" }}>Actionable Recommendations</h4>
              <p style={{ fontSize: "14px", color: "var(--clr-muted)" }}>
                Provides prioritized feedback explaining what skills are missing, why they matter, and how to address gaps effectively.
              </p>
            </div>
            <div className="card">
              <h4 style={{ fontSize: "16px", marginBottom: "8px", color: "var(--clr-heading)" }}>Grounded &amp; Honest</h4>
              <p style={{ fontSize: "14px", color: "var(--clr-muted)" }}>
                No inflated metrics or false hiring guarantees. You receive clear, objective feedback to present your real strengths accurately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-section alt">
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="section-header">
            <span className="section-eyebrow">Frequently Asked Questions</span>
            <h2 className="section-title">Questions &amp; Answers</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{ padding: "18px 20px", cursor: "pointer" }}
                  onClick={() => toggleFaq(idx)}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--clr-heading)" }}>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      color="var(--clr-muted)"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 200ms ease",
                      }}
                    />
                  </div>
                  {isOpen && (
                    <p style={{ fontSize: "14px", color: "var(--clr-text)", marginTop: "12px", borderTop: "1px solid var(--clr-border-light)", paddingTop: "10px" }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="landing-section" style={{ textAlign: "center", padding: "80px 24px" }}>
        <div className="container" style={{ maxWidth: "680px" }}>
          <h2 style={{ fontSize: "30px", marginBottom: "12px" }}>Ready to Optimize Your Resume?</h2>
          <p style={{ fontSize: "16px", color: "var(--clr-muted)", marginBottom: "28px" }}>
            Compare your qualifications against your target role and get clear, actionable insights in minutes.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/upload")}
          >
            <UploadCloud size={18} />
            <span>Analyze My Resume Now</span>
          </button>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="navbar-brand">
                <span className="brand-dot" />
                <span>Resume Buddy</span>
              </div>
              <p className="footer-brand-desc">
                An AI-powered career intelligence platform designed to help job seekers understand ATS compatibility, identify skill gaps, and prepare for interviews.
              </p>
            </div>

            <div>
              <div className="footer-col-title">Analysis</div>
              <ul className="footer-links-list">
                <li className="footer-link-item"><Link to="/upload">Upload Resume</Link></li>
                <li className="footer-link-item"><Link to="/upload">ATS Scanner</Link></li>
                <li className="footer-link-item"><Link to="/upload">Recruiter Review</Link></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Resources</div>
              <ul className="footer-links-list">
                <li className="footer-link-item"><Link to="/features">Features</Link></li>
                <li className="footer-link-item"><Link to="/help">Help &amp; FAQs</Link></li>
                <li className="footer-link-item"><Link to="/about">About Us</Link></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Platform</div>
              <ul className="footer-links-list">
                <li className="footer-link-item"><Link to="/login">Sign In</Link></li>
                <li className="footer-link-item"><Link to="/register">Create Account</Link></li>
                <li className="footer-link-item"><Link to="/dashboard/settings">Settings</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>&copy; {new Date().getFullYear()} Resume Buddy. Minimal SaaS Career Intelligence.</span>
            <span>All evaluations are estimates. No hiring outcomes guaranteed.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
