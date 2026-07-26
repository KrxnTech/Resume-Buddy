import { createContext, useState, useEffect } from "react";

export const AnalysisContext = createContext();

export function AnalysisProvider({ children }) {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto load mock state for demo/development if needed, but standard is empty
  // Helper to check if analysis results exist
  const hasAnalysis = !!result?.analysis;

  return (
    <AnalysisContext.Provider
      value={{
        resume,
        setResume,
        jobDesc,
        setJobDesc,
        result,
        setResult,
        loading,
        setLoading,
        error,
        setError,
        hasAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}
