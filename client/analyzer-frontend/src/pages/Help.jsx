import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronUp, CheckCircle2, XCircle, ArrowRight, HelpCircle } from "lucide-react";
import TopNavbar from "../components/TopNavbar";
import Footer from "../components/Footer";

function Help() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How does Resume Buddy calculate ATS match percentages?",
      a: "Our engine maps your verified skills, experience bullet points, and section structures directly against standard parser requirements (Greenhouse, Lever, Workday) and target Job Descriptions. Scores are weighted across skills alignment (40%), experience depth (30%), project validation (15%), and formatting compliance (15%).",
    },
    {
      q: "Does Resume Buddy store or share my resume data?",
      a: "No. Resume files and pasted text are parsed securely in-memory using Groq LLM inference without persistent retention. We do not sell or publicize your personal documents. Your analysis remains private to your active browser session.",
    },
    {
      q: "How does the AI Mock Interviewer generate questions?",
      a: "Rather than asking generic textbook questions, our interviewer reviews your structured candidate profile and generates dynamic, contextual questions based on the specific technologies, architectural claims, and metrics you documented in your projects.",
    },
    {
      q: "What format of resume works best?",
      a: "Standard single-column PDF files generated from Google Docs, Word, LaTeX, or Figma with clean selectable text work best. Avoid image-only scanned PDFs without OCR text layers.",
    },
    {
      q: "Can I use Resume Buddy without a target job description?",
      a: "Yes. If you upload only a resume, Resume Buddy analyzes your profile against general industry benchmarks for your indicated role, evaluating ATS health, recruiter readiness, and interview preparation questions.",
    },
    {
      q: "How does voice interaction work?",
      a: "Both Career Copilot and Mock Interview Mode support native Web Speech browser APIs. You can listen to questions synthesized directly through your audio output, and dictate responses using your microphone.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ background: "var(--color-bg-primary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNavbar />

      <main style={{ flex: 1, padding: "3rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Help &amp; Knowledge Base
            </span>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 700, color: "var(--color-heading)", margin: "0.5rem 0 1rem" }}>
              Frequently Asked Questions
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.05rem", maxWidth: "620px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
              Find clear answers regarding ATS scoring mechanics, interview simulations, privacy, and formatting standards.
            </p>

            {/* Search Input */}
            <div style={{ maxWidth: "540px", margin: "0 auto", position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
              <input
                type="text"
                className="form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. ATS score, privacy, PDF format)..."
                style={{ paddingLeft: "42px", height: "46px", fontSize: "0.95rem" }}
              />
            </div>
          </div>

          {/* FAQ Accordions */}
          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "1.25rem" }}>
              General Questions
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filteredFaqs.length === 0 ? (
                <div className="card" style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  No matching questions found for "{searchQuery}".
                </div>
              ) : (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div key={idx} className="card" style={{ overflow: "hidden", transition: "border-color 0.2s" }}>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                        style={{
                          width: "100%",
                          padding: "1.25rem 1.5rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-heading)" }}>
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp size={18} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                        ) : (
                          <ChevronDown size={18} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                        )}
                      </button>

                      {isOpen && (
                        <div style={{ padding: "0 1.5rem 1.25rem", borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                          <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--color-text)", lineHeight: 1.65 }}>
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ATS Best Practices Guide */}
          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "1.25rem" }}>
              ATS Formatting Guidelines
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {/* Dos */}
              <div className="card" style={{ padding: "1.5rem", borderTop: "3px solid var(--color-success)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <CheckCircle2 size={18} style={{ color: "var(--color-success)" }} />
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
                    Recommended Practices
                  </h3>
                </div>
                <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.88rem", color: "var(--color-text)", lineHeight: 1.6 }}>
                  <li>Use standard section headings: Professional Summary, Skills, Experience, Education.</li>
                  <li>Quantify impact with numbers, percentages, or scale metrics in bullet points.</li>
                  <li>Explicitly list developer tools and frameworks in a dedicated Skills block.</li>
                  <li>Provide clickable, clean URLs to GitHub, LinkedIn, or portfolio projects.</li>
                </ul>
              </div>

              {/* Don'ts */}
              <div className="card" style={{ padding: "1.5rem", borderTop: "3px solid var(--color-error)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <XCircle size={18} style={{ color: "var(--color-error)" }} />
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
                    Common Pitfalls to Avoid
                  </h3>
                </div>
                <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.88rem", color: "var(--color-text)", lineHeight: 1.6 }}>
                  <li>Embedding essential text inside images, non-OCR scans, or raster graphics.</li>
                  <li>Using multi-column nested tables that confuse standard left-to-right parser pipelines.</li>
                  <li>Visual skill percentage bars (e.g. "React: 80%") with no context.</li>
                  <li>Vague non-action bullet points like "Assisted team with daily tasks".</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "2.5rem 2rem", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
              Ready to test your resume?
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem", margin: "0 auto 1.5rem", maxWidth: "480px" }}>
              Upload your document and run the analysis against real ATS parsing algorithms.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/upload")}
            >
              Analyze Your Resume <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Help;
