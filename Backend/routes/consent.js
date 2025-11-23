import express from "express";
import Consent from "../models/Consent.js";
import User from "../models/user.js";
import Bank from "../models/Bank.js";
import UserDocument from "../models/UserDocument.js";
import { authenticateToken } from "./auth.js";

const router = express.Router();

// Get consents for the authenticated user
router.get("/consents", authenticateToken, async (req, res) => {
  try {
    console.log("📋 Get Consents Request for user:", req.user.userId);

    const consents = await Consent.find({ userId: req.user.userId });

    console.log(`✅ Found ${consents.length} consents for user`);

    // Capitalize institution names for display and normalize response shape
    const formattedConsents = consents.map((consent) => {
      const obj = consent.toObject();
      // Ensure frontend-friendly `id` property exists (string)
      obj.id = obj._id ? obj._id.toString() : undefined;
      // Capitalize first letter of each word for display
      obj.institutionName = obj.institutionName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return obj;
    });

    res.json(formattedConsents);
  } catch (error) {
    console.error("❌ Get consents error:", error);
    console.error("   Error message:", error.message);
    res.status(500).json({
      error: "Failed to fetch consents",
      details: error.message,
    });
  }
});

// Grant consent
router.post("/consents", authenticateToken, async (req, res) => {
  try {
    // Guard against missing or malformed JSON body to avoid runtime destructuring errors
    if (!req.body) {
      console.error("❌ Grant Consent: request body is missing or not parsed (req.body is undefined)");
      console.error("   Request headers:", req.headers);
      return res.status(400).json({
        error: "Institution name is required",
        details: "Request body missing or malformed. Ensure Content-Type: application/json is set and the request contains a JSON body.",
      });
    }

    const { institutionName } = req.body;

    console.log("📝 Grant Consent Request:");
    console.log("   Institution Name:", institutionName);
    console.log("   User ID:", req.user.userId);

    if (!institutionName) {
      return res.status(400).json({ error: "Institution name is required" });
    }

    // Get user details
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.error("❌ User not found:", req.user.userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ User found:", user.email, user.fullName);

  // Store in lowercase for consistency but keep original for display
  const normalizedInstitutionName = institutionName.toLowerCase();
  const displayInstitutionName = institutionName;

    // Check if consent already exists
    const existingConsent = await Consent.findOne({
      userId: req.user.userId,
      institutionName: normalizedInstitutionName,
    });

    if (existingConsent) {
      if (existingConsent.status === "granted") {
        console.log("⚠️  Consent already granted for:", institutionName);
        return res
          .status(400)
          .json({ error: "Consent already granted for this institution" });
      }
      // Update existing revoked consent to granted
      existingConsent.status = "granted";
      existingConsent.lastUpdated = new Date();
      existingConsent.blockchainTx =
        "0x" + Math.random().toString(16).slice(2).padEnd(64, "0");
      existingConsent.displayInstitutionName = displayInstitutionName;
      await existingConsent.save();

      console.log("✅ Consent updated (revoked -> granted):", institutionName);

      // Return with proper casing for display
  const response = existingConsent.toObject();
  response.id = response._id ? response._id.toString() : undefined;
  response.institutionName = institutionName;
  return res.json(response);
    }

    // Create new consent
    const consent = new Consent({
      userId: req.user.userId,
      userEmail: user.email,
      userName: user.fullName,
      institutionName: normalizedInstitutionName,
      displayInstitutionName,
      status: "granted",
    });

    await consent.save();

    console.log("✅ Consent created successfully for:", institutionName);

    // Return with proper casing for display
  const response = consent.toObject();
  response.id = response._id ? response._id.toString() : undefined;
  response.institutionName = institutionName;
  res.json(response);
  } catch (error) {
    console.error("❌ Grant consent error:", error);
    console.error("   Error message:", error.message);
    console.error("   Stack trace:", error.stack);
    res.status(500).json({
      error: "Failed to grant consent",
      details: error.message,
    });
  }
});

// Revoke consent
router.put(
  "/consents/:institutionName",
  authenticateToken,
  async (req, res) => {
    try {
      const { institutionName } = req.params;
      const normalizedInstitutionName =
        decodeURIComponent(institutionName).toLowerCase();

      console.log("🚫 Revoke Consent Request:");
      console.log("   Institution Name:", institutionName);
      console.log("   User ID:", req.user.userId);

      const consent = await Consent.findOne({
        userId: req.user.userId,
        institutionName: normalizedInstitutionName,
      });

      if (!consent) {
        console.error("❌ Consent not found for:", institutionName);
        return res.status(404).json({ error: "Consent not found" });
      }

      consent.status = "revoked";
      consent.lastUpdated = new Date();
      await consent.save();

      console.log("✅ Consent revoked successfully:", institutionName);

      // Return with proper casing for display
  const response = consent.toObject();
  response.id = response._id ? response._id.toString() : undefined;
  response.institutionName = decodeURIComponent(institutionName);
  res.json(response);
    } catch (error) {
      console.error("❌ Revoke consent error:", error);
      console.error("   Error message:", error.message);
      res.status(500).json({
        error: "Failed to revoke consent",
        details: error.message,
      });
    }
  },
);

// Get users who have granted consent to a specific institution (for banks)
router.get(
  "/consents/institution/:institutionName",
  authenticateToken,
  async (req, res) => {
    try {
      const { institutionName } = req.params;

      // Find all consents granted to this institution
      const consents = await Consent.find({
        institutionName: institutionName.toLowerCase(),
        status: "granted",
      }).populate("userId", "fullName email phone address accountType");

      // Format the response with user details
      const usersWithConsent = consents.map((consent) => ({
        userId: consent.userId._id,
        fullName: consent.userId.fullName,
        email: consent.userId.email,
        phone: consent.userId.phone,
        address: consent.userId.address,
        accountType: consent.userId.accountType,
        consentGrantedAt: consent.lastUpdated,
        institutionName: consent.institutionName,
      }));

      res.json(usersWithConsent);
    } catch (error) {
      console.error("Get institution consents error:", error);
      res.status(500).json({ error: "Failed to fetch institution consents" });
    }
  },
);

// Get verification logs for banks (all consent activities for their institution)
router.get("/verification-logs", authenticateToken, async (req, res) => {
  try {
    const {
      q = "",
      action = "all",
      from,
      to,
      page = 1,
      pageSize = 10,
    } = req.query;

    // Get the logged-in user's institution name (support Bank or User collections)
    let user = await User.findById(req.user.userId);
    if (!user) {
      user = await Bank.findById(req.user.userId);
    }

    if (!user || !user.institutionName) {
      return res
        .status(403)
        .json({ error: "Access restricted to bank accounts" });
    }

  const institutionName = (user.normalizedInstitutionName || (user.institutionName && user.institutionName.toLowerCase())) || "";

  // Coerce pagination params to numbers and provide defaults
  const pageNum = Number(page) || 1;
  const pageSizeNum = Number(pageSize) || 10;

  // Build query for consents related to this institution
  // Use a case-insensitive regex match to tolerate small differences
  // (extra spaces, parentheses, abbreviations like "(SBI)") so banks reliably see consents.
  const escaped = institutionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const institutionRegex = new RegExp(escaped, "i");
  // Match consents where either the normalized institutionName or the stored displayInstitutionName matches
  let query = {
    $or: [
      { institutionName: { $regex: institutionRegex } },
      { displayInstitutionName: { $regex: institutionRegex } },
    ],
  };

    // Filter by action (status)
    if (action !== "all") {
      if (action === "consent_granted") {
        query.status = "granted";
      } else if (action === "consent_revoked") {
        query.status = "revoked";
      }
    }

    // Filter by date range
    if (from || to) {
      query.lastUpdated = {};
      if (from) query.lastUpdated.$gte = new Date(from);
      if (to) query.lastUpdated.$lte = new Date(to);
    }

    // Filter by search query (user email or name)
    if (q) {
      query.$or = [
        { userEmail: { $regex: q, $options: "i" } },
        { userName: { $regex: q, $options: "i" } },
      ];
    }

    // Get total count
    const total = await Consent.countDocuments(query);

    // Compute aggregated stats for the institution (granted, revoked, active, totalUsers)
    const grantedCount = await Consent.countDocuments({ ...query, status: 'granted' });
    const revokedCount = await Consent.countDocuments({ ...query, status: 'revoked' });

    // total unique users who have any consent record for this institution
    const distinctUsers = await Consent.distinct('userEmail', query);
    const totalUsersCount = distinctUsers ? distinctUsers.length : 0;

    // Active consents: count of users whose latest consent status is 'granted'
    const latestPerUserAgg = await Consent.aggregate([
      { $match: query },
      { $sort: { lastUpdated: -1 } },
      { $group: { _id: '$userEmail', latestStatus: { $first: '$status' } } },
      { $match: { latestStatus: 'granted' } },
      { $count: 'activeCount' },
    ]);
    const activeCount = latestPerUserAgg[0] ? latestPerUserAgg[0].activeCount : 0;

    // Get paginated results and populate user info
    const consents = await Consent.find(query)
      .sort({ lastUpdated: -1 })
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .populate("userId", "fullName email");

    console.log(`🔍 Verification logs query for institution regex: ${institutionRegex} - found ${consents.length} items on this page`);

    // For each consent, try to resolve user email/name and latest document
    const items = await Promise.all(
      consents.map(async (consent) => {
        const id = consent._id.toString();
        const ts = consent.lastUpdated ? consent.lastUpdated.toISOString() : new Date().toISOString();

        // Prefer stored fields, fall back to populated user
        const userEmail = consent.userEmail || (consent.userId && consent.userId.email) || "";
        const userName = consent.userName || (consent.userId && consent.userId.fullName) || "";

        // Try to find latest document for this user (if any)
        let docType = null;
        try {
          if (userEmail) {
            const doc = await UserDocument.findOne({ email: userEmail }).sort({ uploadedAt: -1 }).lean();
            if (doc) docType = doc.documentType || doc.fileName || null;
          }
        } catch (err) {
          console.error("Warning: failed to fetch user document for logs", err?.message || err);
        }

        return {
          id,
          ts,
          userId: userEmail,
          userName,
          docType,
          action: consent.status === "granted" ? "consent_granted" : "consent_revoked",
          admin: consent.displayInstitutionName || consent.institutionName,
          tx: consent.blockchainTx,
          status: "success",
        };
      }),
    );

    res.json({ items, total, stats: { granted: grantedCount, revoked: revokedCount, active: activeCount, totalUsers: totalUsersCount } });
  } catch (error) {
    console.error("Get verification logs error:", error);
    res.status(500).json({ error: "Failed to fetch verification logs" });
  }
});

// Get log details for a specific consent
router.get("/verification-logs/:logId", authenticateToken, async (req, res) => {
  try {
    const { logId } = req.params;

    const consent = await Consent.findById(logId).populate(
      "userId",
      "fullName email phone address",
    );
    if (!consent) {
      return res.status(404).json({ error: "Log not found" });
    }

    // Get the logged-in user's institution name
    let user = await User.findById(req.user.userId);
    if (!user) {
      user = await Bank.findById(req.user.userId);
    }
    if (!user || !user.institutionName) {
      return res
        .status(403)
        .json({ error: "Access restricted to bank accounts" });
    }

    // Check if this consent is for the logged-in bank
    // Allow match against normalized or display institution names (case-insensitive)
    const bankEscaped = user.institutionName.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const bankRegex = new RegExp(bankEscaped, "i");
    const consentMatch =
      bankRegex.test(consent.institutionName || "") ||
      bankRegex.test(consent.displayInstitutionName || "");
    if (!consentMatch) {
      return res.status(403).json({ error: "Access denied to this log" });
    }

    // Try to include latest user document info
    let latestDoc = null;
    try {
      const email = consent.userEmail || (consent.userId && consent.userId.email);
      if (email) {
        latestDoc = await UserDocument.findOne({ email }).sort({ uploadedAt: -1 }).lean();
      }
    } catch (err) {
      console.error("Warning: failed to fetch latest document for log details", err?.message || err);
    }

    // Format detailed response
    const logDetails = {
      id: consent._id.toString(),
      ts: consent.lastUpdated ? consent.lastUpdated.toISOString() : new Date().toISOString(),
      action: consent.status === "granted" ? "consent_granted" : "consent_revoked",
      user: {
        id: consent.userEmail || (consent.userId && consent.userId.email),
        name: consent.userName || (consent.userId && consent.userId.fullName),
        email: consent.userEmail || (consent.userId && consent.userId.email),
      },
      document: {
        sha256: latestDoc ? latestDoc.sha256 : "N/A",
        tx: consent.blockchainTx,
        status: latestDoc ? latestDoc.status || "success" : "success",
      },
      description: `Consent ${consent.status} by ${consent.userName || (consent.userId && consent.userId.fullName)} for ${consent.displayInstitutionName || consent.institutionName}`,
      fraud: null,
      etherscan: `https://etherscan.io/tx/${consent.blockchainTx}`,
    };

    res.json(logDetails);
  } catch (error) {
    console.error("Get log details error:", error);
    res.status(500).json({ error: "Failed to fetch log details" });
  }
});

export default router;

// --- Debug endpoint: list consents by institution or user (for developers/admins)
// Note: this is protected by authentication. It returns detailed consent records
// and populated user info to help diagnose why banks may not see consents.
// Usage: GET /api/consent/debug/consents?institution=State%20Bank%20of%20India

// Mounted after export to avoid interfering with main routes when not used.

router.get("/debug/consents", authenticateToken, async (req, res) => {
  try {
    const { institution, userEmail } = req.query;

    if (!institution && !userEmail) {
      return res
        .status(400)
        .json({ error: "Provide ?institution=... or ?userEmail=..." });
    }

    const clauses = [];
    if (institution) {
      const inst = String(institution).toLowerCase();
      const escaped = inst.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
      const rx = new RegExp(escaped, "i");
      clauses.push({ institutionName: { $regex: rx } });
      clauses.push({ displayInstitutionName: { $regex: rx } });
    }
    if (userEmail) {
      clauses.push({ userEmail: String(userEmail) });
    }

    const query = clauses.length > 1 ? { $or: clauses } : clauses[0];

    const consents = await Consent.find(query).populate("userId", "fullName email").lean();

    return res.json({ count: consents.length, consents });
  } catch (err) {
    console.error("Debug consents error:", err);
    res.status(500).json({ error: "Failed to run debug query", details: err.message });
  }
});
