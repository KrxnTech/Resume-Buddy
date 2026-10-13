import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalysis } from "../hooks/useAnalysis";
import { generateAtsResumePdf } from "../utils/pdfGenerator";
import { modifyOriginalResumePdf } from "../utils/pdfModifier";
import UpdatedResumePreview from "../components/UpdatedResumePreview";

function ExportReport() {
  const {
    resume,
    canonicalResume,
    originalResume,
    acceptedChanges,
    resumeVersion,
    resetAllChanges,
    recalculateAtsScore,
    recalculatedAtsScore,
  } = useAnalysis();

  const [showResumePreview, setShowResumePreview] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  const [modifyingOriginal, setModifyingOriginal] = useState(false);
  const [originalDownloadSuccess, setOriginalDownloadSuccess] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadModifiedOriginalPdf = async () => {
    if (!resume) {
      alert("No uploaded resume PDF found in this session.");
      return;
    }
    setModifyingOriginal(true);
    setOriginalDownloadSuccess(null);
    try {
      const fileName = await modifyOriginalResumePdf(
        resume,
        acceptedChanges,
        canonicalResume,
        resumeVersion
      );
      setOriginalDownloadSuccess(fileName);
    } catch (err) {
      console.error("PDF Modification error:", err);
      alert(`Failed to modify PDF: ${err.message}`);
    } finally {
      setModifyingOriginal(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!canonicalResume) return;
    setDownloading(true);
    setDownloadSuccess(null);

    setTimeout(() => {
      try {
        const fileName = generateAtsResumePdf(canonicalResume, resumeVersion);
        setDownloadSuccess(fileName);
      } catch (err) {
        console.error("PDF generation error:", err);
      } finally {
        setDownloading(false);
      }
    }, 350);
  };

  const updatedSectionsList = Array.from(
    new Set(acceptedChanges.map((c) => c.section.charAt(0).toUpperCase() + c.section.slice(1)))
  );

  return (
    <motion.div
      className="page-detail-wrapper export-workspace-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Banner */}
      <div className="detail-header-desc">
        <div className="kinetic-eyebrow">EXPORT &amp; ARTIFACT STUDIO</div>
        <h3 className="kinetic-section-title">Resume Export &amp; Audit Workspace</h3>
        <p>
          Download your updated ATS-friendly Resume PDF with accepted improvements, or export your full recruiter analysis and candidate dossier.
        </p>
      </div>

      {/* Accepted Changes Summary Hero Banner */}
      {canonicalResume && (
        <div className="export-version-hero-card">
          <div className="export-ver-top">
            <div className="export-ver-pill-group">
              <span className="export-ver-badge">RESUME VERSION {resumeVersion}</span>
              <span className="export-status-badge ready">● ATS-Ready PDF</span>
              {recalculatedAtsScore && (
                <span className="export-status-badge boost">⚡ ATS Score: {recalculatedAtsScore}%</span>
              )}
            </div>
            <div className="export-ver-actions">
              {acceptedChanges.length > 0 && (
                <button
                  type="button"
                  className="export-link-btn"
                  onClick={() => setShowHistoryModal(true)}
                >
                  📜 View Change Log ({acceptedChanges.length})
                </button>
              )}
              {acceptedChanges.length > 0 && (
                <button
                  type="button"
                  className="export-link-btn danger"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to revert all accepted changes and restore your pristine uploaded resume?")) {
                      resetAllChanges();
                    }
                  }}
                >
                  ↶ Reset All Changes
                </button>
              )}
            </div>
          </div>

          <div className="export-ver-body">
            <h4>
              {acceptedChanges.length === 0
                ? "Your baseline resume is ready for ATS-friendly PDF export."
                : `Your resume contains ${acceptedChanges.length} accepted AI-powered improvements.`}
            </h4>
            {updatedSectionsList.length > 0 && (
              <div className="updated-sections-chips-row">
                <span className="chips-label">Sections Updated:</span>
                {updatedSectionsList.map((sec, i) => (
                  <span key={i} className="updated-section-pill">
                    ✓ {sec}
                  </span>
                ))}
              </div>
            )}
            <div className="export-checklist-row">
              <span className="chk-item">✓ {acceptedChanges.length} Accepted Changes Applied</span>
              <span className="chk-item">✓ Clean Single-Column ATS Layout</span>
              <span className="chk-item">✓ Selectable Vector Typography</span>
              <span className="chk-item">✓ Professional Filename Generated</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Export Option Cards Grid */}
      <div className="export-options-grid">
        {/* Card 1: MODIFIED ORIGINAL RESUME PDF (Applies changes to uploaded document) */}
        <div className="export-feature-card primary-card" style={{ borderColor: "var(--clr-accent)" }}>
          <div className="export-card-top-icon">⚡</div>
          <div className="export-card-content">
            <span className="export-card-tag" style={{ background: "var(--clr-accent)", color: "#000" }}>YOUR ORIGINAL PDF</span>
            <h4>Modified Original Resume PDF</h4>
            <p>
              Directly applies your accepted AI rewrites and enhancements to the actual PDF file you uploaded, preserving your layout and generating an updated document.
            </p>

            <div className="export-card-stats-row">
              <div className="mini-stat">
                <span className="stat-label">Source File</span>
                <span className="stat-value" style={{ fontSize: "0.8rem", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {resume?.name || "Uploaded PDF"}
                </span>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Rewrites</span>
                <span className="stat-value">{acceptedChanges.length} Merged</span>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Engine</span>
                <span className="stat-value">pdf-lib Vector</span>
              </div>
            </div>

            {originalDownloadSuccess && (
              <div className="export-card-success">
                ✓ Downloaded <strong>{originalDownloadSuccess}</strong>
              </div>
            )}

            <div className="export-card-btns-row">
              <button
                type="button"
                className="export-btn primary"
                onClick={handleDownloadModifiedOriginalPdf}
                disabled={modifyingOriginal}
                style={{ width: "100%" }}
              >
                {modifyingOriginal ? "Modifying Your Original PDF..." : `📥 Download Modified PDF (${acceptedChanges.length} Edits)`}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: DEDICATED ATS-FRIENDLY RESUME PDF EXPORT */}
        <div className="export-feature-card">
          <div className="export-card-top-icon">📄</div>
          <div className="export-card-content">
            <span className="export-card-tag">STANDARDIZED ATS</span>
            <h4>ATS Vector Clean PDF</h4>
            <p>
              Reconstructs your resume into a clean single-column machine-readable layout with verified typography for 100% automated parsing systems.
            </p>

            <div className="export-card-stats-row">
              <div className="mini-stat">
                <span className="stat-label">Version</span>
                <span className="stat-value">v{resumeVersion}</span>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Improvements</span>
                <span className="stat-value">{acceptedChanges.length} Applied</span>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Format</span>
                <span className="stat-value">Single Column</span>
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
                className="export-btn secondary"
                onClick={() => setShowResumePreview((prev) => !prev)}
              >
                {showResumePreview ? "Hide Preview" : "👁️ Preview ATS"}
              </button>
              <button
                type="button"
                className="export-btn outline"
                onClick={handleDownloadPdf}
                disabled={downloading}
              >
                {downloading ? "Generating..." : "📥 Download ATS"}
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

      {/* Live Canonical Resume Preview Section */}
      <AnimatePresence>
        {showResumePreview && canonicalResume && (
          <motion.div
            className="export-preview-full-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="preview-heading-bar">
              <h4>Live Canonical Resume Preview (What will be in your downloaded PDF)</h4>
              <button type="button" className="close-preview-btn" onClick={() => setShowResumePreview(false)}>
                ✕ Close Preview
              </button>
            </div>

            <UpdatedResumePreview
              canonicalResume={canonicalResume}
              originalResume={originalResume}
              acceptedChanges={acceptedChanges}
              resumeVersion={resumeVersion}
              onReset={resetAllChanges}
              onRecalculate={recalculateAtsScore}
              recalculatedAtsScore={recalculatedAtsScore}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Changes History Log Modal */}
      {showHistoryModal && (
        <div className="interview-modal-backdrop">
          <div className="interview-modal-box history-log-modal">
            <div className="modal-top-row">
              <h3>Accepted Improvements Log (v{resumeVersion})</h3>
              <button type="button" className="modal-close-icon" onClick={() => setShowHistoryModal(false)}>
                ✕
              </button>
            </div>
            <p>The following AI rewrite suggestions were accepted and merged into your active canonical resume:</p>

            <div className="change-log-list">
              {acceptedChanges.map((c, i) => (
                <div key={i} className="change-log-item">
                  <div className="change-log-top">
                    <span className="log-sec-pill">{c.section.toUpperCase()}</span>
                    <span className="log-time">{new Date(c.acceptedAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="log-diff-preview">
                    <p className="log-orig"><strong>Original:</strong> {c.originalValue || "N/A"}</p>
                    <p className="log-prop"><strong>Accepted:</strong> {c.proposedValue}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-actions-row">
              <button type="button" className="modal-btn secondary" onClick={() => setShowHistoryModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ExportReport;
