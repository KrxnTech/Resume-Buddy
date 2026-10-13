import { useState } from "react";
import { motion } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";
import { generateAtsResumePdf } from "../utils/pdfGenerator";

function ExportReport() {
  const {
    resume,
    canonicalResume,
    resumeVersion,
  } = useAnalysis();

  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (!canonicalResume) return;
    setDownloading(true);
    setDownloadSuccess(null);

    setTimeout(() => {
      try {
        const fileName = generateAtsResumePdf(canonicalResume, resumeVersion || 1);
        setDownloadSuccess(fileName);
      } catch (err) {
        console.error("PDF generation error:", err);
        alert(`Failed to generate PDF: ${err.message}`);
      } finally {
        setDownloading(false);
      }
    }, 300);
  };

  return (
    <motion.div
      className="export-page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top Banner */}
      <div className="export-header-banner">
        <div>
          <span className="kinetic-eyebrow">DOCUMENT EXPORT &amp; REPORTING</span>
          <h2 style={{ fontSize: "1.6rem", margin: "0.25rem 0 0.5rem" }}>
            Export Intelligence Dossier
          </h2>
          <p style={{ color: "var(--clr-text-2)", fontSize: "0.9rem", maxWidth: "680px" }}>
            Download a standardized machine-readable ATS resume or print an executive recruiter audit dossier.
          </p>
        </div>
      </div>

      {/* Main Export Option Cards Grid */}
      <div className="export-options-grid">
        {/* Card 1: DEDICATED ATS-FRIENDLY RESUME PDF EXPORT */}
        <div className="export-feature-card primary-card" style={{ borderColor: "var(--clr-accent)" }}>
          <div className="export-card-top-icon">📄</div>
          <div className="export-card-content">
            <span className="export-card-tag" style={{ background: "var(--clr-accent)", color: "#000" }}>STANDARDIZED ATS</span>
            <h4>ATS Vector Clean PDF</h4>
            <p>
              Reconstructs your resume into a clean single-column machine-readable layout with verified typography for automated screening systems.
            </p>

            <div className="export-card-stats-row">
              <div className="mini-stat">
                <span className="stat-label">Candidate</span>
                <span className="stat-value" style={{ fontSize: "0.8rem", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {canonicalResume?.identity?.fullName || "Candidate"}
                </span>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Format</span>
                <span className="stat-value">Single Column</span>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Typography</span>
                <span className="stat-value">ATS Safe</span>
              </div>
            </div>

            {downloadSuccess && (
              <div className="export-card-success">
                ✓ Downloaded <strong>{downloadSuccess}</strong>
              </div>
            )}

            <div className="export-card-btns-row">
              <button
                type="button"
                className="export-btn primary"
                onClick={handleDownloadPdf}
                disabled={downloading}
                style={{ width: "100%" }}
              >
                {downloading ? "Generating Clean PDF..." : "📥 Download Standardized ATS PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Candidate Analysis & Recruiter Summary Dossier */}
        <div className="export-feature-card">
          <div className="export-card-top-icon">📊</div>
          <div className="export-card-content">
            <span className="export-card-tag">EXECUTIVE DOSSIER</span>
            <h4>Full Audit &amp; Recruiter Report</h4>
            <p>
              Export a complete PDF summary detailing your ATS match scores, missing technical skills, recruiter review, and mock interview performance.
            </p>

            <div className="export-card-stats-row">
              <div className="mini-stat">
                <span className="stat-label">Candidate</span>
                <span className="stat-value">{canonicalResume?.identity?.fullName || "Active"}</span>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Target Role</span>
                <span className="stat-value">{canonicalResume?.identity?.professionalTitle || "Engineer"}</span>
              </div>
            </div>

            <div className="export-card-btns-row">
              <button type="button" className="export-btn secondary" onClick={handlePrint}>
                🖨️ Print Full Audit Dossier
              </button>
              <button
                type="button"
                className="export-btn outline"
                onClick={() => {
                  const dataStr = JSON.stringify(canonicalResume, null, 2);
                  const blob = new Blob([dataStr], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${canonicalResume?.identity?.fullName || "Resume"}_Canonical.json`;
                  a.click();
                }}
              >
                📦 Export JSON Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ExportReport;
