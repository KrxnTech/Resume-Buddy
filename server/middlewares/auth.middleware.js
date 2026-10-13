import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// In-memory user fallback cache for resilience
export const fallbackUserStore = new Map();

export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Please sign in to access this resource."
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "resume_buddy_super_secure_jwt_secret_2026_auth_key";
    
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired session token. Please log in again."
      });
    }

    // Try finding user in MongoDB first
    let user = null;
    try {
      user = await User.findById(decoded.id).select("-password");
    } catch {
      // If DB error or not found in DB, check fallback store
    }

    if (!user) {
      user = fallbackUserStore.get(decoded.id) || fallbackUserStore.get(decoded.email);
    }

    if (!user) {
      // If user was created with valid token, synthesize user object from token payload
      user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name || "Member",
        email: decoded.email,
        role: decoded.role || "Pro Member",
        title: decoded.title || "Full Stack Engineer"
      };
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      error: "Authentication server error"
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const secret = process.env.JWT_SECRET || "resume_buddy_super_secure_jwt_secret_2026_auth_key";
      const decoded = jwt.verify(token, secret);

      let user = null;
      try {
        user = await User.findById(decoded.id).select("-password");
      } catch {
        user = fallbackUserStore.get(decoded.id) || fallbackUserStore.get(decoded.email);
      }

      if (!user) {
        user = {
          _id: decoded.id,
          id: decoded.id,
          name: decoded.name || "Member",
          email: decoded.email,
          role: decoded.role || "Pro Member"
        };
      }
      req.user = user;
    }
  } catch {
    // Silently continue for optional auth
  }
  next();
};
