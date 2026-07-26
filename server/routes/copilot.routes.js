import express from "express";
import { copilotReply } from "../controllers/copilot.controller.js";

const router = express.Router();

router.post("/copilot", copilotReply);

export default router;
