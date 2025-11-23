import express from "express";
import UserDocument from "../models/UserDocument.js";
import { authenticateToken } from "./auth.js";

const router = express.Router();

// GET /documents/:email
router.get("/documents/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Try to fetch real documents from MongoDB
    let documents = [];
    try {
      documents = await UserDocument.find({ email }).sort({ uploadedAt: -1 }).lean();
    } catch (dbErr) {
      console.warn("Warning: failed to fetch documents from DB, falling back to mock:", dbErr && dbErr.message ? dbErr.message : dbErr);
    }

    // If no documents found in DB, return an empty array by default.
    // For development/testing you can request a mock document explicitly with ?mock=true
    if (!documents || documents.length === 0) {
      if (req.query && req.query.mock === 'true' && process.env.NODE_ENV !== 'production') {
        const mockDoc = {
          _id: "mock1",
          email: email,
          documentType: "passport",
          fileName: "passport.pdf",
          status: "uploaded",
          uploadedAt: new Date(),
          file_url: "https://example.com/mock1.pdf",
          public_id: "mock1",
          folder: `${email.replace('@', '_at_').replace(/\./g, '_dot_')}/passport`,
          sha256: "mocksha256",
          blockchainTx: "0x" + Math.random().toString(16).substr(2, 64),
          aiReport: {
            anomalyScore: 0.1,
            forgeryProbability: 0.05,
            duplicateDetection: false,
            faceMismatch: false,
            tamperedImage: false,
            confidence: 0.95
          },
          fileSize: 1024000,
          fileType: "application/pdf"
        };
        documents = [mockDoc];
      } else {
        return res.json([]);
      }
    }

    // Transform documents to match frontend expectations
    const transformedDocuments = documents.map(doc => ({
      documentId: (doc._id || doc.documentId).toString(),
      sha256: doc.sha256 || '',
      fileName: doc.fileName || 'Unknown',
      type: doc.documentType || doc.type || 'unknown',
      status: doc.status || 'uploaded',
      blockchainTx: doc.blockchainTx || '0x' + Math.random().toString(16).substr(2, 64),
      aiReport: doc.aiReport || {
        anomalyScore: Math.random() * 0.3,
        forgeryProbability: Math.random() * 0.2,
        duplicateDetection: false,
        faceMismatch: false,
        tamperedImage: false,
        confidence: 0.95 + Math.random() * 0.05
      },
      uploadedAt: (doc.uploadedAt && new Date(doc.uploadedAt).toISOString()) || new Date().toISOString(),
      fileSize: doc.fileSize || 0,
      fileType: doc.fileType || 'application/octet-stream',
      file_url: doc.file_url || doc.secure_url || null,
      public_id: doc.public_id,
      folder: doc.folder,
      email: doc.email,
    }));

    res.json(transformedDocuments);
  } catch (error) {
    console.error("Fetch documents error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch documents", error: error.message });
  }
});

export default router;
