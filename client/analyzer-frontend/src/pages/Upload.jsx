import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import ResumeUpload from "../components/ResumeUpload";
import JobDescription from "../components/JobDescription";
import AnalyzeButton from "../components/AnalyzeButton";
import ThemeToggle from "../components/ThemeToggle";

function Upload() {
  const { resume, setResume, jobDesc, setJobDesc, result, setResult, loading, setLoading, error, setError, hasAnalysis } = useAnalysis();
  const navigate = useNavigate();

  // If result becomes available, navigate immediately to dashboard overview
  useEffect(() => {
    if (hasAnalysis) {
      navigate("/dashboard");
    }
  }, [hasAnalysis, navigate]);

  return (
    <div className="upload-page-wrap">
      {/* Top action bar */}
      <div style={{ width: "100%", maxWidth: "1100px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <Link to="/" style={{ textDecoration: "none", color: "var(--clr-text-2)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 500 }}>
          ← Back to Home
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ThemeToggle compact={true} />
        </div>
      </div>

      <div className="upload-container-header">
        <h2>Resume Optimizer Scan <i className="fa-solid fa-qrcode"></i></h2>
        <p>Upload your resume in "PDF Format" and Paste a target Job Description - Our Resume AI Parser checks Formatting, Compatibility, and Suggests Rewrites for OverAll Resume Optimization.</p>
      </div>

      <div className="upload-card-layout">
        {/* Upload Column */}
        <div className="upload-input-section">
          <ResumeUpload resume={resume} setResume={setResume} />
          <hr className="divider" style={{ margin: "1.25rem 0" }} />
          <JobDescription jobDesc={jobDesc} setJobDesc={setJobDesc} />
        </div>

        {/* Trigger/Status Column */}
        <div className="upload-action-section">
          <div className="upload-tip-box">
            <h4>Optimizer Tips</h4>
            <ul>
              <li>Upload standard text PDFs - Please Avoid Scans/Images <i className="fa-solid fa-ban"></i></li>
              <li>Provide Full Job Description Texts for "Comprehensive key term Coverage"</li>
              <li>Calculations evaluate Skills, Project Descriptions, Formatting Rules, and Profile Presence</li>
            </ul>
          </div>

          <AnalyzeButton
            resume={resume}
            jobDesc={jobDesc}
            setResult={setResult}
            setLoading={setLoading}
            setError={setError}
            loading={loading}
          />

          {error && (
            <div className="error-banner" role="alert" style={{ marginTop: "1rem" }}>
              <span></span>
              {error}
            </div>
          )}

          {loading && (
            <div className="upload-loading-overlay">
              <div className="spinner-glow" />
              <h3>Analyzing Resume Content ...</h3>
              <p>AI is evaluating ATS alignment and parsing profile entries ... </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
