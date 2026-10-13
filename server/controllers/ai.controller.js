import { analyzeWithAI } from "../services/ai.service.js";

export const analyzeResume = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        let resumeText = req.body.resumeText;

        // If resume text wasn't directly in the body, check if a text/resume file was uploaded
        if (!resumeText && req.file) {
            resumeText = req.file.buffer.toString("utf-8");
        }

        // VALIDATION
        if (!resumeText || !resumeText.trim()) {
            return res.status(400).json({
                error: "Resume content is required. Please paste your resume text or upload your resume file."
            });
        }

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                error: "Job description is required"
            });
        }

        const sanitizedResumeText = resumeText
            .replace(/\r\n/g, "\n")
            .replace(/\n+/g, "\n")
            .replace(/\s+/g, " ")
            .trim();

        if (sanitizedResumeText.length < 20) {
            return res.status(400).json({
                error: "Resume text is too short. Please provide at least 20 characters."
            });
        }

        // AI ANALYSIS
        const analysis = await analyzeWithAI(sanitizedResumeText, jobDescription);

        // SEND AI RESULT
        res.status(200).json({
            success: true,
            analysis
        });

    } catch (error) {
        console.error("AI ANALYSIS ERROR:", error);
        res.status(500).json({
            error: error.message || "Failed to analyze resume"
        });
    }
};
