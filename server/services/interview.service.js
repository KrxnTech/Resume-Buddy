import Groq from "groq-sdk";
import { extractAndParseJSON } from "../utils/jsonRepair.js";

const getGroqClient = () => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in environment variables");
  }

  return new Groq({ apiKey: GROQ_API_KEY });
};

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

async function callGroqWithFallback(prompt, temperature = 0.2, maxTokens = 1200) {
  const groq = getGroqClient();
  const candidateModels = getCandidateModels();
  let lastError = null;

  for (const model of candidateModels) {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model,
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error(`Empty response from Groq model ${model}`);
      }

      return content;
    } catch (err) {
      console.warn(`Groq interview model ${model} failed (${err.message}). Trying fallback...`);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate interview response from AI models");
}

/**
 * Generates the first interview question based on the candidate's profile and chosen mode.
 */
export async function generateFirstQuestion(session) {
  const candidate = session.candidateContext?.candidateProfile || session.candidateContext?.parsedResume || {};
  const mode = session.mode || "technical";
  const difficulty = session.currentDifficulty || "medium";
  const targetRole = session.targetRole || "Software Engineer";
  const jobDescription = session.candidateContext?.jobDescription || "";

  const prompt = `
You are an expert technical interviewer conducting a mock interview for the role of "${targetRole}".
Interview Mode: ${mode}
Difficulty Level: ${difficulty}

CANDIDATE RESUME PROFILE:
${JSON.stringify(candidate, null, 2)}

JOB DESCRIPTION (IF APPLICABLE):
${jobDescription ? jobDescription.slice(0, 1000) : "Not specified"}

CRITICAL INTERVIEW RULES:
1. YOU ARE CONDUCTING A REALISTIC INTERVIEW. You already know this candidate's verified background.
2. Formulate Question #1 specifically targeting this candidate's background and chosen interview mode:
   - If mode is "technical": Focus on their primary stack, system design, architecture, or core language fundamentals.
   - If mode is "project": Pick one of their actual projects from their resume (e.g. name it specifically) and ask an architectural or implementation question.
   - If mode is "resume": Pick a specific claim, metric, or accomplishment from their resume and ask for technical specifics.
   - If mode is "behavioral": Ask a personalized STAR behavioral question referencing their actual company or project context.
   - If mode is "mixed": Start with a strong technical or project architecture question.
   - If mode is "job_specific": Connect their existing experience to key requirements in the job description.
3. NEVER invent companies or projects not present in the resume.
4. Keep the question crisp, professional, and direct. Ask exactly ONE question.

Return ONLY valid JSON in this exact structure (no markdown fences, just raw JSON):
{
  "question": string,
  "topic": string,
  "contextNote": string
}
`;

  const rawText = await callGroqWithFallback(prompt, 0.25, 500);
  const parsed = extractAndParseJSON(rawText);

  return {
    text: parsed.question || "Can you walk me through the high-level architecture of your most impactful project?",
    topic: parsed.topic || "Project Architecture",
    difficulty,
    questionIndex: 1,
  };
}

/**
 * Evaluates the candidate's answer and generates the next dynamic question (or final report if done).
 */
export async function evaluateAnswerAndNext(session, userAnswer) {
  const candidate = session.candidateContext?.candidateProfile || session.candidateContext?.parsedResume || {};
  const currentQ = session.currentQuestion;
  const isLastQuestion = session.currentQuestionIndex >= session.totalQuestions;
  const targetRole = session.targetRole || "Software Engineer";
  const mode = session.mode;

  const previousHistory = session.history.slice(-4).map((h) => ({
    q: h.question,
    a: h.answer,
    score: h.evaluation?.overall,
  }));

  const evaluationPrompt = `
You are an expert technical interviewer evaluating a candidate's response in detail and deciding the next step.
Role: ${targetRole}
Interview Mode: ${mode}
Current Question #${session.currentQuestionIndex}: "${currentQ?.text}"
Current Question Topic: "${currentQ?.topic}"
Difficulty Level: "${session.currentDifficulty}"

Candidate Answer:
"${userAnswer}"

Recent History:
${JSON.stringify(previousHistory, null, 2)}

Candidate Resume Context:
${JSON.stringify(candidate, null, 2)}

TASKS:
1. Provide a comprehensive structured evaluation of the candidate's response:
   - overall: decimal score (0.0 to 10.0)
   - technicalAccuracy: number (0 to 10)
   - relevance: number (0 to 10)
   - clarity: number (0 to 10)
   - depth: number (0 to 10)
   - communication: number (0 to 10)
   - evidence: number (0 to 10)
   - accuracyPercentage: number (0 to 100 percentage, e.g. 82)
   - accuracySummary: 1-2 sentence assessment of accuracy
   - strongPoints: 3-5 concise bullet points of what the candidate answered correctly / key strengths
   - areasToImprove: 2-4 concise bullet points of what was missed, vague, or needed deeper explanation
   - expectedAnswer: 4-7 step-by-step key points that a strong senior candidate would explain
   - interviewerVerdict: 2-3 sentences concise interviewer verdict on the answer
   - howToMakeStronger: 3-5 specific technical concepts, keywords, or patterns to mention to elevate the answer
   - idealImprovement: 1-2 sentences on what a complete senior answer should have touched on

2. Next Question Decision (Is Last Question = ${isLastQuestion}):
   ${
     isLastQuestion
       ? 'Since this is the final question, set "nextQuestion" to null.'
       : `Generate Question #${session.currentQuestionIndex + 1}.
   - If the previous answer was good, probe deeper, ask about trade-offs, edge-cases, scalability, or failure scenarios.
   - If the answer was weak/vague, ask for clarification or pivot to a core foundational concept.
   - Keep questions connected to the candidate's verified stack and projects.
   - Ask exactly ONE question.`
   }

3. If session difficulty is "adaptive", suggest the new difficulty level ("easy" | "medium" | "hard") based on performance:
   - score >= 8.0 -> "hard"
   - score < 5.5 -> "easy"
   - otherwise -> "medium"

Return ONLY valid JSON (no markdown fences, just raw JSON):
{
  "evaluation": {
    "overall": number,
    "technicalAccuracy": number,
    "relevance": number,
    "clarity": number,
    "depth": number,
    "communication": number,
    "evidence": number,
    "accuracyPercentage": number,
    "accuracySummary": string,
    "strongPoints": string[],
    "areasToImprove": string[],
    "expectedAnswer": string[],
    "interviewerVerdict": string,
    "howToMakeStronger": string[],
    "idealImprovement": string
  },
  "adaptiveDifficulty": "easy" | "medium" | "hard",
  "nextQuestion": {
    "question": string,
    "topic": string
  } | null
}
`;

  const rawText = await callGroqWithFallback(evaluationPrompt, 0.25, 1100);
  const parsed = extractAndParseJSON(rawText);

  const rawOverall = Number(parsed.evaluation?.overall) || 7.5;
  const accuracyPct = Number(parsed.evaluation?.accuracyPercentage) || Math.round(rawOverall * 10);

  const evaluation = {
    overall: rawOverall,
    technicalAccuracy: Number(parsed.evaluation?.technicalAccuracy) || rawOverall,
    relevance: Number(parsed.evaluation?.relevance) || 7.5,
    clarity: Number(parsed.evaluation?.clarity) || 7.5,
    depth: Number(parsed.evaluation?.depth) || 7.0,
    communication: Number(parsed.evaluation?.communication) || 7.5,
    evidence: Number(parsed.evaluation?.evidence) || 7.0,
    accuracyPercentage: Math.min(100, Math.max(0, accuracyPct)),
    accuracySummary: parsed.evaluation?.accuracySummary || `Your answer demonstrated good technical familiarity with ${currentQ?.topic || "the core concepts"}.`,
    strongPoints: parsed.evaluation?.strongPoints || parsed.evaluation?.strengths || [
      "Identified core technical concepts accurately.",
      "Structured explanation clearly with relevant terminology."
    ],
    areasToImprove: parsed.evaluation?.areasToImprove || parsed.evaluation?.weaknesses || [
      "Detail production trade-offs and edge-cases more explicitly.",
      "Include concrete latency/scaling metrics."
    ],
    expectedAnswer: parsed.evaluation?.expectedAnswer || [
      "Define the high-level architecture and system components.",
      "Explain the exact data flow and API/event contracts.",
      "Address concurrency, caching, and failure recovery.",
      "Highlight measurable performance and scalability trade-offs."
    ],
    interviewerVerdict: parsed.evaluation?.interviewerVerdict || `Solid response showing foundational competency. Deepening system-level edge-case handling will strengthen this into a senior-level answer.`,
    howToMakeStronger: parsed.evaluation?.howToMakeStronger || [
      "Atomic transactions",
      "Race condition mitigation",
      "Scalability boundaries",
      "Monitoring & alerts"
    ],
    idealImprovement: parsed.evaluation?.idealImprovement || "Include quantitative metrics and concrete architectural trade-offs.",
    strengths: parsed.evaluation?.strongPoints || parsed.evaluation?.strengths || ["Solid technical fundamentals"],
    weaknesses: parsed.evaluation?.areasToImprove || parsed.evaluation?.weaknesses || ["Could provide more specific implementation details"],
  };

  const newDifficulty = session.difficulty === "adaptive" ? (parsed.adaptiveDifficulty || session.currentDifficulty) : session.difficulty;

  let nextQuestion = null;
  if (!isLastQuestion && parsed.nextQuestion?.question) {
    nextQuestion = {
      text: parsed.nextQuestion.question,
      topic: parsed.nextQuestion.topic || "Technical Deep-Dive",
      difficulty: newDifficulty,
      questionIndex: session.currentQuestionIndex + 1,
    };
  }

  return {
    evaluation,
    adaptiveDifficulty: newDifficulty,
    nextQuestion,
    isComplete: isLastQuestion || !nextQuestion,
  };
}

/**
 * Generates the complete post-interview performance report and score breakdown.
 */
export async function generateFinalReport(session) {
  const candidate = session.candidateContext?.candidateProfile || session.candidateContext?.parsedResume || {};
  const targetRole = session.targetRole || "Software Engineer";
  const history = session.history || [];

  const historySummary = history.map((h, i) => ({
    questionNum: i + 1,
    question: h.question,
    topic: h.topic,
    difficulty: h.difficulty,
    answer: h.answer,
    score: h.evaluation?.overall || 7.5,
    accuracyPercentage: h.evaluation?.accuracyPercentage || Math.round((h.evaluation?.overall || 7.5) * 10),
    accuracySummary: h.evaluation?.accuracySummary || "",
    strongPoints: h.evaluation?.strongPoints || h.evaluation?.strengths || [],
    areasToImprove: h.evaluation?.areasToImprove || h.evaluation?.weaknesses || [],
    expectedAnswer: h.evaluation?.expectedAnswer || [],
    interviewerVerdict: h.evaluation?.interviewerVerdict || "",
    howToMakeStronger: h.evaluation?.howToMakeStronger || [],
    idealImprovement: h.evaluation?.idealImprovement || "",
  }));

  const reportPrompt = `
You are a Lead Hiring Manager and Technical Assessor generating the final comprehensive Interview Performance Report.
Role Target: "${targetRole}"
Interview Mode: "${session.mode}"
Total Questions Answered: ${history.length}

INTERVIEW HISTORY & EVALUATIONS:
${JSON.stringify(historySummary, null, 2)}

CANDIDATE CONTEXT:
${JSON.stringify(candidate, null, 2)}

TASKS:
Generate a thorough, fair, and encouraging executive evaluation report containing:
1. overallScore (0.0 to 10.0 decimal, weighted)
2. categoryScores (0.0 to 10.0 decimals):
   - technical
   - communication
   - problemSolving
   - depth
   - confidence
3. strengths (3 to 5 clear bullet points of proven strengths during the interview)
4. weaknesses (3 to 5 constructive improvement areas observed from their answers)
5. questionsToRevisit (list of 2-4 topics/questions that had lower scores with actionable improvement advice)
6. verdict (2-3 sentences providing an executive recruiter verdict, e.g. "Strong candidate for Mid-Level role; demonstrate more production monitoring depth.")
7. breakdown (clean array matching each answered question with full evaluation fields: question, topic, difficulty, answer, score, accuracyPercentage, accuracySummary, strongPoints, areasToImprove, expectedAnswer, interviewerVerdict, howToMakeStronger)

Return ONLY valid JSON in this exact structure (no markdown fences, just raw JSON):
{
  "overallScore": number,
  "categoryScores": {
    "technical": number,
    "communication": number,
    "problemSolving": number,
    "depth": number,
    "confidence": number
  },
  "strengths": string[],
  "weaknesses": string[],
  "questionsToRevisit": [
    {
      "topic": string,
      "question": string,
      "candidateScore": number,
      "advice": string
    }
  ],
  "verdict": string,
  "breakdown": [
    {
      "question": string,
      "topic": string,
      "difficulty": string,
      "answer": string,
      "score": number,
      "accuracyPercentage": number,
      "accuracySummary": string,
      "strongPoints": string[],
      "areasToImprove": string[],
      "expectedAnswer": string[],
      "interviewerVerdict": string,
      "howToMakeStronger": string[]
    }
  ]
}
`;

  const rawText = await callGroqWithFallback(reportPrompt, 0.2, 1800);
  const parsed = extractAndParseJSON(rawText);

  // Fallback calculations if LLM misses any fields
  const avgScore = history.length
    ? Number((history.reduce((acc, h) => acc + (h.evaluation?.overall || 7.5), 0) / history.length).toFixed(1))
    : 7.5;

  return {
    overallScore: Number(parsed.overallScore) || avgScore,
    categoryScores: {
      technical: Number(parsed.categoryScores?.technical) || avgScore,
      communication: Number(parsed.categoryScores?.communication) || avgScore,
      problemSolving: Number(parsed.categoryScores?.problemSolving) || avgScore,
      depth: Number(parsed.categoryScores?.depth) || Math.max(0, avgScore - 0.4),
      confidence: Number(parsed.categoryScores?.confidence) || avgScore,
    },
    strengths: parsed.strengths || ["Solid technical fundamentals", "Clear communication of project architecture"],
    weaknesses: parsed.weaknesses || ["Discuss performance trade-offs in deeper detail", "Include more quantitative metrics"],
    questionsToRevisit: parsed.questionsToRevisit || [],
    verdict: parsed.verdict || `Demonstrated solid engineering competency for the ${targetRole} position.`,
    breakdown: parsed.breakdown || historySummary,
  };
}

/**
 * Provides a subtle coaching hint / clarification for the current question without giving away the answer.
 */
export async function getInterviewerHint(session) {
  const currentQ = session.currentQuestion;
  const targetRole = session.targetRole || "Software Engineer";

  const prompt = `
You are a supportive technical interviewer. The candidate has requested a gentle hint or clarification for this question:
Role: ${targetRole}
Question: "${currentQ?.text}"
Topic: "${currentQ?.topic}"

Provide a concise, 1-2 sentence hint that guides their thought process without giving away the direct answer.
For example, suggest an architectural angle, a key consideration (e.g. caching, error handling, trade-offs), or structure (e.g. STAR method).

Return ONLY raw text (1-2 sentences).
`;

  const hint = await callGroqWithFallback(prompt, 0.3, 200);
  return hint.trim();
}
