import { useMemo, useState } from "react";
import { Layers } from "lucide-react";
import { buildSectionAnalysis } from "../utils/sectionAnalyzer";
import SectionAnalysisCard from "./SectionAnalysisCard";

function InteractiveSectionAnalyzer({ analysis }) {
  const [openSection, setOpenSection] = useState("skills");

  const insights = useMemo(() => buildSectionAnalysis(analysis), [analysis]);

  if (!insights?.sections?.length) return null;

  return (
    <section className="card" style={{ padding: "1.75rem", marginBottom: "2rem" }} aria-label="Interactive section analyzer">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Layers size={20} style={{ color: "var(--color-primary)" }} />
          <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
            Resume Section Analysis
          </h3>
        </div>
        <span className="badge badge-neutral">{insights.sections.length} Sections</span>
      </div>
      <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
        Expand each resume section to inspect detected strengths, missing keywords, and targeted recommendations.
      </p>

      <div>
        {insights.sections.map((section) => (
          <SectionAnalysisCard
            key={section.key}
            section={section}
            isOpen={openSection === section.key}
            onToggle={() => setOpenSection((current) => (current === section.key ? null : section.key))}
          />
        ))}
      </div>
    </section>
  );
}

export default InteractiveSectionAnalyzer;
