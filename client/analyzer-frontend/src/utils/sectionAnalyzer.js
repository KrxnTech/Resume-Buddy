const PRIORITY_STYLES = {
  HIGH: { label: "High", tone: "high" },
  MEDIUM: { label: "Medium", tone: "medium" },
  LOW: { label: "Low", tone: "low" },
};

function clampScore(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function toPercent(value) {
  return Math.round(clampScore(value) * 100);
}

function dedupe(items = []) {
  return [...new Set(items.filter(Boolean))];
}

function buildRecommendation(title, detail, priority = "MEDIUM", impact = "+10 ATS", difficulty = "Medium") {
  return {
    title,
    detail,
    priority: PRIORITY_STYLES[priority] ? priority : "MEDIUM",
    impact,
    difficulty,
  };
}

export function buildSectionAnalysis(analysis = {}) {
  const parsedResume = analysis.parsedResume || {};
  const sectionScores = analysis.sectionScores || {};
  const strengths = analysis.strengths || [];
  const missingSkills = analysis.missingSkills || [];
  const improvements = analysis.improvements || [];

  const hardSkills = dedupe(parsedResume.hardSkills || []);
  const softSkills = dedupe(parsedResume.softSkills || []);
  const achievements = dedupe(parsedResume.achievements || []);
  const links = dedupe([
    parsedResume.github,
    parsedResume.linkedin,
    parsedResume.portfolio,
  ].filter(Boolean));

  const skillsFound = dedupe([...hardSkills, ...softSkills, ...strengths].slice(0, 8));
  const skillsMissing = dedupe([...missingSkills, "TypeScript", "Testing", "Cloud deployment"].slice(0, 6));

  const sections = [
    {
      key: "skills",
      label: "Skills",
      score: sectionScores.skills ?? 0.55,
      color: "blue",
      strengths: dedupe([...skillsFound, ...hardSkills].slice(0, 6)),
      weaknesses: dedupe([...skillsMissing].slice(0, 6)),
      explanation:
        (analysis.summary || "The resume shows solid relevance for the role.") +
        " The skill profile highlights strong technical breadth, though ATS compatibility improves when the missing technologies from the job description are made explicit.",
      keywords: {
        found: skillsFound.slice(0, 6),
        missing: skillsMissing.slice(0, 6),
      },
      recommendations: [
        buildRecommendation("Add the missing stack items", "Mention the tools and platforms named in the job description directly in the summary or skills section.", "HIGH", "+15 ATS", "Easy"),
        buildRecommendation("Group skills by domain", "Separate frontend, backend, and data skills so recruiters and ATS systems can scan them quickly.", "MEDIUM", "+8 ATS", "Easy"),
      ],
    },
    {
      key: "projects",
      label: "Projects",
      score: sectionScores.projects ?? 0.5,
      color: "purple",
      strengths: dedupe([...(parsedResume.achievements || []), ...strengths].slice(0, 5)),
      weaknesses: dedupe([
        "No project-specific details were extracted from the resume.",
        "Business impact and deployment details are not visible.",
      ].slice(0, 4)),
      explanation:
        "The resume does not expose enough project evidence for a strong ATS review. Adding project outcomes, architecture choices, and deployment notes would make this section much more persuasive.",
      keywords: {
        found: achievements.slice(0, 6),
        missing: ["Project name", "Business impact", "Deployment link", "Metrics", "Testing", "README"],
      },
      recommendations: [
        buildRecommendation("Document each project clearly", "Add a short project title, stack, outcome, and the problem each project solved.", "HIGH", "+12 ATS", "Medium"),
        buildRecommendation("Include measurable metrics", "Mention wins such as latency reduction, adoption growth, or cost savings to strengthen credibility.", "MEDIUM", "+10 ATS", "Easy"),
      ],
    },
    {
      key: "experience",
      label: "Experience",
      score: sectionScores.experience ?? 0.6,
      color: "green",
      strengths: dedupe([...strengths, ...achievements].slice(0, 6)),
      weaknesses: dedupe([
        ...improvements.slice(0, 3),
        "Leadership signals are not yet explicit.",
      ].slice(0, 6)),
      explanation:
        "The experience section appears relevant, but ATS scoring improves when the resume shows ownership, measurable impact, and leadership in a more structured way.",
      keywords: {
        found: dedupe([...hardSkills, ...softSkills].slice(0, 6)),
        missing: ["Leadership", "Ownership", "Outcome metrics", "Stakeholder impact"],
      },
      recommendations: [
        buildRecommendation("Strengthen bullet points", "Turn responsibilities into achievement-led bullets that include scope, action, and measurable impact.", "HIGH", "+12 ATS", "Medium"),
        buildRecommendation("Highlight leadership", "Mention mentoring, cross-functional work, and decision-making to signal growth and influence.", "MEDIUM", "+8 ATS", "Medium"),
      ],
    },
    {
      key: "education",
      label: "Education",
      score: sectionScores.education ?? 0.55,
      color: "yellow",
      strengths: dedupe([parsedResume.certifications?.[0], parsedResume.languages?.[0]].filter(Boolean)),
      weaknesses: dedupe([
        "Relevant coursework is not visible.",
        "Role-specific certifications are missing.",
      ].slice(0, 4)),
      explanation:
        "The education section is present but could be more compelling for ATS by connecting academic credentials to the target role and surfacing relevant coursework or certifications.",
      keywords: {
        found: dedupe([parsedResume.certifications?.[0], parsedResume.languages?.[0]].filter(Boolean)),
        missing: ["Relevant coursework", "Certifications", "Specialized training"],
      },
      recommendations: [
        buildRecommendation("Add certification signals", "Surface cloud, testing, or platform certifications that align with the job description.", "MEDIUM", "+8 ATS", "Easy"),
        buildRecommendation("Link education to the role", "Mention coursework, capstones, and projects that map directly to the target position.", "LOW", "+5 ATS", "Easy"),
      ],
    },
    {
      key: "formatting",
      label: "Formatting",
      score: sectionScores.formatting ?? 0.7,
      color: "blue",
      strengths: dedupe(["Clear section ordering", "Readable layout"].slice(0, 3)),
      weaknesses: dedupe([
        "Margins and spacing could be tightened.",
        "Bullet consistency could be improved.",
      ].slice(0, 4)),
      explanation:
        "The document is structurally readable and ATS-friendly, but refinement in spacing, consistency, and section hierarchy would increase scanability and recruiter comfort.",
      keywords: {
        found: ["Section headings", "Readable structure"],
        missing: ["Consistent bullets", "Whitespace balance", "Standard fonts"],
      },
      recommendations: [
        buildRecommendation("Use a cleaner structure", "Keep section order consistent and avoid decorative formatting that can confuse ATS parsers.", "MEDIUM", "+8 ATS", "Easy"),
        buildRecommendation("Improve spacing", "Tighten margins and ensure clear white space between sections for easier scanning.", "LOW", "+5 ATS", "Easy"),
      ],
    },
    {
      key: "contact",
      label: "Contact Information",
      score: sectionScores.contact ?? 0.65,
      color: "green",
      strengths: dedupe(links.slice(0, 4)),
      weaknesses: dedupe([
        "Phone number is not visible.",
        "Location details are not visible.",
      ].slice(0, 4)),
      explanation:
        "The resume includes professional links, but a more complete contact block would improve trust and recruiter follow-through.",
      keywords: {
        found: links.slice(0, 4),
        missing: ["Phone", "Location", "Email", "Portfolio"],
      },
      recommendations: [
        buildRecommendation("Expand the contact block", "Add a full contact row that includes email, phone, location, and portfolio links in a consistent format.", "HIGH", "+10 ATS", "Easy"),
        buildRecommendation("Polish your profile links", "Ensure GitHub, LinkedIn, and portfolio links are current and consistently styled.", "LOW", "+4 ATS", "Easy"),
      ],
    },
  ];

  return {
    sections,
    overviewScore: toPercent((sectionScores.skills ?? 0.55 + sectionScores.experience ?? 0.55 + sectionScores.education ?? 0.55 + sectionScores.projects ?? 0.55 + sectionScores.formatting ?? 0.55 + sectionScores.contact ?? 0.55) / 6),
  };
}

export function formatScore(value) {
  return `${toPercent(value)}%`;
}
