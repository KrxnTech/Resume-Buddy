import ResumeUpload from "./components/ResumeUpload";
import JobDescription from "./components/JobDescription";
import AnalyzeButton from "./components/AnalyzeButton";
import ResultBox from "./components/ResultBox";
import { useState } from "react";
import "./App.css";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);

  return (
    <div className="Main_div">
      <h1>AI Resume Analyzer</h1>

      <ResumeUpload setResume={setResume} />
      <JobDescription jobDesc={jobDesc} setJobDesc={setJobDesc} />
      <AnalyzeButton resume={resume} jobDesc={jobDesc} setResult={setResult} />

      <ResultBox result={result} />
    </div>
  );
}

export default App;
