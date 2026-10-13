import { useState, useRef } from "react";

const SAMPLE_RESUME = `ALEX MORGAN
Software Engineer | Full Stack Developer
Email: alex.morgan@example.com | Phone: +1 (555) 019-2834 | San Francisco, CA
GitHub: github.com/alexmorgan | LinkedIn: linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Full Stack Engineer with 4+ years of experience designing and deploying scalable web services, RESTful APIs, and cloud-native microservices. Proficient in Node.js, Express, React, TypeScript, and PostgreSQL with a strong focus on high-performance architecture and ATS compliance.

TECHNICAL SKILLS
• Languages: JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3
• Frameworks & Libraries: React, Node.js, Express, Next.js, Redux Toolkit
• Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, EC2), Docker
• Developer Tools: Git, GitHub, Jest, Postman, Linux, Vite, CI/CD pipelines

PROFESSIONAL EXPERIENCE
TechCore Solutions | Senior Backend Developer | 2022 – Present | San Francisco, CA
• Architected high-throughput REST APIs and asynchronous microservices processing 15M+ daily requests using Node.js, Express, and Redis caching.
• Optimized complex PostgreSQL queries and database indexing, decreasing 95th-percentile response latency by 38%.
• Implemented automated CI/CD deployment pipelines using GitHub Actions and Docker, reducing deployment cycle times from 45 to 10 minutes.

Apex Web Systems | Full Stack Engineer | 2020 – 2022 | Austin, TX
• Developed responsive user interfaces and modular client dashboards using React, TypeScript, and modern CSS variables.
• Integrated secure JWT-based authentication and role-based access control (RBAC) across 4 internal enterprise portals.
• Authored comprehensive unit and integration test suites using Jest and Supertest, achieving 88% overall code coverage.

EDUCATION
University of California, Berkeley
Bachelor of Science in Computer Science | 2016 – 2020 | GPA: 3.82 / 4.0

CERTIFICATIONS
• AWS Certified Solutions Architect – Associate (2023)
• Meta Certified Front-End Developer (2022)`;

function ResumeUpload({ setResume, resume, resumeText, setResumeText }) {
  const [activeTab, setActiveTab] = useState(resumeText ? "paste" : "upload");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setResume(file);

    // If text-like file, read contents directly
    if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        if (text && setResumeText) {
          setResumeText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handlePasteSample = () => {
    if (setResumeText) {
      setResumeText(SAMPLE_RESUME);
      setActiveTab("paste");
    }
  };

  return (
    <div>
      <div className="section-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Resume Input</span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className={`btn-subtle ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
            style={{
              background: activeTab === "upload" ? "var(--clr-accent)" : "transparent",
              color: activeTab === "upload" ? "#000" : "var(--clr-text-2)",
              border: "1px solid var(--clr-border)",
              padding: "0.2rem 0.6rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📁 File Upload
          </button>
          <button
            type="button"
            className={`btn-subtle ${activeTab === "paste" ? "active" : ""}`}
            onClick={() => setActiveTab("paste")}
            style={{
              background: activeTab === "paste" ? "var(--clr-accent)" : "transparent",
              color: activeTab === "paste" ? "#000" : "var(--clr-text-2)",
              border: "1px solid var(--clr-border)",
              padding: "0.2rem 0.6rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📋 Paste Text
          </button>
        </div>
      </div>

      {activeTab === "upload" ? (
        <div>
          <label
            className={`upload-zone ${dragOver ? "drag-over" : ""} ${resume ? "has-file" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".txt,.md,.pdf,.doc,.docx"
              className="upload-input"
              onChange={handleChange}
            />

            {resume ? (
              <>
                <span className="upload-icon">✅</span>
                <div className="upload-filename">
                  <span className="upload-filename-icon">📎</span>
                  {resume.name}
                </div>
                <span style={{ fontSize: "0.78rem", color: "var(--clr-text-3)" }}>
                  Click or drag to replace
                </span>
              </>
            ) : (
              <>
                <span className="upload-icon">☁️</span>
                <span className="upload-text-main">Drop your resume here</span>
                <span className="upload-text-sub">Supports .txt, .md, .pdf, or click to browse</span>
              </>
            )}
          </label>

          <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handlePasteSample}
              style={{
                background: "none",
                border: "none",
                color: "var(--clr-accent)",
                fontSize: "0.75rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Use Sample Software Engineer Resume ↗
            </button>
          </div>
        </div>
      ) : (
        <div>
          <textarea
            className="job-desc-textarea"
            placeholder="Paste your full resume text here (Summary, Experience, Skills, Education)..."
            value={resumeText || ""}
            onChange={(e) => {
              if (setResumeText) setResumeText(e.target.value);
            }}
            rows={10}
            style={{ minHeight: "180px", fontFamily: "monospace", fontSize: "0.82rem" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--clr-text-3)" }}>
              {resumeText ? `${resumeText.length} characters` : "No text pasted"}
            </span>
            <button
              type="button"
              onClick={handlePasteSample}
              style={{
                background: "none",
                border: "none",
                color: "var(--clr-accent)",
                fontSize: "0.75rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Paste Sample Resume ↗
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
