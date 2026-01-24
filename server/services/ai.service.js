export async function analyzeWithAI(resumeText, jobDescription) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const MODEL_ID = "gemini-pro-latest"; // ✅ NO "models/" prefix

    const prompt = `
You are an expert technical recruiter and resume analyzer.

Analyze the resume against the job description.

Return ONLY valid JSON in this exact format:
{
  "matchScore": number,
  "strengths": string[],
  "missingSkills": string[],
  "improvements": string[],
  "summary": string
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }]
                    }
                ]
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error("GEMINI API ERROR:", data);
        throw new Error(data.error?.message || "Gemini API error");
    }

    const rawText =
        data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
        console.error("UNEXPECTED GEMINI RESPONSE:", data);
        throw new Error("Invalid Gemini response structure");
    }

    try {
        return JSON.parse(rawText);
    } catch {
        const match = rawText.match(/\{[\s\S]*\}/);
        if (!match) {
            throw new Error("Gemini response did not contain JSON");
        }
        return JSON.parse(match[0]);
    }
}
