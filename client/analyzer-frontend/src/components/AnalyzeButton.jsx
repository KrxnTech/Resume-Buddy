function AnalyzeButton({ resume, jobDesc, setResult, setLoading, setError, loading }) {
  const isReady = resume && jobDesc.trim().length > 0;

  const handleAnalyze = async () => {
    if (!isReady || loading) return;

    setResult(null);
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDesc);

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const btnClass = `analyze-btn ${isReady && !loading ? "ready" : ""} ${loading ? "loading" : ""}`;

  return (
    <button className={btnClass} onClick={handleAnalyze} disabled={!isReady || loading}>
      <div className="btn-inner">
        {loading ? (
          <>
            <span className="btn-spinner" />
            Analyzing your resume…
          </>
        ) : (
          <>
            Analyze Resume
          </>
        )}
      </div>
    </button>
  );
}

export default AnalyzeButton;
