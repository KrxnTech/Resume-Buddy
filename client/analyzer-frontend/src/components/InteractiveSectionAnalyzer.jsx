import { useMemo, useState } from "react";
import { buildSectionAnalysis } from "../utils/sectionAnalyzer";
import SectionAnalysisCard from "./SectionAnalysisCard";

function InteractiveSectionAnalyzer({ analysis }) {
  const [openSection, setOpenSection] = useState("skills");

  const insights = useMemo(() => buildSectionAnalysis(analysis), [analysis]);

  if (!insights?.sections?.length) return null;

  return (
    <section className="interactive-analyzer-card" aria-label="Interactive section analyzer">
      <div className="tag-card-header">
        <span className="tag-card-title">Interactive Resume Section Analyzer</span>
        <span className="tag-card-count">{insights.sections.length} sections</span>
      </div>
      <p className="interactive-analyzer-subtitle">
        Expand each ATS section to inspect detailed strengths, weaknesses, key terms, and recommendations.
      </p>

      <div className="section-analysis-list">
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
