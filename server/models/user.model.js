import mongoose from "mongoose";

const savedResumeSchema = new mongoose.Schema({
  fileName: { type: String, default: "Resume.pdf" },
  candidateName: { type: String, default: "Candidate" },
  targetRole: { type: String, default: "Software Engineer" },
  atsScore: { type: Number, default: 85 },
  matchScore: { type: Number, default: 85 },
  acceptedChangesCount: { type: Number, default: 0 },
  analyzedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    role: {
      type: String,
      default: "Pro Member"
    },
    title: {
      type: String,
      default: "Software Engineer"
    },
    avatar: {
      type: String,
      default: ""
    },
    savedResumes: [savedResumeSchema]
  },
  {
    timestamps: true
  }
);

// Prevent mongoose model overwrite error during hot reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
