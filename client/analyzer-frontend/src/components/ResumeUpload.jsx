import { useState, useRef } from "react";

function ResumeUpload({ setResume, resume }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }
    setResume(file);
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  return (
    <div>
      <div className="section-label">
        Resume
      </div>

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
          accept=".pdf"
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
              Click to replace
            </span>
          </>
        ) : (
          <>
            <span className="upload-icon">☁️</span>
            <span className="upload-text-main">Drop your PDF here</span>
            <span className="upload-text-sub">or click to browse</span>
          </>
        )}
      </label>
    </div>
  );
}

export default ResumeUpload;
