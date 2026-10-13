import { createRequire } from "module";
const require = createRequire(import.meta.url);

// pdf-parse v1.1.1 (CommonJS)
const pdfParse = require("pdf-parse");

import { analyzeWithAI } from "../services/ai.service.js";

export const analyzeResume = async (req, res) => {
    try {
        // VALIDATION
        if (!req.file) {
            return res.status(400).json({
                error: "Resume PDF is required"
            });
        }

        const { jobDescription } = req.body;
        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                error: "Job description is required"
            });
        }

        // 1️⃣ PARSE PDF
        const pdfData = await pdfParse(req.file.buffer);

        const resumeText = pdfData.text
            .replace(/\n+/g, "\n")
            .replace(/\s+/g, " ")
            .trim();

        if (!resumeText || resumeText.length < 20) {
            return res.status(400).json({
                error: "Could not extract readable text from the uploaded PDF. Please make sure it is not a scanned image PDF."
            });
        }

        // 2️⃣ AI ANALYSIS
        const analysis = await analyzeWithAI(resumeText, jobDescription);

        // 3️⃣ SEND AI RESULT
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
