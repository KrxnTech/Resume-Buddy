import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Printer, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";
import { generateAtsResumePdf } from "../utils/pdfGenerator";

function ExportReport() {
  const { canonicalResume, resumeVersion } = useAnalysis();
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
    <div style={{ paddingBottom: "3rem" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
          <Link to="/dashboard" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>Dashboard</Link>
          <span>/</span>
          <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>Export Report</span>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-heading)", margin: "0 0 0.4rem" }}>
          Export Resume &amp; Analysis Report
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem", margin: 0, maxWidth: "720px", lineHeight: 1.5 }}>
          Download a standardized machine-readable ATS resume PDF or print your complete recruiter evaluation report.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {/* Card 1: Standardized ATS PDF */}
        <div className="card" style={{ padding: "1.75rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)", marginBottom: "1rem" }}>
            <FileText size={22} />
          </div>
          <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>Machine-Readable</span>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--color-heading)", margin: "0.25rem 0 0.5rem" }}>
            Standard ATS-Friendly PDF
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", lineHeight: 1.5, margin: "0 0 1.25rem" }}>
            Generates a clean single-column PDF formatted to ensure maximum parseability across automated applicant tracking systems.
          </p>

          <div style={{ background: "var(--color-bg-secondary)", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem", border: "1px solid var(--color-border)" }}>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span>Candidate:</span>
              <strong style={{ color: "var(--color-heading)" }}>{canonicalResume?.identity?.fullName || "Candidate"}</strong>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", display: "flex", justifyContent: "space-between" }}>
              <span>Layout:</span>
              <strong style={{ color: "var(--color-heading)" }}>Single-Column ATS Standard</strong>
            </div>
          </div>

          {downloadSuccess && (
            <div style={{ background: "#E8F5E9", color: "var(--color-success)", padding: "0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.82rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={16} /> Downloaded {downloadSuccess}
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDownloadPdf}
            disabled={downloading}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <Download size={16} /> {downloading ? "Generating PDF..." : "Download Clean ATS PDF"}
          </button>
        </div>

        {/* Card 2: Print Report & JSON */}
        <div className="card" style={{ padding: "1.75rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-heading)", marginBottom: "1rem" }}>
            <Printer size={22} />
          </div>
          <span className="badge badge-neutral" style={{ marginBottom: "0.5rem" }}>Full Summary</span>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--color-heading)", margin: "0.25rem 0 0.5rem" }}>
            Print Analysis Report
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", lineHeight: 1.5, margin: "0 0 1.25rem" }}>
            Print or save your complete executive career dossier including ATS compatibility scores, recruiter review, and skill gap charts.
          </p>

          <div style={{ background: "var(--color-bg-secondary)", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem", border: "1px solid var(--color-border)" }}>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span>Target Role:</span>
              <strong style={{ color: "var(--color-heading)" }}>{canonicalResume?.identity?.professionalTitle || "Software Engineer"}</strong>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", display: "flex", justifyContent: "space-between" }}>
              <span>Document Type:</span>
              <strong style={{ color: "var(--color-heading)" }}>Evaluation Audit</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrint}
              style={{ flex: 1, justifyContent: "center" }}
            >
              <Printer size={16} /> Print Report
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                const dataStr = JSON.stringify(canonicalResume, null, 2);
                const blob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${canonicalResume?.identity?.fullName || "Resume"}_Profile.json`;
                a.click();
              }}
              style={{ flex: 1, justifyContent: "center" }}
            >
              <Download size={16} /> Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportReport;
