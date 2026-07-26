import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST

import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";
import copilotRoutes from "./routes/copilot.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", aiRoutes);
app.use("/api", copilotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
