import express from "express";
import {
  startInterview,
  submitAnswer,
  getSession,
  endInterview,
  getHint,
} from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/start", startInterview);
router.post("/answer", submitAnswer);
router.get("/session/:id", getSession);
router.post("/end", endInterview);
router.post("/hint", getHint);

export default router;
