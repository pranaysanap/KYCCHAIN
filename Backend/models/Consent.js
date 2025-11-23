import mongoose from "mongoose";

const consentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  institutionName: {
    type: String,
    required: true,
  },
  displayInstitutionName: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["granted", "revoked"],
    required: true,
  },
  blockchainTx: {
    type: String,
    default: function () {
      return "0x" + Math.random().toString(16).slice(2).padEnd(64, "0");
    },
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure unique consent per user per institution
consentSchema.index({ userId: 1, institutionName: 1 }, { unique: true });

export default mongoose.model("Consent", consentSchema);
