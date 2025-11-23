import dotenv from "dotenv";
dotenv.config(); // ✅ must be first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cloudinary from "./cloudinary.js";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import verifyRoutes from "./routes/verify.js";
import uploadRoutes from "./routes/uploadRoute.js";
import documentRoutes from "./routes/documentRoute.js";
import consentRoutes from "./routes/consent.js";
import aiVerifyRoutes from "./routes/aiVerify.js";

const app = express(); // ✅ Create app instance

// Middleware
// Parse JSON bodies only for application/json to avoid attempting to parse
// multipart/form-data (file uploads) as JSON which causes "Unexpected token" errors.
// Also increase limits to allow larger JSON payloads where needed.
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/consent", consentRoutes);
app.use("/api/ai", aiVerifyRoutes);

// Default route (for testing)
app.get("/", (req, res) => res.send("Backend working 🚀"));

// ✅ Verify Mailjet Configuration
console.log("\n📧 Mailjet Email Configuration:");
console.log("   API Key:", process.env.MAIL_API ? "✅ Loaded" : "❌ Missing");
console.log(
  "   Secret Key:",
  process.env.MAIL_SEC ? "✅ Loaded" : "❌ Missing",
);
console.log(
  "   Endpoint:",
  process.env.MAIL_END || "https://api.mailjet.com/v3.1/send",
);
console.log("   Sender Email: ratyat416@gmail.com");
if (!process.env.MAIL_API || !process.env.MAIL_SEC) {
  console.warn(
    "⚠️  Warning: Mailjet credentials missing. Email sending will not work.",
  );
  console.warn("   Please add MAIL_API and MAIL_SEC to your .env file");
}
console.log("");

// MongoDB Connection (Fixed - removed deprecated options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    console.error("   Please check your internet connection and MongoDB URI");
  });

// Cloudinary Connection Test
cloudinary.api
  .ping()
  .then(() => console.log("✅ Cloudinary Connected"))
  .catch((err) => console.error("❌ Cloudinary Error:", err.message));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Backend is ready!`);
  console.log(`   API Endpoint: http://localhost:${PORT}/api`);
  console.log(
    `   Mailjet Status: ${process.env.MAIL_API ? "Configured ✅" : "Not Configured ❌"}`,
  );
  console.log(
    `\n💡 Test Mailjet: Run "node test-mailjet.js" in Backend directory\n`,
  );
});

// Generic error handler for request entity too large (payloads)
// Capture body-parser / raw-body errors and return a friendly JSON response
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    console.error('Request entity too large:', err.message);
    return res.status(413).json({ error: 'Payload too large. Max allowed size is 20MB.' });
  }
  // Not a body size error, pass along
  return next(err);
});
