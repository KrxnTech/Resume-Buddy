import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  saveResumeScan,
  getSavedResumes
} from "../controllers/auth.controller.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public auth endpoints
router.post("/register", register);
router.post("/login", login);

// Authenticated user endpoints
router.get("/me", verifyAuth, getMe);
router.put("/profile", verifyAuth, updateProfile);
router.post("/save-resume", verifyAuth, saveResumeScan);
router.get("/resumes", verifyAuth, getSavedResumes);

export default router;
