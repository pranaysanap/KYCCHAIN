import mongoose from "mongoose";

const userDocumentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
  file_url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  folder: {
    type: String,
    required: true,
  },
  documentId: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  sha256: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'uploaded',
  },
  blockchainTx: {
    type: String,
    default: null,
  },
  aiReport: {
    type: Object,
    default: null,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("UserDocument", userDocumentSchema);
