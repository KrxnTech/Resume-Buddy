import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import copilotRoutes from "./routes/copilot.routes.js";
import interviewRoutes from "./routes/interview.routes.js";

const app = express();

// Initialize database connection
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", aiRoutes);
app.use("/api", copilotRoutes);
app.use("/api/interview", interviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
