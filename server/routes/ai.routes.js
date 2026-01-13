import express from "express";
import upload from "../middlewares/upload.middleware.js"
import { analyzeResume } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/analyze", upload.single("resume"), analyzeResume);

export default router;
