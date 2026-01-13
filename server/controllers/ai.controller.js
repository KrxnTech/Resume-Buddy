import { createRequire } from "module";
const require = createRequire(import.meta.url);

// pdf-parse v1.1.1 (CommonJS)
const pdfParse = require("pdf-parse");

export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "Resume PDF is required"
            });
        }

        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({
                error: "Job description is required"
            });
        }

        const pdfData = await pdfParse(req.file.buffer);

        const cleanedText = pdfData.text
            .replace(/\n+/g, "\n")
            .trim();

        res.status(200).json({
            message: "Resume parsed successfully",
            resumeText: cleanedText.substring(0, 1000),
            jobDescription
        });

    } catch (error) {
        console.error("PDF PARSE ERROR:", error);
        res.status(500).json({
            error: "Failed to process resume"
        });
    }
};
