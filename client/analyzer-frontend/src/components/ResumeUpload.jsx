import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, Trash2, ArrowUpRight, Clipboard } from "lucide-react";

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

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function ResumeUpload({ setResume, resume, resumeText, setResumeText }) {
  const [activeTab, setActiveTab] = useState(resumeText && !resume ? "paste" : "upload");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setResume(file);

    // If text-like file, read contents directly as well
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setResume(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handlePasteSample = () => {
    if (setResumeText) {
      setResumeText(SAMPLE_RESUME);
      setActiveTab("paste");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <label className="form-label" style={{ marginBottom: 0, fontWeight: 600 }}>
          Resume Document
        </label>
        <div style={{ display: "flex", gap: "0.25rem", background: "var(--color-bg-secondary)", padding: "2px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
          <button
            type="button"
            className="btn-link"
            onClick={() => setActiveTab("upload")}
            style={{
              padding: "4px 10px",
              fontSize: "0.78rem",
              fontWeight: 500,
              borderRadius: "4px",
              background: activeTab === "upload" ? "var(--color-bg-primary)" : "transparent",
              color: activeTab === "upload" ? "var(--color-primary)" : "var(--color-text-muted)",
              boxShadow: activeTab === "upload" ? "var(--shadow-sm)" : "none",
            }}
          >
            Upload File
          </button>
          <button
            type="button"
            className="btn-link"
            onClick={() => setActiveTab("paste")}
            style={{
              padding: "4px 10px",
              fontSize: "0.78rem",
              fontWeight: 500,
              borderRadius: "4px",
              background: activeTab === "paste" ? "var(--color-bg-primary)" : "transparent",
              color: activeTab === "paste" ? "var(--color-primary)" : "var(--color-text-muted)",
              boxShadow: activeTab === "paste" ? "var(--shadow-sm)" : "none",
            }}
          >
            Paste Text
          </button>
        </div>
      </div>

      {activeTab === "upload" ? (
        <div>
          <div
            className={`upload-zone ${dragOver ? "drag-over" : ""} ${resume ? "has-file" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            style={{ cursor: "pointer" }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleChange}
            />

            {resume ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-success)" }}>
                  <CheckCircle2 size={22} />
                </div>
                <div style={{ fontWeight: 600, color: "var(--color-heading)", fontSize: "0.95rem" }}>
                  {resume.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                  Size: {formatFileSize(resume.size)} • PDF / Document Ready
                </div>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                  >
                    Replace File
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleRemoveFile}
                    style={{ color: "var(--color-error)" }}
                  >
                    <Trash2 size={13} style={{ marginRight: "4px" }} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
                  <UploadCloud size={24} />
                </div>
                <div style={{ fontWeight: 600, color: "var(--color-heading)", fontSize: "0.95rem" }}>
                  Choose a file or drag & drop here
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                  PDF, TXT, DOCX supported up to 10MB
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: "0.5rem" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              Backend size limit: 10MB (Memory buffer parsed)
            </span>
            <button
              type="button"
              onClick={handlePasteSample}
              className="btn-link"
              style={{ fontSize: "0.8rem", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "2px" }}
            >
              Use Sample Resume <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <textarea
            className="form-textarea"
            placeholder="Paste your full resume text here (Summary, Technical Skills, Experience, Education)..."
            value={resumeText || ""}
            onChange={(e) => {
              if (setResumeText) setResumeText(e.target.value);
            }}
            rows={10}
            style={{ minHeight: "180px", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.5 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
              {resumeText ? `${resumeText.length} characters entered` : "No text pasted"}
            </span>
            <button
              type="button"
              onClick={handlePasteSample}
              className="btn-link"
              style={{ fontSize: "0.8rem", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "2px" }}
            >
              Paste Sample Resume <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
