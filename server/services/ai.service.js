import Groq from "groq-sdk";
import { extractAndParseJSON } from "../utils/jsonRepair.js";

const getGroqClient = () => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in environment variables");
  }

  return new Groq({ apiKey: GROQ_API_KEY });
};

// Priority list of models with high reliability on Groq
const DEFAULT_CANDIDATE_MODELS = [
  "qwen/qwen3.8-27b",
  "groq/compound-mini",
  "qwen/qwen3.6-27b",
  "openai/gpt-oss-20b"
];

function getCandidateModels() {
  const primary = process.env.GROQ_MODEL?.trim();
  const models = primary ? [primary, ...DEFAULT_CANDIDATE_MODELS] : DEFAULT_CANDIDATE_MODELS;
  return Array.from(new Set(models));
}

export async function analyzeWithAI(resumeText, jobDescription) {
  const groq = getGroqClient();

  // Guard against excessive inputs causing token overflow
  const safeResume = (resumeText || "").slice(0, 16000).trim();
  const safeJD = (jobDescription || "").slice(0, 6000).trim();

  const prompt = `
You are an expert technical recruiter and resume analyzer.

Do THREE things simultaneously using the resume text and job description below:
1. Analyze the resume against the job description (scoring + feedback).
2. Extract a complete, highly structured Candidate Profile from the resume.
3. Generate professional AI rewrites for each resume section.

Return ONLY valid JSON in this exact format (no markdown, no code fences, just raw JSON):
{
  "matchScore": number,
  "strengths": string[],
  "missingSkills": string[],
  "improvements": string[],
  "summary": string,
  "sectionScores": {
    "skills": number,
    "experience": number,
    "education": number,
    "projects": number,
    "formatting": number,
    "contact": number
  },
  "atsExplanation": string,
  "candidateProfile": {
    "identity": {
      "fullName": string | null,
      "professionalTitle": string | null
    },
    "professionalSummary": string | null,
    "contact": {
      "email": string | null,
      "phone": string | null,
      "location": string | null,
      "portfolio": string | null,
      "github": string | null,
      "linkedin": string | null
    },
    "education": [
      {
        "degree": string,
        "institution": string,
        "graduationYear": string,
        "details": string | null
      }
    ],
    "experience": [
      {
        "title": string,
        "company": string,
        "period": string,
        "highlights": string[]
      }
    ],
    "internships": [
      {
        "title": string,
        "company": string,
        "period": string,
        "highlights": string[]
      }
    ],
    "skills": {
      "languages": string[],
      "frameworks": string[],
      "libraries": string[],
      "databases": string[],
      "cloud": string[],
      "tools": string[],
      "softSkills": string[]
    },
    "projects": [
      {
        "name": string,
        "description": string,
        "technologies": string[],
        "link": string | null
      }
    ],
    "certifications": string[],
    "achievements": string[],
    "awards": string[],
    "publications": string[],
    "leadership": string[],
    "careerGoals": string[]
  },
  "parsedResume": {
    "github": string | null,
    "linkedin": string | null,
    "portfolio": string | null,
    "hardSkills": string[],
    "softSkills": string[],
    "certifications": string[],
    "awards": string[],
    "languages": string[],
    "publications": string[],
    "internships": string[],
    "achievements": string[]
  },
  "recruiterReview": {
    "decision": "Strong Hire" | "Hire" | "Consider" | "Borderline" | "Reject",
    "confidence": number,
    "overallComment": string,
    "hiringProbability": number,
    "technicalRoundChance": number,
    "hrRoundChance": number,
    "offerChance": number,
    "salaryFit": {
      "Entry Level": number,
      "Junior": number,
      "Mid": number,
      "Senior": number,
      "Lead": number
    },
    "topStrengths": string[],
    "majorRisks": string[],
    "bestRoles": [
      {
        "role": string,
        "compatibility": number,
        "reason": string
      }
    ],
    "recruiterNotes": string[],
    "finalRecommendations": [
      {
        "priority": "High" | "Medium" | "Low",
        "action": string,
        "expectedAtsImprovement": string,
        "expectedRecruiterImpact": string,
        "difficulty": "Easy" | "Medium" | "Hard"
      }
    ]
  },
  "rewriteStudio": {
    "summary": {
      "original": string,
      "improved": string,
      "improvementScore": number,
      "confidence": number,
      "whyImproved": string,
      "actionVerbs": string[],
      "estimatedAtsImprovement": string,
      "recruiterImpact": string
    } | null,
    "experience": [
      {
        "original": string,
        "improved": string,
        "improvementScore": number,
        "confidence": number,
        "whyImproved": string,
        "actionVerbs": string[],
        "estimatedAtsImprovement": string,
        "recruiterImpact": string
      }
    ],
    "projects": [
      {
        "original": string,
        "improved": string,
        "improvementScore": number,
        "confidence": number,
        "whyImproved": string,
        "actionVerbs": string[],
        "estimatedAtsImprovement": string,
        "recruiterImpact": string
      }
    ],
    "skills": {
      "original": string[],
      "reorganized": {
        "Frontend": string[],
        "Backend": string[],
        "Database": string[],
        "DevOps": string[],
        "Other": string[]
      },
      "improvementScore": number,
      "whyImproved": string
    } | null,
    "achievements": [
      {
        "original": string,
        "improved": string,
        "improvementScore": number,
        "confidence": number,
        "whyImproved": string,
        "actionVerbs": string[],
        "estimatedAtsImprovement": string,
        "recruiterImpact": string
      }
    ],
    "careerObjective": {
      "original": string,
      "improved": string,
      "improvementScore": number,
      "confidence": number,
      "whyImproved": string,
      "actionVerbs": string[],
      "estimatedAtsImprovement": string,
      "recruiterImpact": string
    } | null,
    "certifications": {
      "original": string,
      "improved": string,
      "improvementScore": number,
      "confidence": number,
      "whyImproved": string,
      "actionVerbs": string[],
      "estimatedAtsImprovement": string,
      "recruiterImpact": string
    } | null
  }
}

Extraction Rules:
- Extract all factual details faithfully from the candidate's resume.
- candidateProfile.skills: organize into languages, frameworks, libraries, databases, cloud, tools, softSkills.
- parsedResume: mirror hardSkills (combining languages, frameworks, databases, cloud, tools) and contact links for backwards compatibility.
- matchScore is a decimal 0-1.
- DO NOT invent details not found in the resume. Return empty arrays [] or null if a section is absent.

Resume:
${safeResume}

Job Description:
${safeJD}
`;

  const candidateModels = getCandidateModels();
  let lastError = null;

  for (const model of candidateModels) {
    try {
      const maxTokens = 3500;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model,
        temperature: 0.2,
        max_tokens: maxTokens
      });

      const rawText = chatCompletion.choices?.[0]?.message?.content;

      if (!rawText) {
        throw new Error(`Empty response from Groq model ${model}`);
      }

      const parsed = extractAndParseJSON(rawText);

      // Ensure candidateProfile and parsedResume are consistent
      if (parsed.candidateProfile && !parsed.parsedResume) {
        const cp = parsed.candidateProfile;
        const allHardSkills = [
          ...(cp.skills?.languages || []),
          ...(cp.skills?.frameworks || []),
          ...(cp.skills?.databases || []),
          ...(cp.skills?.cloud || []),
          ...(cp.skills?.tools || [])
        ];
        parsed.parsedResume = {
          github: cp.contact?.github || null,
          linkedin: cp.contact?.linkedin || null,
          portfolio: cp.contact?.portfolio || null,
          hardSkills: Array.from(new Set(allHardSkills)),
          softSkills: cp.skills?.softSkills || [],
          certifications: cp.certifications || [],
          awards: cp.awards || [],
          languages: cp.skills?.languages || [],
          publications: cp.publications || [],
          internships: (cp.internships || []).map(i => `${i.title} – ${i.company}`),
          achievements: cp.achievements || []
        };
      }

      return parsed;
    } catch (error) {
      console.warn(`Groq model ${model} failed (${error.message}). Attempting fallback if available...`);
      lastError = error;
    }
  }

  console.error("All AI analysis models failed. Last error:", lastError);
  throw lastError || new Error("Failed to analyze resume with available AI models");
}

export async function generateCopilotReply(question, context = {}, history = []) {
  const groq = getGroqClient();

  const safeContext = context || {};
  const candidateProfile = safeContext.candidateProfile || safeContext.parsedResume || {};
  const matchScore = safeContext.matchScore != null ? Math.round(Number(safeContext.matchScore) * 100) + "%" : "Not evaluated";
  const strengths = safeContext.strengths || [];
  const missingSkills = safeContext.missingSkills || [];
  const recruiter = safeContext.recruiter || safeContext.recruiterReview || {};
  const jobDescription = safeContext.jobDescription || "";
  const atsSummary = safeContext.ats || safeContext.atsExplanation || "";

  const systemPrompt = `
You are the candidate's personal AI Career Copilot. You have full, deep access to this candidate's structured profile, career experience, and recruiter analysis.

CANDIDATE PROFILE:
${JSON.stringify(candidateProfile, null, 2)}

EVALUATION CONTEXT:
- ATS Match Score: ${matchScore}
- ATS Explanation: ${atsSummary || "N/A"}
- Candidate Strengths: ${JSON.stringify(strengths)}
- Missing / Improvement Skills: ${JSON.stringify(missingSkills)}
- Recruiter Decision: ${recruiter.decision || "N/A"} (Confidence: ${recruiter.confidence || "N/A"}%)
- Recruiter Top Strengths: ${JSON.stringify(recruiter.topStrengths || [])}
- Recruiter Concerns: ${JSON.stringify(recruiter.majorRisks || [])}
- Target Job Description: ${jobDescription ? jobDescription.slice(0, 1000) : "N/A"}

CRITICAL RULES:
1. YOU ALREADY KNOW THIS CANDIDATE. Answer directly as their personal career advisor without asking them to explain their background.
2. NEVER HALLUCINATE OR INVENT FACTS. If information is not in the candidate's profile or analysis, explicitly say: "I don't have that information in your profile."
3. ANSWER ONLY WHAT WAS ASKED. Do not dump unrelated sections, scores, or random resume summaries unless requested.
4. NO BULKY ESSAYS OR FILLER. Never start with "Based on your profile as a..." or "As an AI...". Get straight to the answer.
5. ADAPTIVE LENGTH INTELLIGENCE:
   - Direct/factual question: 1–3 concise sentences.
   - List question: 3–6 crisp bullet points.
   - Comparison: Compact table or short contrasting bullet points.
6. FORMATTING: Use clean Markdown (bold keywords, small clean lists, minimal small headers). Keep it modern, clean, and UI-friendly.
`;

  // Format conversation history (up to last 8 turns)
  const historyMessages = Array.isArray(history)
    ? history
        .slice(-8)
        .filter(m => m && typeof m.content === "string" && m.content.trim())
        .map(m => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content.trim()
        }))
    : [];

  const messages = [
    { role: "system", content: systemPrompt },
    ...historyMessages,
    { role: "user", content: question }
  ];

  const candidateModels = getCandidateModels();
  let lastError = null;

  for (const model of candidateModels) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model,
        temperature: 0.25,
        max_tokens: 800,
      });

      const rawText = chatCompletion.choices?.[0]?.message?.content;

      if (!rawText) {
        throw new Error(`Empty response from Groq model ${model}`);
      }

      return rawText.trim();
    } catch (error) {
      console.warn(`Groq copilot model ${model} failed (${error.message}). Trying fallback...`);
      lastError = error;
    }
  }

  throw lastError || new Error("Failed to generate copilot reply");
}
