import { useState } from "react";
import { generateAtsResumePdf } from "../utils/pdfGenerator";

export default function UpdatedResumePreview({
  canonicalResume,
  originalResume,
  acceptedChanges = [],
  resumeVersion = 1,
  onReset,
  onRecalculate,
  recalculatedAtsScore,
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  if (!canonicalResume) return null;

  const id = canonicalResume.identity || {};
  const isModified = (sectionKey) => acceptedChanges.some((c) => c.section === sectionKey);

  const handleDownload = () => {
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
    }, 300);
  };

  return (
    <div className="updated-resume-preview-container">
      {/* Top Banner Actions */}
      <div className="preview-top-toolbar">
        <div className="preview-meta-group">
          <span className="preview-ver-tag">RESUME VERSION {resumeVersion}</span>
          <span className={`preview-changes-badge ${acceptedChanges.length > 0 ? "active" : ""}`}>
            {acceptedChanges.length === 1 ? "1 Change Applied" : `${acceptedChanges.length} Changes Applied`}
          </span>
          {recalculatedAtsScore && (
            <span className="preview-ats-boost-badge">
              ⚡ Recalculated ATS Match: <strong>{recalculatedAtsScore}%</strong>
            </span>
          )}
        </div>

        <div className="preview-actions-group">
          {onRecalculate && acceptedChanges.length > 0 && !recalculatedAtsScore && (
            <button type="button" className="preview-toolbar-btn secondary" onClick={onRecalculate}>
              ⚡ Recalculate ATS Score
            </button>
          )}

          {acceptedChanges.length > 0 && onReset && (
            <button
              type="button"
              className="preview-toolbar-btn danger"
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all accepted AI changes and restore your original uploaded resume?")) {
                  onReset();
                }
              }}
            >
              ↶ Reset All Changes
            </button>
          )}

          <button
            type="button"
            className="preview-toolbar-btn primary"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? "Generating PDF..." : "📥 Download New PDF"}
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="preview-success-banner">
          ✓ Generated and downloaded <strong>{downloadSuccess}</strong> with all accepted improvements!
        </div>
      )}

      {/* Actual Paper Resume Preview */}
      <div className="paper-resume-sheet">
        {/* Header Name & Title */}
        <div className="resume-sheet-header">
          <h1 className="resume-sheet-name">{id.fullName || "Candidate Name"}</h1>
          {id.professionalTitle && <p className="resume-sheet-title">{id.professionalTitle}</p>}
          <div className="resume-sheet-contacts">
            {[id.email, id.phone, id.location, id.github, id.linkedin, id.portfolio]
              .filter(Boolean)
              .map((contact, i) => (
                <span key={i} className="sheet-contact-item">
                  {contact.replace(/^https?:\/\//, "")}
                </span>
              ))}
          </div>
        </div>

        {/* Professional Summary */}
        {canonicalResume.professionalSummary && (
          <div className={`resume-sheet-section ${isModified("summary") ? "highlight-modified" : ""}`}>
            <div className="sheet-sec-heading-row">
              <h3 className="sheet-sec-heading">PROFESSIONAL SUMMARY</h3>
              {isModified("summary") && <span className="modified-indicator-tag">✓ Updated via AI</span>}
            </div>
            <p className="sheet-summary-text">{canonicalResume.professionalSummary}</p>
          </div>
        )}

        {/* Skills */}
        {canonicalResume.skills && (
          <div className={`resume-sheet-section ${isModified("skills") ? "highlight-modified" : ""}`}>
            <div className="sheet-sec-heading-row">
              <h3 className="sheet-sec-heading">TECHNICAL SKILLS</h3>
              {isModified("skills") && <span className="modified-indicator-tag">✓ Reorganized via AI</span>}
            </div>
            <div className="sheet-skills-list">
              {Object.entries(canonicalResume.skills).map(([key, items]) => {
                if (!Array.isArray(items) || items.length === 0) return null;
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  <div key={key} className="sheet-skill-row">
                    <strong>{formattedKey}:</strong> {items.join(", ")}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Experience */}
        {Array.isArray(canonicalResume.experience) && canonicalResume.experience.length > 0 && (
          <div className={`resume-sheet-section ${isModified("experience") ? "highlight-modified" : ""}`}>
            <div className="sheet-sec-heading-row">
              <h3 className="sheet-sec-heading">PROFESSIONAL EXPERIENCE</h3>
              {isModified("experience") && <span className="modified-indicator-tag">✓ Updated via AI</span>}
            </div>
            <div className="sheet-experience-stack">
              {canonicalResume.experience.map((exp, idx) => (
                <div key={idx} className="sheet-experience-item">
                  <div className="sheet-item-header">
                    <strong>{exp.title} - {exp.company}</strong>
                    <span className="sheet-item-meta">{[exp.period, exp.location].filter(Boolean).join(" | ")}</span>
                  </div>
                  <ul className="sheet-bullets-list">
                    {(Array.isArray(exp.highlights) ? exp.highlights : [exp.description || ""]).map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {Array.isArray(canonicalResume.projects) && canonicalResume.projects.length > 0 && (
          <div className={`resume-sheet-section ${isModified("projects") ? "highlight-modified" : ""}`}>
            <div className="sheet-sec-heading-row">
              <h3 className="sheet-sec-heading">KEY TECHNICAL PROJECTS</h3>
              {isModified("projects") && <span className="modified-indicator-tag">✓ Updated via AI</span>}
            </div>
            <div className="sheet-projects-stack">
              {canonicalResume.projects.map((proj, idx) => (
                <div key={idx} className="sheet-project-item">
                  <div className="sheet-item-header">
                    <strong>{proj.name}</strong>
                    {proj.technologies?.length > 0 && (
                      <span className="sheet-item-meta">({proj.technologies.join(", ")})</span>
                    )}
                  </div>
                  <p className="sheet-proj-desc">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {Array.isArray(canonicalResume.achievements) && canonicalResume.achievements.length > 0 && (
          <div className={`resume-sheet-section ${isModified("achievements") ? "highlight-modified" : ""}`}>
            <div className="sheet-sec-heading-row">
              <h3 className="sheet-sec-heading">KEY ACHIEVEMENTS &amp; RECOGNITION</h3>
              {isModified("achievements") && <span className="modified-indicator-tag">✓ Updated via AI</span>}
            </div>
            <ul className="sheet-bullets-list">
              {canonicalResume.achievements.map((ach, idx) => (
                <li key={idx}>{typeof ach === "string" ? ach : ach.description || ""}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Education */}
        {Array.isArray(canonicalResume.education) && canonicalResume.education.length > 0 && (
          <div className="resume-sheet-section">
            <h3 className="sheet-sec-heading">EDUCATION</h3>
            <div className="sheet-education-stack">
              {canonicalResume.education.map((edu, idx) => (
                <div key={idx} className="sheet-education-item">
                  <div className="sheet-item-header">
                    <strong>{edu.institution}</strong>
                    <span className="sheet-item-meta">{[edu.period, edu.grade].filter(Boolean).join(" | ")}</span>
                  </div>
                  <p className="sheet-edu-degree">{edu.degree}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
