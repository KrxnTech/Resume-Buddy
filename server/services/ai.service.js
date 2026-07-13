import Groq from "groq-sdk";

export async function analyzeWithAI(resumeText, jobDescription) {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set");
    }

    const groq = new Groq({ apiKey: GROQ_API_KEY });

    const MODEL_ID = "llama-3.3-70b-versatile";

    const prompt = `
You are an expert technical recruiter and resume analyzer.

Do TWO things simultaneously using the resume text and job description below:
1. Analyze the resume against the job description (scoring + feedback).
2. Extract and normalize structured information from the resume.

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
        max_tokens: 2048
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
