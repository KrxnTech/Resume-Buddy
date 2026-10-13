import { useAuth } from "../hooks/useAuth";
import { ArrowRight, Loader2 } from "lucide-react";

function AnalyzeButton({ resume, resumeText, jobDesc, setResult, setLoading, setError, loading }) {
  const { saveScanToAccount } = useAuth();
  const hasResume = (resume instanceof File) || (typeof resumeText === "string" && resumeText.trim().length >= 20);
  const isReady = hasResume && jobDesc && jobDesc.trim().length > 0;

  const handleAnalyze = async () => {
    if (!isReady || loading) return;

    setResult(null);
    setError(null);
    setLoading(true);

    const formData = new FormData();
    if (resume instanceof File) {
      formData.append("resume", resume);
    }
    if (resumeText && resumeText.trim()) {
      formData.append("resumeText", resumeText.trim());
    }
    formData.append("jobDescription", jobDesc);

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed. Please check your resume and try again.");
      }

      setResult(data);

      // Save scan record to user account if authenticated
      if (saveScanToAccount && data.analysis) {
        const score = Math.round((data.analysis.matchScore ?? 0.85) * 100);
        saveScanToAccount({
          fileName: resume?.name || "Pasted Resume Text",
          candidateName: data.analysis.candidateProfile?.identity?.fullName || "Candidate",
          targetRole: data.analysis.candidateProfile?.identity?.professionalTitle || "Software Engineer",
          atsScore: score,
          matchScore: score,
          acceptedChangesCount: 0,
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to connect to the analysis engine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <button
        type="button"
        className="btn btn-primary btn-lg"
        onClick={handleAnalyze}
        disabled={!isReady || loading}
        style={{
          width: "100%",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: "1rem",
          padding: "14px 24px",
          opacity: (!isReady || loading) ? 0.65 : 1,
          cursor: (!isReady || loading) ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
            Analyzing Resume with AI Engine...
          </>
        ) : (
          <>
            Analyze Resume <ArrowRight size={18} />
          </>
        )}
      </button>

      {!isReady && !loading && (
        <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", textAlign: "center", marginTop: "0.5rem", marginBottom: 0 }}>
          {!hasResume ? "Please provide a resume file or text" : "Please provide the target job description"} to enable analysis
        </p>
      )}
    </div>
  );
}

export default AnalyzeButton;
