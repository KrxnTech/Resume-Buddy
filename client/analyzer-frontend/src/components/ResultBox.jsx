import { useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, TrendingUp, Target, FileText, ExternalLink, Sparkles, Check, X } from "lucide-react";
import InteractiveSectionAnalyzer from "./InteractiveSectionAnalyzer";
import RecruiterDashboard from "./RecruiterDashboard";

function scoreColor(score) {
  if (score >= 0.75) return { stroke: "var(--color-success)", text: "var(--color-success)" };
  if (score >= 0.5) return { stroke: "var(--color-warning)", text: "var(--color-warning)" };
  return { stroke: "var(--color-error)", text: "var(--color-error)" };
}

function ScoreRing({ score }) {
  const RADIUS = 48;
  const CIRC = 2 * Math.PI * RADIUS;
  const clamp = Math.min(Math.max(score, 0), 1);
  const offset = CIRC - clamp * CIRC;
  const color = scoreColor(clamp);

  return (
    <div style={{ position: "relative", width: "110px", height: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="55" cy="55" r={RADIUS} fill="none" stroke="var(--color-border)" strokeWidth="8" />
        <circle
          cx="55"
          cy="55"
          r={RADIUS}
          fill="none"
          stroke={color.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div style={{ fontSize: "1.4rem", fontWeight: 700, color: color.text }}>
          {Math.round(clamp * 100)}%
        </div>
        <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
          Match
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ analysis }) {
  const score = analysis.matchScore ?? 0;
  const label =
    score >= 0.75 ? "High ATS Alignment" :
      score >= 0.5 ? "Moderate Alignment" :
        "Action Required";

  return (
    <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
      <ScoreRing score={score} />
      <div>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--color-heading)", margin: "0 0 0.35rem" }}>
          {label}
        </h3>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
          {analysis.summary}
        </p>
      </div>
    </div>
  );
}

function TagCard({ icon, title, items, badgeType = "neutral", numbered = false }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {icon}
          <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
            {title}
          </h4>
        </div>
        <span className="badge badge-neutral">{items.length}</span>
      </div>

      {numbered ? (
        <ol style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.9rem", color: "var(--color-text)", lineHeight: 1.6 }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: "6px" }}>{item}</li>
          ))}
        </ol>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {items.map((item, i) => (
            <span key={i} className={`badge badge-${badgeType}`} style={{ fontSize: "0.82rem", padding: "5px 10px", display: "inline-flex", alignItems: "center", gap: 5 }}>
              {badgeType === "success" ? <Check size={12} /> : badgeType === "warning" || badgeType === "error" ? <X size={12} /> : null}
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const SECTION_META = [
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "projects", label: "Projects" },
  { key: "formatting", label: "Formatting" },
  { key: "contact", label: "Contact Details" },
];

function ATSBreakdown({ analysis }) {
  const ss = analysis.sectionScores;
  const exp = analysis.atsExplanation;
  if (!ss) return null;

  return (
    <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <Target size={18} style={{ color: "var(--color-primary)" }} />
        <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
          ATS Section Breakdown
        </h4>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
        {SECTION_META.map(({ key, label }) => {
          const val = ss[key] ?? 0;
          const pct = Math.round(val * 100);
          return (
            <div key={key} style={{ padding: "0.75rem", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "4px" }}>
                <span style={{ color: "var(--color-text-muted)" }}>{label}</span>
                <span style={{ fontWeight: 600, color: scoreColor(val).text }}>{pct}%</span>
              </div>
              <div className="progress-bar" style={{ height: "6px" }}>
                <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: scoreColor(val).stroke }} />
              </div>
            </div>
          );
        })}
      </div>

      {exp && (
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
          {exp}
        </p>
      )}
    </div>
  );
}

function ProfileLink({ url, label }) {
  if (!url) return null;
  const href = url.startsWith("http") ? url : `https://${url}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-secondary btn-sm"
      style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", textDecoration: "none" }}
    >
      {label} <ExternalLink size={12} />
    </a>
  );
}

function ResumeProfile({ analysis }) {
  const pr = analysis.parsedResume;
  if (!pr) return null;

  const hasLinks = pr.github || pr.linkedin || pr.portfolio;
  const hasSkills = (pr.hardSkills?.length > 0) || (pr.softSkills?.length > 0);

  if (!hasLinks && !hasSkills) return null;

  return (
    <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <FileText size={18} style={{ color: "var(--color-primary)" }} />
        <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
          Extracted Resume Information
        </h4>
      </div>

      {hasLinks && (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <ProfileLink url={pr.github} label="GitHub" />
          <ProfileLink url={pr.linkedin} label="LinkedIn" />
          <ProfileLink url={pr.portfolio} label="Portfolio" />
        </div>
      )}

      {pr.hardSkills?.length > 0 && (
        <div style={{ marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "4px" }}>
            Technical Competencies
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {pr.hardSkills.map((s, idx) => (
              <span key={idx} className="badge badge-neutral" style={{ fontSize: "0.78rem" }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultBox({ result }) {
  if (!result) return null;
  const { analysis } = result;
  if (!analysis) return null;

  return (
    <section aria-label="Analysis Results">
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-heading)", margin: "0 0 0.35rem" }}>
          Analysis Results Overview
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", margin: 0 }}>
          Detailed findings and recommendations computed by the career intelligence engine.
        </p>
      </div>

      <ScoreCard analysis={analysis} />
      <ResumeProfile analysis={analysis} />
      <ATSBreakdown analysis={analysis} />
      <InteractiveSectionAnalyzer analysis={analysis} />
      <RecruiterDashboard analysis={analysis} />

      <TagCard
        icon={<CheckCircle2 size={18} style={{ color: "var(--color-success)" }} />}
        title="Matching Strengths"
        items={analysis.strengths}
        badgeType="success"
      />

      <TagCard
        icon={<AlertTriangle size={18} style={{ color: "var(--color-error)" }} />}
        title="Missing Skills & Keywords"
        items={analysis.missingSkills}
        badgeType="error"
      />

      <TagCard
        icon={<TrendingUp size={18} style={{ color: "var(--color-primary)" }} />}
        title="Prioritized Improvements"
        items={analysis.improvements}
        numbered={true}
      />
    </section>
  );
}

export { ScoreCard, ATSBreakdown, ResumeProfile, TagCard };
export default ResultBox;
