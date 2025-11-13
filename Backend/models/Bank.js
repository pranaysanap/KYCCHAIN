import mongoose from "mongoose";

const bankSchema = new mongoose.Schema({
  institutionName: {
    type: String,
    required: true,
    trim: true,
  },
  normalizedInstitutionName: {
    type: String,
    trim: true,
    lowercase: true,
  },
  displayInstitutionName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
    default: "",
  },
  accountType: {
    type: String,
    default: "Bank/Institution",
  },
}, {
  timestamps: true
});

export default mongoose.model("Bank", bankSchema);
