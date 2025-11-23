import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import cloudinary from "../cloudinary.js";
import UserDocument from "../models/UserDocument.js";
import { authenticateToken } from "./auth.js";

const router = express.Router();

// Configure Multer for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for supported formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "text/plain", // Allow text files for testing
  ];

  console.log("File mimetype:", file.mimetype, "Original name:", file.originalname);

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// POST /upload-document
// Require authentication for uploads to avoid anonymous/test uploads
router.post(
  "/upload-document",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
  try {
    const { documentType } = req.body;
    const file = req.file;

    // Take email from authenticated token if available; fallback to explicit body.email only when provided
    const emailFromToken = req.user && req.user.email;
    const emailFromBody = req.body && req.body.email;
    const email = (emailFromToken || (emailFromBody ? String(emailFromBody).trim().toLowerCase() : null));

    console.log("Upload request received:", {
      documentType,
      email: email || "<no-email>",
      file: file ? file.originalname : "no file",
      uploader: req.user ? req.user.email : "anonymous",
    });

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (!documentType) {
      return res.status(400).json({ success: false, message: "DocumentType is required" });
    }

    if (!email) {
      // Don't accept uploads without a valid email from auth or body
      return res.status(400).json({ success: false, message: "Uploader email not provided or not authenticated" });
    }

    // Use email directly as folder name (normalized to lowercase)
    const sanitizedEmail = email.trim().toLowerCase();

    // Upload to Cloudinary
    // Use sanitized email as the main folder, and documentType as subfolder
    const folder = `${sanitizedEmail}/${documentType}`;

    console.log("Uploading to Cloudinary with folder:", folder);

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto", // Use "auto" to handle different file types
      folder,
    });

    console.log("Cloudinary upload result:", result.secure_url);

    // Remove temporary file
      // Compute SHA-256 hash of the file BEFORE removing the temp file
      const fileBuffer = fs.readFileSync(file.path);
      const sha256Hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // Remove temporary file
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkErr) {
        console.warn(`Warning: failed to remove temp file ${file.path}:`, unlinkErr && unlinkErr.message ? unlinkErr.message : unlinkErr);
        // proceed even if unlink fails
      }

    // Generate unique document ID
    const documentId = 'doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    // Mock blockchain transaction and AI report
    const blockchainTx = '0x' + Math.random().toString(16).substr(2, 64);
    const aiReport = {
      anomalyScore: Math.random() * 0.3,
      forgeryProbability: Math.random() * 0.2,
      duplicateDetection: false,
      faceMismatch: false,
      tamperedImage: false,
      confidence: 0.95 + Math.random() * 0.05
    };

    // Save to MongoDB
    const newDocument = new UserDocument({
      email,
      documentType,
      file_url: result.secure_url,
      public_id: result.public_id,
      folder,
      documentId,
      fileName: file.originalname,
      sha256: sha256Hash,
      status: 'uploaded',
      blockchainTx,
      aiReport,
      fileSize: file.size,
      fileType: file.mimetype,
    });
    await newDocument.save();

    console.log("Document saved to MongoDB");

    // Response
    res.json({
      success: true,
      message: "Document uploaded successfully to Cloudinary",
      file_url: result.secure_url,
      public_id: result.public_id,
      email,
      documentType,
      folder,
      documentId,
      sha256: sha256Hash,
      status: 'uploaded',
      blockchainTx,
      aiReport,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
});

export default router;
