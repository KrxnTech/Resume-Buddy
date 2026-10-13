import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, AlertCircle, Loader2 } from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";
import ResumeUpload from "../components/ResumeUpload";
import JobDescription from "../components/JobDescription";
import AnalyzeButton from "../components/AnalyzeButton";

function Upload() {
  const {
    resume,
    setResume,
    resumeText,
    setResumeText,
    jobDesc,
    setJobDesc,
    result,
    setResult,
    loading,
    setLoading,
    error,
    setError,
    hasAnalysis,
  } = useAnalysis();
  const navigate = useNavigate();

  // If result becomes available, navigate immediately to dashboard overview
  useEffect(() => {
    if (hasAnalysis) {
      navigate("/dashboard");
    }
  }, [hasAnalysis, navigate]);

  return (
    <div style={{ background: "var(--color-bg-secondary)", minHeight: "100vh", padding: "2rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Navigation Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--color-text-muted)",
              fontSize: "0.88rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            Resume Buddy • Intelligence Engine
          </div>
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
            Analyze Your Resume
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", maxWidth: "680px", margin: 0, lineHeight: 1.5 }}>
            Upload your resume document and paste the target job description. The AI engine evaluates ATS compatibility, keyword match percentages, and recruiter alignment.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              background: "#FEE2E2",
              border: "1px solid #FCA5A5",
              color: "var(--color-error)",
              padding: "1rem 1.25rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.9rem",
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Analysis Error: </strong>
              {error}
            </div>
          </div>
        )}

        {/* Loading Overlay State if triggered */}
        {loading && (
          <div
            className="card"
            style={{
              padding: "3rem 2rem",
              textAlign: "center",
              marginBottom: "2rem",
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Loader2 size={36} className="animate-spin" style={{ color: "var(--color-primary)", margin: "0 auto 1.25rem", animation: "spin 1s linear infinite" }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
              Evaluating Resume Against Job Requirements...
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem", maxWidth: "520px", margin: "0 auto" }}>
              Parsing experience, calculating ATS compatibility, detecting skill matches, and preparing recruiter insights. This usually takes 5-10 seconds.
            </p>
          </div>
        )}

        {/* Two-Column Form Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem", alignItems: "start" }}>
          {/* Left Column: Resume Input */}
          <div className="card" style={{ padding: "1.75rem", background: "var(--color-bg-primary)" }}>
            <ResumeUpload
              resume={resume}
              setResume={setResume}
              resumeText={resumeText}
              setResumeText={setResumeText}
            />
          </div>

          {/* Right Column: Job Description & Action */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <div className="card" style={{ padding: "1.75rem", background: "var(--color-bg-primary)" }}>
              <JobDescription jobDesc={jobDesc} setJobDesc={setJobDesc} />
            </div>

            <div className="card" style={{ padding: "1.5rem", background: "var(--color-bg-primary)" }}>
              <AnalyzeButton
                resume={resume}
                resumeText={resumeText}
                jobDesc={jobDesc}
                setResult={setResult}
                setLoading={setLoading}
                setError={setError}
                loading={loading}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                  <ShieldCheck size={16} style={{ color: "var(--color-success)" }} />
                  <span>Private & securely parsed in-memory</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                  <Zap size={16} style={{ color: "var(--color-primary)" }} />
                  <span>Groq Llama 3 70B AI engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guidance / FAQ Footer note */}
        <div style={{ marginTop: "3rem", padding: "1.5rem", background: "var(--color-bg-primary)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-heading)", marginBottom: "0.5rem" }}>
            How analysis works
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.6 }}>
            Our engine extracts structured details from your resume — candidate identity, career history, technical proficiencies, and education. It then calculates mathematical keyword alignment against the target job description to compute realistic ATS scores and recruiter recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Upload;
