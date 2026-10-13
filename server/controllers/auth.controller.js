import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { fallbackUserStore } from "../middlewares/auth.middleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "resume_buddy_super_secure_jwt_secret_2026_auth_key";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id ? user._id.toString() : user.id,
      email: user.email,
      name: user.name,
      role: user.role || "Pro Member",
      title: user.title || "Full Stack Engineer"
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const sanitizeUser = (user) => {
  const u = user.toObject ? user.toObject() : { ...user };
  delete u.password;
  return {
    id: u._id ? u._id.toString() : u.id,
    name: u.name,
    email: u.email,
    role: u.role || "Pro Member",
    title: u.title || "Software Engineer",
    avatar: u.avatar || "",
    savedResumes: u.savedResumes || [],
    createdAt: u.createdAt || new Date()
  };
};

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, title } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Full Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: "Email address is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists in DB
    let existingUser = null;
    try {
      existingUser = await User.findOne({ email: normalizedEmail });
    } catch {
      existingUser = fallbackUserStore.get(normalizedEmail);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "An account with this email address already exists. Please log in instead."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let savedUser = null;
    try {
      const newUser = new User({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        title: title || "Software Engineer",
        role: "Pro Member",
        savedResumes: []
      });
      savedUser = await newUser.save();
    } catch (dbErr) {
      console.warn("MongoDB write fallback:", dbErr.message);
      // Fallback in-memory
      const fallbackId = `user_${Date.now()}`;
      savedUser = {
        _id: fallbackId,
        id: fallbackId,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        title: title || "Software Engineer",
        role: "Pro Member",
        savedResumes: [],
        createdAt: new Date()
      };
      fallbackUserStore.set(fallbackId, savedUser);
      fallbackUserStore.set(normalizedEmail, savedUser);
    }

    // Cache in fallback store for resilience
    const userId = savedUser._id ? savedUser._id.toString() : savedUser.id;
    fallbackUserStore.set(userId, savedUser);
    fallbackUserStore.set(normalizedEmail, savedUser);

    const token = generateToken(savedUser);

    return res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to Resume Buddy.",
      token,
      user: sanitizeUser(savedUser)
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to register account. Please try again."
    });
  }
};

/**
 * Login existing user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Both email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = null;
    try {
      user = await User.findOne({ email: normalizedEmail });
    } catch {
      user = fallbackUserStore.get(normalizedEmail);
    }

    if (!user) {
      user = fallbackUserStore.get(normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password. Please verify your credentials."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password. Please verify your credentials."
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to log in. Please try again."
    });
  }
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: sanitizeUser(req.user)
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch user profile" });
  }
};

/**
 * Update authenticated user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, title, avatar } = req.body;
    const userId = req.user._id || req.user.id;

    let updatedUser = null;
    try {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...(name ? { name: name.trim() } : {}),
          ...(title ? { title: title.trim() } : {}),
          ...(avatar ? { avatar } : {})
        },
        { new: true }
      );
    } catch {
      // fallback
    }

    if (!updatedUser) {
      const existing = fallbackUserStore.get(userId) || req.user;
      updatedUser = {
        ...existing,
        name: name ? name.trim() : existing.name,
        title: title ? title.trim() : existing.title,
        avatar: avatar !== undefined ? avatar : existing.avatar
      };
      fallbackUserStore.set(userId, updatedUser);
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: sanitizeUser(updatedUser)
    });
  } catch (error) {
    console.error("UpdateProfile Error:", error);
    return res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};

/**
 * Save a resume analysis scan to user account
 */
export const saveResumeScan = async (req, res) => {
  try {
    const { fileName, candidateName, targetRole, atsScore, matchScore, acceptedChangesCount } = req.body;
    const userId = req.user._id || req.user.id;

    const newScan = {
      fileName: fileName || "Resume.pdf",
      candidateName: candidateName || "Candidate",
      targetRole: targetRole || "Software Engineer",
      atsScore: atsScore || 85,
      matchScore: matchScore || 85,
      acceptedChangesCount: acceptedChangesCount || 0,
      analyzedAt: new Date()
    };

    let user = null;
    try {
      user = await User.findById(userId);
      if (user) {
        user.savedResumes.unshift(newScan);
        await user.save();
      }
    } catch {
      // fallback
    }

    if (!user) {
      const cached = fallbackUserStore.get(userId) || req.user;
      if (!cached.savedResumes) cached.savedResumes = [];
      cached.savedResumes.unshift(newScan);
      fallbackUserStore.set(userId, cached);
      user = cached;
    }

    return res.status(200).json({
      success: true,
      message: "Resume scan saved to your account!",
      savedResumes: user.savedResumes
    });
  } catch (error) {
    console.error("SaveResumeScan Error:", error);
    return res.status(500).json({ success: false, error: "Failed to save resume scan" });
  }
};

/**
 * Get all saved resumes for the authenticated user
 */
export const getSavedResumes = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    let user = null;
    try {
      user = await User.findById(userId);
    } catch {
      user = fallbackUserStore.get(userId) || req.user;
    }

    return res.status(200).json({
      success: true,
      savedResumes: user?.savedResumes || []
    });
  } catch (error) {
    console.error("GetSavedResumes Error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch saved resumes" });
  }
};
