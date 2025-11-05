import dotenv from "dotenv";
dotenv.config(); // ✅ must be first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import verifyRoutes from "./routes/verify.js";
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

// ✅ Load .env variables

const app = express(); // ✅ Create app instance

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/verify", verifyRoutes);

// Default route (for testing)
app.get("/", (req, res) => res.send("Backend working 🚀"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

