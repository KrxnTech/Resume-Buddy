import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useRef, useState, memo } from "react";

/* ============================================
   CONSTANTS
   ============================================ */
const SECTION_TABS = [
  { key: "summary", label: "Summary", icon: "" },
  { key: "experience", label: "Experience", icon: "" },
  { key: "projects", label: "Projects", icon: "" },
  { key: "skills", label: "Skills", icon: "" },
  { key: "achievements", label: "Achievements", icon: "" },
  { key: "careerObjective", label: "Career Objective", icon: "" },
  { key: "certifications", label: "Certifications", icon: "" },
];

const MAX_VERSIONS = 10;

/* ============================================
   HELPER: Improvement Score Mini Ring
   ============================================ */
function ImprovementRing({ score }) {
  const safeScore = Math.min(100, Math.max(0, score || 0));
  const color =
    safeScore >= 75 ? "var(--clr-green)" :
    safeScore >= 50 ? "var(--clr-yellow)" :
    "var(--clr-red)";

  return (
    <div className="rewrite-score-ring">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4"
          cx="26" cy="26" r="22"
        />
        <motion.circle
          fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          cx="26" cy="26" r="22"
          strokeDasharray={2 * Math.PI * 22}
          initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - safeScore / 100) }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>
      <span className="rewrite-score-value" style={{ color }}>{safeScore}</span>
    </div>
  );
}

/* ============================================
   COPY BUTTON
   ============================================ */
function CopyButton({ text, onToast }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      onToast("Copied Successfully!");
    } catch {
      onToast("Copy failed — try manually.");
    }
  };

  return (
    <button className="rewrite-action-btn rewrite-copy-btn" onClick={handleCopy} title="Copy improved text">
      Copy
    </button>
  );
}

/* ============================================
   ACCEPT / REJECT BUTTONS
   ============================================ */
function AcceptButton({ onClick }) {
  return (
    <button className="rewrite-action-btn rewrite-accept-btn" onClick={onClick} title="Accept this rewrite">
      <span>✓</span> Accept
    </button>
  );
}

function RejectButton({ onClick }) {
  return (
    <button className="rewrite-action-btn rewrite-reject-btn" onClick={onClick} title="Reject this rewrite">
      <span>✕</span> Reject
    </button>
  );
}

/* ============================================
   DIFF VIEWER
   ============================================ */
function DiffViewer({ original, improved }) {
  if (!original || !improved) return null;

  // Simple word-level diff: highlight words in improved that aren't in original
  const origWords = new Set(original.toLowerCase().split(/\s+/));

  const improvedWords = improved.split(/\s+/);

  return (
    <div className="rewrite-diff-view">
      {improvedWords.map((word, i) => {
        const isNew = !origWords.has(word.toLowerCase().replace(/[.,;:!?()]/g, ""));
        return (
          <span key={i} className={isNew ? "rewrite-diff-add" : ""}>
            {word}{" "}
          </span>
        );
      })}
    </div>
  );
}

/* ============================================
   CONFIDENCE BADGE
   ============================================ */
function ConfidenceBadge({ value }) {
  const safeVal = Math.min(100, Math.max(0, value || 0));
  const tone =
    safeVal >= 80 ? "high" :
    safeVal >= 55 ? "medium" :
    "low";

  return (
    <span className={`rewrite-confidence-badge ${tone}`}>
      {safeVal}% Confidence
    </span>
  );
}

/* ============================================
   REWRITE CARD — Single section comparison
   ============================================ */
const RewriteCard = memo(function RewriteCard({ item, sectionKey, index, accepted, onAccept, onReject, onToast }) {
  const [showDiff, setShowDiff] = useState(false);

  if (!item || !item.original || !item.improved) return null;

  const isAccepted = accepted === true;
  const isRejected = accepted === false;

  return (
    <motion.div
      className={`rewrite-card ${isAccepted ? "accepted" : ""} ${isRejected ? "rejected" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      layout
    >
      {/* Header with score */}
      <div className="rewrite-card-header">
        <ImprovementRing score={item.improvementScore} />
        <div className="rewrite-card-header-info">
          <span className="rewrite-card-label">
            {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
            {index !== undefined && index >= 0 ? ` #${index + 1}` : ""}
          </span>
          <ConfidenceBadge value={item.confidence} />
        </div>
        {isAccepted && <span className="rewrite-status-badge accepted">✓ Accepted</span>}
        {isRejected && <span className="rewrite-status-badge rejected">✕ Rejected</span>}
      </div>

      {/* Side-by-side comparison */}
      <div className="rewrite-comparison">
        <div className="rewrite-original">
          <div className="rewrite-col-label">Original</div>
          <p>{item.original}</p>
        </div>
        <div className="rewrite-improved">
          <div className="rewrite-col-label">Improved</div>
          <p>{item.improved}</p>
        </div>
      </div>

      {/* Toggle diff view */}
      <button className="rewrite-diff-toggle" onClick={() => setShowDiff(v => !v)}>
        {showDiff ? "Hide" : "Show"} Diff Highlighting
      </button>

      <AnimatePresence>
        {showDiff && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <DiffViewer original={item.original} improved={item.improved} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meta chips: action verbs, ATS improvement, recruiter impact */}
      <div className="rewrite-meta-row">
        {item.actionVerbs?.length > 0 && (
          <div className="rewrite-meta-group">
            <span className="rewrite-meta-label">Action Verbs</span>
            <div className="rewrite-meta-chips">
              {item.actionVerbs.map((v, i) => (
                <span key={i} className="rewrite-meta-chip verb">{v}</span>
              ))}
            </div>
          </div>
        )}
        {item.estimatedAtsImprovement && (
          <div className="rewrite-meta-group">
            <span className="rewrite-meta-label">ATS Impact</span>
            <span className="rewrite-meta-chip ats">{item.estimatedAtsImprovement}</span>
          </div>
        )}
        {item.recruiterImpact && (
          <div className="rewrite-meta-group">
            <span className="rewrite-meta-label">Recruiter Impact</span>
            <span className="rewrite-meta-chip recruiter">{item.recruiterImpact}</span>
          </div>
        )}
      </div>

      {/* Why improved */}
      {item.whyImproved && (
        <div className="rewrite-why">
          <span className="rewrite-why-label">Why improved:</span> {item.whyImproved}
        </div>
      )}

      {/* Action buttons */}
      {!isAccepted && !isRejected && (
        <div className="rewrite-actions">
          <AcceptButton onClick={() => onAccept(sectionKey, index)} />
          <RejectButton onClick={() => onReject(sectionKey, index)} />
          <CopyButton text={item.improved} onToast={onToast} />
        </div>
      )}

      {(isAccepted || isRejected) && (
        <div className="rewrite-actions">
          <CopyButton text={item.improved} onToast={onToast} />
          <button
            className="rewrite-action-btn rewrite-undo-btn"
            onClick={() => { onAccept(sectionKey, index, true); }}
            title="Undo decision"
          >
            ↩ Undo
          </button>
        </div>
      )}
    </motion.div>
  );
});

/* ============================================
   SKILLS REWRITE CARD — categorized display
   ============================================ */
const SkillsRewriteCard = memo(function SkillsRewriteCard({ skills, accepted, onAccept, onReject, onToast }) {
  if (!skills || !skills.reorganized) return null;

  const isAccepted = accepted === true;
  const isRejected = accepted === false;

  const categories = Object.entries(skills.reorganized).filter(
    ([, items]) => items && items.length > 0
  );

  if (categories.length === 0) return null;

  return (
    <motion.div
      className={`rewrite-card rewrite-skills-card ${isAccepted ? "accepted" : ""} ${isRejected ? "rejected" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      layout
    >
      <div className="rewrite-card-header">
        <ImprovementRing score={skills.improvementScore} />
        <div className="rewrite-card-header-info">
          <span className="rewrite-card-label">Skills Reorganization</span>
        </div>
        {isAccepted && <span className="rewrite-status-badge accepted">✓ Accepted</span>}
        {isRejected && <span className="rewrite-status-badge rejected">✕ Rejected</span>}
      </div>

      {/* Before: flat list */}
      <div className="rewrite-comparison">
        <div className="rewrite-original">
          <div className="rewrite-col-label">Original (Flat)</div>
          <div className="rewrite-skills-flat">
            {skills.original?.map((s, i) => (
              <span key={i} className="rewrite-skill-chip flat">{s}</span>
            ))}
          </div>
        </div>

        {/* After: categorized */}
        <div className="rewrite-improved">
          <div className="rewrite-col-label">Reorganized</div>
          <div className="rewrite-skills-grid">
            {categories.map(([category, items]) => (
              <div key={category} className="rewrite-skill-category">
                <span className="rewrite-skill-cat-label">{category}</span>
                <div className="rewrite-skill-cat-chips">
                  {items.map((s, i) => (
                    <span key={i} className="rewrite-skill-chip categorized">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why improved */}
      {skills.whyImproved && (
        <div className="rewrite-why">
          <span className="rewrite-why-label">Why improved:</span> {skills.whyImproved}
        </div>
      )}

      {/* Actions */}
      {!isAccepted && !isRejected && (
        <div className="rewrite-actions">
          <AcceptButton onClick={() => onAccept("skills", -1)} />
          <RejectButton onClick={() => onReject("skills", -1)} />
          <CopyButton
            text={categories.map(([cat, items]) => `${cat}: ${items.join(", ")}`).join("\n")}
            onToast={onToast}
          />
        </div>
      )}

      {(isAccepted || isRejected) && (
        <div className="rewrite-actions">
          <CopyButton
            text={categories.map(([cat, items]) => `${cat}: ${items.join(", ")}`).join("\n")}
            onToast={onToast}
          />
          <button
            className="rewrite-action-btn rewrite-undo-btn"
            onClick={() => onAccept("skills", -1, true)}
            title="Undo decision"
          >
            ↩ Undo
          </button>
        </div>
      )}
    </motion.div>
  );
});

/* ============================================
   VERSION HISTORY
   ============================================ */
function VersionHistory({ versions, onRestore, currentDecisions }) {
  const [expanded, setExpanded] = useState(false);

  if (versions.length === 0) return null;

  return (
    <div className="rewrite-version-panel">
      <button className="rewrite-version-toggle" onClick={() => setExpanded(v => !v)}>
        <span>Version History ({versions.length})</span>
        <span className={`rewrite-version-arrow ${expanded ? "open" : ""}`}>▾</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="rewrite-version-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {versions.map((version) => {
              const acceptCount = Object.values(version.decisions).filter(v => v === true).length;
              const rejectCount = Object.values(version.decisions).filter(v => v === false).length;
              const isCurrent = JSON.stringify(version.decisions) === JSON.stringify(currentDecisions);

              return (
                <div key={version.id} className={`rewrite-version-item ${isCurrent ? "current" : ""}`}>
                  <div className="rewrite-version-info">
                    <span className="rewrite-version-label">{version.label}</span>
                    <span className="rewrite-version-time">{version.timestamp}</span>
                    <span className="rewrite-version-stats">
                      {acceptCount > 0 && <span className="rewrite-vstat green">✓{acceptCount}</span>}
                      {rejectCount > 0 && <span className="rewrite-vstat red">✕{rejectCount}</span>}
                    </span>
                  </div>
                  {!isCurrent && (
                    <button
                      className="rewrite-action-btn rewrite-restore-btn"
                      onClick={() => onRestore(version)}
                    >
                      Restore
                    </button>
                  )}
                  {isCurrent && <span className="rewrite-current-badge">Current</span>}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================
   LOADING SKELETON
   ============================================ */
function RewriteSkeleton() {
  return (
    <div className="rewrite-skeleton-wrap">
      {[1, 2, 3].map(i => (
        <div key={i} className="rewrite-skeleton-card">
          <div className="rewrite-skeleton-line w60" />
          <div className="rewrite-skeleton-line w100" />
          <div className="rewrite-skeleton-line w80" />
          <div className="rewrite-skeleton-line w40" />
        </div>
      ))}
    </div>
  );
}

/* ============================================
   TOAST
   ============================================ */
function Toast({ message, onDone }) {
  return (
    <motion.div
      className="rewrite-toast"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onAnimationComplete={() => {
        setTimeout(onDone, 1800);
      }}
    >
      <span>✓</span> {message}
    </motion.div>
  );
}

/* ============================================
   MAIN: RESUME REWRITE STUDIO
   ============================================ */
function ResumeRewriteStudio({ analysis }) {
  const studio = analysis?.rewriteStudio;
  const [activeTab, setActiveTab] = useState("summary");
  const [decisions, setDecisions] = useState({}); // { "summary": true, "experience-0": false, ... }
  const [versions, setVersions] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

  /* --- Determine which tabs have data --- */
  const availableTabs = useMemo(() => {
    if (!studio) return [];
    return SECTION_TABS.filter(tab => {
      const data = studio[tab.key];
      if (data === null || data === undefined) return false;
      if (Array.isArray(data)) return data.length > 0;
      if (tab.key === "skills") return data.reorganized && Object.keys(data.reorganized).length > 0;
      return typeof data === "object";
    });
  }, [studio]);

  /* --- Toast handler --- */
  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
  }, []);

  /* --- Decision key helper --- */
  const decisionKey = (sectionKey, index) =>
    index !== undefined && index >= 0 ? `${sectionKey}-${index}` : sectionKey;

  /* --- Accept handler --- */
  const handleAccept = useCallback((sectionKey, index, undo = false) => {
    setDecisions(prev => {
      const key = decisionKey(sectionKey, index);
      if (undo) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: true };
    });
  }, []);

  /* --- Reject handler --- */
  const handleReject = useCallback((sectionKey, index) => {
    setDecisions(prev => ({
      ...prev,
      [decisionKey(sectionKey, index)]: false,
    }));
  }, []);

  /* --- Accept All --- */
  const handleAcceptAll = useCallback(() => {
    if (!studio) return;
    const all = {};

    // Single-item sections
    ["summary", "careerObjective", "certifications"].forEach(key => {
      if (studio[key]?.improved) all[key] = true;
    });

    // Array sections
    ["experience", "projects", "achievements"].forEach(key => {
      if (Array.isArray(studio[key])) {
        studio[key].forEach((_, i) => { all[`${key}-${i}`] = true; });
      }
    });

    // Skills
    if (studio.skills?.reorganized) all["skills"] = true;

    setDecisions(all);
    showToast("All sections accepted!");
  }, [studio, showToast]);

  /* --- Save version --- */
  const handleSaveVersion = useCallback(() => {
    const now = new Date();
    const timestamp = now.toLocaleString("en-IN", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      day: "2-digit", month: "short", year: "numeric",
    });

    setVersions(prev => {
      const next = [
        {
          id: Date.now(),
          label: `Version ${prev.length + 1}`,
          timestamp,
          decisions: { ...decisions },
        },
        ...prev,
      ];
      return next.slice(0, MAX_VERSIONS);
    });
    showToast("Version saved!");
  }, [decisions, showToast]);

  /* --- Restore version --- */
  const handleRestoreVersion = useCallback((version) => {
    setDecisions({ ...version.decisions });
    showToast(`Restored ${version.label}`);
  }, [showToast]);

  /* --- Empty / Loading states --- */
  if (!studio) {
    return (
      <section className="rewrite-studio-card empty-state">
        <div className="tag-card-header">
          <span className="tag-card-title">AI Resume Rewrite Studio</span>
        </div>
        <p className="interactive-analyzer-subtitle">
          Rewrite suggestions will appear here after analysis completes.
        </p>
      </section>
    );
  }

  if (availableTabs.length === 0) {
    return (
      <section className="rewrite-studio-card empty-state">
        <div className="tag-card-header">
          <span className="tag-card-title">AI Resume Rewrite Studio</span>
        </div>
        <p className="interactive-analyzer-subtitle">
          No improvements recommended — your resume sections look great!
        </p>
      </section>
    );
  }

  /* --- Ensure activeTab is valid --- */
  const currentTab = availableTabs.find(t => t.key === activeTab) ? activeTab : availableTabs[0]?.key;

  /* --- Render section content --- */
  const renderTabContent = () => {
    const data = studio[currentTab];

    // Skills special case
    if (currentTab === "skills") {
      return (
        <SkillsRewriteCard
          skills={data}
          accepted={decisions["skills"]}
          onAccept={handleAccept}
          onReject={handleReject}
          onToast={showToast}
        />
      );
    }

    // Array sections (experience, projects, achievements)
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return <div className="rewrite-empty-state">No improvements recommended for this section.</div>;
      }
      return data.map((item, i) => (
        <RewriteCard
          key={`${currentTab}-${i}`}
          item={item}
          sectionKey={currentTab}
          index={i}
          accepted={decisions[decisionKey(currentTab, i)]}
          onAccept={handleAccept}
          onReject={handleReject}
          onToast={showToast}
        />
      ));
    }

    // Single object sections (summary, careerObjective, certifications)
    if (data && typeof data === "object" && data.original) {
      return (
        <RewriteCard
          item={data}
          sectionKey={currentTab}
          index={-1}
          accepted={decisions[currentTab]}
          onAccept={handleAccept}
          onReject={handleReject}
          onToast={showToast}
        />
      );
    }

    return <div className="rewrite-empty-state">No improvements recommended for this section.</div>;
  };

  return (
    <motion.section
      className="rewrite-studio-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-label="AI Resume Rewrite Studio"
    >
      {/* Header */}
      <div className="tag-card-header">
        <span className="tag-card-title">AI Resume Rewrite Studio</span>
        <div className="rewrite-header-actions">
          <button className="rewrite-action-btn rewrite-save-btn" onClick={handleSaveVersion}>
            Save Version
          </button>
          <button className="rewrite-action-btn rewrite-accept-all-btn" onClick={handleAcceptAll}>
            Accept All
          </button>
        </div>
      </div>

      <p className="interactive-analyzer-subtitle">
        AI-powered rewrites for every resume section. Compare, accept, or copy improvements instantly.
      </p>

      {/* Version History */}
      <VersionHistory
        versions={versions}
        onRestore={handleRestoreVersion}
        currentDecisions={decisions}
      />

      {/* Tab Navigation */}
      <div className="rewrite-tabs">
        {availableTabs.map(tab => (
          <button
            key={tab.key}
            className={`rewrite-tab ${currentTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="rewrite-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rewrite-tab-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="rewrite-cards-list"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg(null)} />}
      </AnimatePresence>
    </motion.section>
  );
}

export default ResumeRewriteStudio;
