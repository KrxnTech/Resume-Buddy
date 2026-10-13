import { createContext, useState, useEffect } from "react";

export const AnalysisContext = createContext();

/**
 * Normalizes raw candidate profile into a uniform structured canonical resume object
 */
export function buildInitialCanonicalResume(analysis, resumeName = "Candidate") {
  if (!analysis) return null;

  const cp = analysis.candidateProfile || {};
  const pr = analysis.parsedResume || {};

  const cleanName =
    cp.identity?.fullName ||
    (resumeName ? resumeName.replace(/\.[a-zA-Z0-9]+$/i, "").split(/[\s_-]+/)[0] : "Candidate");

  const identity = {
    fullName: cleanName,
    professionalTitle: cp.identity?.professionalTitle || analysis.recruiterReview?.bestRoles?.[0]?.role || "Software Engineer",
    email: cp.identity?.email || pr.email || "candidate@email.com",
    phone: cp.identity?.phone || pr.phone || "",
    location: cp.identity?.location || pr.location || "Remote / Hybrid",
    github: cp.identity?.github || pr.github || "",
    linkedin: cp.identity?.linkedin || pr.linkedin || "",
    portfolio: cp.identity?.portfolio || pr.portfolio || "",
  };

  const professionalSummary =
    cp.professionalSummary ||
    analysis.summary ||
    `Software Engineer with proven technical experience in full-stack web development, API architecture, and scalable system design.`;

  const skills = {
    languages: cp.skills?.languages?.length ? [...cp.skills.languages] : pr.languages?.length ? [...pr.languages] : pr.hardSkills?.slice(0, 5) || ["JavaScript", "TypeScript", "Python"],
    frameworks: cp.skills?.frameworks?.length ? [...cp.skills.frameworks] : ["React", "Next.js", "Node.js", "Express"],
    databases: cp.skills?.databases?.length ? [...cp.skills.databases] : ["PostgreSQL", "MongoDB", "Redis"],
    cloud: cp.skills?.cloud?.length ? [...cp.skills.cloud] : ["AWS", "Docker", "CI/CD"],
    tools: cp.skills?.tools?.length ? [...cp.skills.tools] : ["Git", "Jest", "Postman", "Vite"],
    softSkills: cp.skills?.softSkills?.length ? [...cp.skills.softSkills] : pr.softSkills || ["Problem Solving", "Team Collaboration", "Agile Workflow"],
  };

  const experience = (cp.experience?.length ? cp.experience : pr.internships?.length ? pr.internships : [
    {
      company: "Tech Solutions Inc.",
      title: "Full Stack Engineer",
      period: "2023 - Present",
      location: "Bengaluru, India",
      highlights: [
        "Architected and deployed high-throughput backend services using Node.js and Express.",
        "Optimized database queries and API response latencies by 35% using Redis caching."
      ]
    }
  ]).map((exp) => ({
    company: exp.company || "Company",
    title: exp.title || exp.role || "Software Engineer",
    period: exp.period || exp.duration || "2023 - Present",
    location: exp.location || "Bengaluru, India",
    highlights: Array.isArray(exp.highlights)
      ? [...exp.highlights]
      : Array.isArray(exp.description)
      ? [...exp.description]
      : [typeof exp.description === "string" ? exp.description : "Developed core platform features."],
  }));

  const projects = (cp.projects?.length ? cp.projects : [
    {
      name: "Resume Buddy",
      description: "AI-Powered Career Intelligence & Technical Assessment Platform with real-time ATS scoring.",
      technologies: ["React", "Node.js", "Express", "Groq", "Redis"],
      link: "https://github.com/KrxnTech/Resume-Buddy"
    }
  ]).map((proj) => ({
    name: proj.name || "Portfolio Project",
    description: proj.description || "Full stack web application built with modern architecture.",
    technologies: Array.isArray(proj.technologies) ? [...proj.technologies] : ["React", "Node.js", "PostgreSQL"],
    link: proj.link || proj.github || "",
  }));

  const education = (cp.education?.length ? cp.education : pr.education?.length ? pr.education : [
    {
      institution: "State University of Technology",
      degree: "Bachelor of Technology in Computer Science",
      period: "2020 - 2024",
      grade: "8.6 CGPA"
    }
  ]).map((edu) => ({
    institution: edu.institution || edu.school || "University",
    degree: edu.degree || "B.Tech in Computer Science",
    period: edu.period || edu.year || "2020 - 2024",
    grade: edu.grade || edu.gpa || "",
  }));

  const certifications = (cp.certifications?.length ? cp.certifications : pr.certifications?.length ? pr.certifications : [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2024"
    }
  ]).map((cert) => (typeof cert === "string" ? { name: cert, issuer: "Verified Issuer", date: "2024" } : cert));

  return {
    identity,
    professionalSummary,
    skills,
    experience,
    projects,
    education,
    certifications,
    achievements: cp.achievements || pr.achievements || [],
    awards: cp.awards || pr.awards || [],
  };
}

export function AnalysisProvider({ children }) {
  const [resume, setResume] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [originalResume, setOriginalResume] = useState(null);
  const [canonicalResume, setCanonicalResume] = useState(null);
  const [resumeVersion] = useState(1);

  useEffect(() => {
    if (result?.analysis) {
      const initial = buildInitialCanonicalResume(result.analysis, resume?.name);
      setOriginalResume(JSON.parse(JSON.stringify(initial)));
      setCanonicalResume(JSON.parse(JSON.stringify(initial)));
    } else {
      setOriginalResume(null);
      setCanonicalResume(null);
    }
  }, [result, resume?.name]);

  const hasAnalysis = !!result?.analysis;

  return (
    <AnalysisContext.Provider
      value={{
        resume,
        setResume,
        resumeText,
        setResumeText,
        jobDesc,
        setJobDesc,
        result,
        setResult,
        loading,
        setLoading,
        error,
        setError,
        hasAnalysis,
        canonicalResume,
        originalResume,
        resumeVersion,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}
