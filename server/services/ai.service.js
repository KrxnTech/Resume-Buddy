import Groq from "groq-sdk";

const getGroqClient = () => {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set");
    }

    return new Groq({ apiKey: GROQ_API_KEY });
};

export async function analyzeWithAI(resumeText, jobDescription) {
    const groq = getGroqClient();

    const MODEL_ID = "llama-3.3-70b-versatile";

    const prompt = `
You are an expert technical recruiter and resume analyzer.

Do THREE things simultaneously using the resume text and job description below:
1. Analyze the resume against the job description (scoring + feedback).
2. Extract and normalize structured information from the resume.
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

Rules for scoring fields:
- All scores are decimals between 0 and 1 (e.g. 0.85 means 85%).
- matchScore is the weighted overall ATS match against the job description.
- sectionScores.skills: how well the candidate's technical and soft skills match the JD requirements.
- sectionScores.experience: relevance and depth of work experience to the role.
- sectionScores.education: alignment of academic background with role requirements.
- sectionScores.projects: quality and relevance of listed projects.
- sectionScores.formatting: ATS-friendliness of resume layout (avoid tables, images, fancy headers).
- sectionScores.contact: presence of email, phone, LinkedIn or portfolio links.
- atsExplanation: 2-3 sentences explaining the overall ATS score and what would most improve it.

Rules for parsedResume extraction:
- github: full GitHub URL if found, else null.
- linkedin: full LinkedIn URL if found, else null.
- portfolio: any personal website / portfolio URL that is NOT github or linkedin, else null.
- hardSkills: technical skills — programming languages, frameworks, tools, platforms. Normalize to title-case. Remove duplicates.
- softSkills: interpersonal / behavioural skills (e.g. "Leadership", "Communication"). Normalize to title-case. Remove duplicates.
- certifications: any certifications, courses with issuer if available (e.g. "AWS Certified Developer – Amazon"). Empty array if none.
- awards: honors, prizes, recognition. Empty array if none.
- languages: spoken/written human languages (e.g. "English", "Hindi"). Do NOT include programming languages here.
- publications: research papers, articles, blog posts. Empty array if none.
- internships: company names + roles of internship positions only (e.g. "Software Intern – Google"). Empty array if none.
- achievements: notable accomplishments not captured elsewhere (e.g. hackathon wins, open-source contributions, metrics like \"reduced latency by 40%\"). Empty array if none.
- For all array fields: if the section does not exist in the resume, return an empty array [].

Rules for recruiterReview:
- decision: one of the allowed values based on overall hiring readiness and role fit.
- confidence: integer 0-100 explaining how strongly the assessment is supported by the resume evidence.
- overallComment: 1-2 sentences that sound like an experienced recruiter wrote them.
- hiringProbability: overall probability of hiring the candidate for this role, 0-100.
- technicalRoundChance: probability of advancing to a technical interview, 0-100.
- hrRoundChance: probability of advancing to HR screening, 0-100.
- offerChance: probability of receiving an offer if the process continues, 0-100.
- salaryFit: compatibility percentages for each seniority level, using readiness rather than salary estimates.
- topStrengths: 5-8 concise strengths inferred from the resume and role fit.
- majorRisks: 5-8 concise concerns or missing signals that reduce recruiter confidence.
- bestRoles: 3-5 role recommendations with compatibility percentages and short reasons.
- recruiterNotes: 5 recruiter-style observations that summarize the overall evaluation.
- finalRecommendations: 5 ranked recommendations with priority, expected ATS improvement, expected recruiter impact, and difficulty.

Rules for rewriteStudio:
- Rewrite each resume section to be professional, ATS-friendly, recruiter-friendly, concise, and impactful.
- NEVER invent facts, skills, companies, metrics, or achievements. Only enhance existing content.
- Convert weak, vague statements into measurable, action-verb-driven achievements.
- Use strong action verbs (e.g. Developed, Architected, Optimized, Spearheaded, Implemented).
- improvementScore: 0-100 rating of how much the rewrite improves the original.
- confidence: 0-100 rating of how confident the AI is in the rewrite quality.
- whyImproved: 1-2 sentences explaining exactly why the rewritten version is stronger.
- actionVerbs: list of strong action verbs used in the improved version.
- estimatedAtsImprovement: short description of ATS score impact (e.g. "+5-10% keyword density").
- recruiterImpact: short description of recruiter impression impact (e.g. "Significantly stronger first impression").
- For summary: extract the professional summary/objective from the resume. If none exists, return null.
- For experience: extract each work experience bullet/entry separately. If none exist, return empty array [].
- For projects: extract each project description separately. If none exist, return empty array [].
- For skills: only reorganize existing skills into logical categories (Frontend, Backend, Database, DevOps, Other). Do NOT invent new skills. Remove empty categories. If no skills found, return null.
- For achievements: extract and rewrite each achievement. If none exist, return empty array [].
- For careerObjective: rewrite if present, otherwise return null.
- For certifications: rewrite/format if present, otherwise return null.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        model: MODEL_ID,
        temperature: 0.3,
        max_tokens: 4096
    });

    const rawText = chatCompletion.choices?.[0]?.message?.content;

    if (!rawText) {
        console.error("UNEXPECTED GROQ RESPONSE:", chatCompletion);
        throw new Error("Invalid Groq response structure");
    }

    try {
        return JSON.parse(rawText);
    } catch {
        const match = rawText.match(/\{[\s\S]*\}/);
        if (!match) {
            throw new Error("Groq response did not contain valid JSON");
        }
        return JSON.parse(match[0]);
    }
}

export async function generateCopilotReply(question, context) {
    const groq = getGroqClient();

    const prompt = `
You are ResumeOS Career Copilot.
You must answer using ONLY the context provided.
If information is unavailable, say that clearly and do not hallucinate.

User Question:
${question}

Context:
${JSON.stringify(context || {}, null, 2)}

Instructions:
- Respond like a premium career advisor.
- Be concise, actionable, and specific.
- Use bullet points when helpful.
- Never invent facts.
- End with exactly three follow-up suggestions separated by new lines in the format: "Follow-up 1: ..."
`;

    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 2048,
    });

    const rawText = chatCompletion.choices?.[0]?.message?.content;

    if (!rawText) {
        throw new Error("Invalid Groq response structure");
    }

    return rawText.trim();
}
