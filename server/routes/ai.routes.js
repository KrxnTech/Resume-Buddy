import express from "express";
import { analyzeResume } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/analyze", analyzeResume);

export default router;
