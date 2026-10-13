import { useEffect, useRef, useState } from "react";
import InteractiveSectionAnalyzer from "./InteractiveSectionAnalyzer";
import RecruiterDashboard from "./RecruiterDashboard";

/* Helper: pick color class based on score */
function scoreColor(score) {
  if (score >= 0.75) return { stroke: "#22c55e", text: "var(--clr-green)" };
  if (score >= 0.5) return { stroke: "#fbbf24", text: "var(--clr-yellow)" };
  return { stroke: "#f87171", text: "var(--clr-red)" };
}

function ScoreRing({ score }) {
  const RADIUS = 54;
  const CIRC = 2 * Math.PI * RADIUS; // ≈ 339.3
  const clamp = Math.min(Math.max(score, 0), 1);
  const offset = CIRC - clamp * CIRC;
  const color = scoreColor(clamp);

  const fillRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // tiny delay so transition fires after mount
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="score-ring-wrap">
      <svg className="score-ring-svg" viewBox="0 0 120 120">
        <circle className="score-ring-bg" cx="60" cy="60" r={RADIUS} />
        <circle
          ref={fillRef}
          className={`score-ring-fill ${animated ? "animate" : ""}`}
          cx="60" cy="60" r={RADIUS}
          stroke={color.stroke}
          style={{ "--dash-offset": offset }}
        />
      </svg>
      <div className="score-ring-text">
        <span className="score-number" style={{ color: color.text }}>
          {Math.round(clamp * 100)}%
        </span>
        <span className="score-label">Match</span>
      </div>
    </div>
  );
}

function ScoreCard({ analysis }) {
  const score = analysis.matchScore ?? 0;
  const label =
    score >= 0.75 ? "Strong Match " :
      score >= 0.5 ? "Moderate Match " :
        "Needs Work ";

  return (
    <div className="score-card">
      <ScoreRing score={score} />
      <div className="score-info">
        <div className="score-title">{label}</div>
        <p className="score-summary">{analysis.summary}</p>
      </div>
    </div>
  );
}

function TagCard({ icon, iconClass, title, items, tagClass, numbered }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="tag-card">
      <div className="tag-card-header">
        <div className={`tag-card-icon ${iconClass}`}>{icon}</div>
        <span className="tag-card-title">{title}</span>
        <span className="tag-card-count">{items.length}</span>
      </div>

      {numbered ? (
        <ol className="improve-list">
          {items.map((item, i) => (
            <li key={i} className="improve-item">
              <span className="improve-num">{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="tags-wrap">
          {items.map((item, i) => (
            <span key={i} className={`tag ${tagClass}`}>
              <span className="tag-dot" />
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- ATS Breakdown ---- */
const SECTION_META = [
  { key: "skills", label: "Skills", icon: "-", RADIUS: 26 },
  { key: "experience", label: "Experience", icon: "-", RADIUS: 26 },
  { key: "education", label: "Education", icon: "-", RADIUS: 26 },
  { key: "projects", label: "Projects", icon: "-", RADIUS: 26 },
  { key: "formatting", label: "Formatting", icon: "-", RADIUS: 26 },
  { key: "contact", label: "Contact", icon: "-", RADIUS: 26 },
];

function MiniRing({ score, size = 68 }) {
  const R = (size / 2) - 6;
  const CIRC = 2 * Math.PI * R;
  const clamp = Math.min(Math.max(score ?? 0, 0), 1);
  const offset = CIRC - clamp * CIRC;
  const color = scoreColor(clamp);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mini-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" cx={size / 2} cy={size / 2} r={R} />
        <circle
          fill="none"
          stroke={color.stroke}
          strokeWidth="5"
          strokeLinecap="round"
          cx={size / 2} cy={size / 2} r={R}
          strokeDasharray={CIRC}
          strokeDashoffset={animated ? offset : CIRC}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="mini-ring-text">
        <span className="mini-ring-pct" style={{ color: color.text }}>{Math.round(clamp * 100)}</span>
      </div>
    </div>
  );
}

function ATSBreakdown({ analysis }) {
  const ss = analysis.sectionScores;
  const exp = analysis.atsExplanation;
  if (!ss) return null;

  return (
    <div className="ats-breakdown-card">
      <div className="tag-card-header">
        <span className="tag-card-title">ATS Section Breakdown</span>
      </div>

      <div className="ats-grid">
        {SECTION_META.map(({ key, label, icon }) => (
          <div key={key} className="ats-section-cell">
            <MiniRing score={ss[key]} />
            <div className="ats-cell-label">
              <span className="ats-cell-icon">{icon}</span>
              {label}
            </div>
          </div>
        ))}
      </div>

      {exp && (
        <div className="ats-explanation">
          <p>{exp}</p>
        </div>
      )}
    </div>
  );
}

/* ============================================
   RESUME PROFILE CARD  (parsed extraction)
   ============================================ */

const PROFILE_SECTIONS = [
  { key: "certifications", label: "Certifications", icon: "-" },
  { key: "awards", label: "Awards", icon: "-" },
  { key: "languages", label: "Languages", icon: "-" },
  { key: "publications", label: "Publications", icon: "-" },
  { key: "internships", label: "Internships", icon: "-" },
  { key: "achievements", label: "Achievements", icon: "-" },
];

function ProfileChips({ items, colorClass }) {
  if (!items || items.length === 0) return <span className="profile-empty">—</span>;
  return (
    <div className="profile-chips">
      {items.map((item, i) => (
        <span key={i} className={`profile-chip ${colorClass}`}>{item}</span>
      ))}
    </div>
  );
}

function ProfileLink({ url, icon, label }) {
  if (!url) return null;
  // Normalize: if URL doesn't start with http, prepend https://
  const href = url.startsWith("http") ? url : `https://${url}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="profile-link">
      <span className="profile-link-icon">{icon}</span>
      {label}
      <span className="profile-link-arrow">↗</span>
    </a>
  );
}

function ResumeProfile({ analysis }) {
  const pr = analysis.parsedResume;
  if (!pr) return null;

  const hasLinks = pr.github || pr.linkedin || pr.portfolio;
  const hasSkills = (pr.hardSkills?.length > 0) || (pr.softSkills?.length > 0);
  const extraSections = PROFILE_SECTIONS.filter(s => pr[s.key]?.length > 0);

  // nothing to show — skip rendering entirely
  if (!hasLinks && !hasSkills && extraSections.length === 0) return null;

  return (
    <div className="profile-card">
      <div className="tag-card-header">
        <span className="tag-card-title">Resume Profile</span>
      </div>

      {/* Links row */}
      {hasLinks && (
        <div className="profile-links-row">
          <ProfileLink url={pr.github} icon=" " label="GitHub" />
          <ProfileLink url={pr.linkedin} icon=" " label="LinkedIn" />
          <ProfileLink url={pr.portfolio} icon=" " label="Portfolio" />
        </div>
      )}

      {/* Skills rows */}
      {pr.hardSkills?.length > 0 && (
        <div className="profile-skill-row">
          <div className="profile-skill-label">- Hard Skills</div>
          <br />
          <ProfileChips items={pr.hardSkills} colorClass="chip-blue" />
        </div>
      )}
      {pr.softSkills?.length > 0 && (
        <div className="profile-skill-row">
          <div className="profile-skill-label">- Soft Skills</div>
          <br />
          <ProfileChips items={pr.softSkills} colorClass="chip-purple" />
        </div>
      )}

      {/* Extra sections */}
      {extraSections.length > 0 && (
        <div className="profile-extras">
          {extraSections.map(({ key, label, icon }) => (
            <div key={key} className="profile-extra-row">
              <div className="profile-skill-label">{icon} {label}</div>
              <ProfileChips items={pr[key]} colorClass="chip-neutral" />
            </div>
          ))}
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
    <section className="results-section" aria-label="Analysis Results">
      <br />
      <div className="results-header">
        <h2>🔥 AI Scanner Resume Data </h2>
        <span className="results-badge">✓ Complete</span>
      </div>

      <ResumeProfile analysis={analysis} />

      <ScoreCard analysis={analysis} />


      <ATSBreakdown analysis={analysis} />

      <InteractiveSectionAnalyzer analysis={analysis} />

      <RecruiterDashboard analysis={analysis} />


      <TagCard
        icon=" "
        iconClass="icon-green"
        title="Strengths"
        items={analysis.strengths}
        tagClass="green"
      />

      <TagCard
        icon=" "
        iconClass="icon-red"
        title="Missing Skills"
        items={analysis.missingSkills}
        tagClass="red"
      />

      <TagCard
        icon=" "
        iconClass="icon-yellow"
        title="Improvements"
        items={analysis.improvements}
        tagClass="yellow"
        numbered={true}
      />
    </section>
  );
}

export { ScoreCard, ATSBreakdown, ResumeProfile, TagCard };
export default ResultBox;

