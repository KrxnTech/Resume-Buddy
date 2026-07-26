import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import ResumeUpload from "../components/ResumeUpload";
import JobDescription from "../components/JobDescription";
import AnalyzeButton from "../components/AnalyzeButton";

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
      <div className="upload-container-header">
        <h2>Resume Optimizer Scan <i class="fa-solid fa-qrcode"></i></h2>
        <p>Upload your resume in "PDF Format" and Paste a target Job Description - Our Resume AI Parser checks Formatting - Compatibility and Suggests Rewrites OverAll Resume Optimization Using Analyzer Buddy</p>
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
              <li>Upload standard text PDFs - Please Avoid Scans/Images <i class="fa-solid fa-ban"></i></li>
              <li>Provide Full Job Description Texts for "Comprehensive key term Coverage"</li>
              <li>Calculations evaluate Skills - Project Descriptions Formatting Rules and Profile Presence</li>
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
              <p>Groq Llama-3.3-70B is Evaluating ATS alignment and parsing profile entries ... </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
