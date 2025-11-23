import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Bank from "../models/Bank.js";
import Otp from "../models/Otp.js";
import premiumOTPTemplate from "../email-templates/otp-premium.js";

// Initialize Mailjet - Import at top level
import Mailjet from "node-mailjet";

// Mailjet instance - will be initialized on first use
let mailjet = null;

// Function to get or initialize Mailjet
function getMailjet() {
  if (!mailjet) {
    try {
      if (!process.env.MAIL_API || !process.env.MAIL_SEC) {
        throw new Error(
          "MAIL_API or MAIL_SEC not found in environment variables",
        );
      }

      mailjet = Mailjet.apiConnect(process.env.MAIL_API, process.env.MAIL_SEC);

      console.log("📧 Mailjet initialized successfully");
      console.log(
        "   Using API Key:",
        process.env.MAIL_API.substring(0, 10) + "...",
      );
    } catch (error) {
      console.error("❌ Failed to initialize Mailjet:", error.message);
      throw error;
    }
  }
  return mailjet;
}

const router = express.Router();

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "default_secret", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// ✅ Send OTP Route (Step 1 of registration)
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Trim and convert email to lowercase for consistent handling
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).maxTimeMS(30000);
    const existingBank = await Bank.findOne({
      email: normalizedEmail,
    }).maxTimeMS(30000);
    if (existingUser || existingBank) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database (will expire in 5 minutes) - use normalized email
    await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      { otp },
      { upsert: true, new: true },
    );

    // For development: Log OTP (remove this in production)
    console.log(`\n📧 OTP Email Request:`);
    console.log(`   To: ${normalizedEmail}`);
    console.log(`   OTP: ${otp}`);
    console.log(`   From: ratyat416@gmail.com`);

    // Try to send email with OTP using Mailjet
    try {
      // Get or initialize Mailjet
      const mailjetClient = getMailjet();

      const request = mailjetClient.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "ratyat416@gmail.com", // Your verified sender email
              Name: "KYCChain",
            },
            To: [
              {
                Email: normalizedEmail,
                Name: "User",
              },
            ],
            Subject: "Your KYCChain Verification Code",
            TextPart: `Your KYCChain verification code is: ${otp}. This code will expire in 5 minutes.`,
            HTMLPart: premiumOTPTemplate(otp, email),
          },
        ],
      });

      const result = await request;

      console.log("✅ Email sent successfully!");
      console.log("   To:", normalizedEmail);
      console.log(
        "   Status:",
        result.response.status,
        result.response.statusText,
      );
      console.log(
        "   Message ID:",
        result.body.Messages[0]?.To[0]?.MessageID || "N/A",
      );
      console.log(
        "   Message UUID:",
        result.body.Messages[0]?.To[0]?.MessageUUID || "N/A",
      );
      console.log("\n📬 IMPORTANT: Check these locations:");
      console.log("   1. Inbox folder");
      console.log("   2. Spam/Junk folder");
      console.log("   3. Promotions tab (Gmail)");
      console.log("   4. Wait 1-2 minutes for delivery");

      res.json({
        message:
          "OTP sent successfully to your email. Please check your inbox and spam folder.",
        otp: otp, // Remove this line in production
        emailSent: true,
        email: normalizedEmail, // Return normalized email for consistency
      });
    } catch (emailError) {
      console.error("\n❌ EMAIL SENDING FAILED!");
      console.error("=".repeat(50));
      console.error("Error Message:", emailError.message);
      console.error("Error Name:", emailError.name);
      console.error("Status Code:", emailError.statusCode || "N/A");
      console.error("Stack Trace:", emailError.stack);

      if (emailError.response && emailError.response.body) {
        console.error(
          "Response Body:",
          JSON.stringify(emailError.response.body, null, 2),
        );
      }

      // Log full error object for debugging
      console.error("\nFull Error Object:");
      console.error(
        JSON.stringify(emailError, Object.getOwnPropertyNames(emailError), 2),
      );

      console.error("\n🔧 TROUBLESHOOTING STEPS:");
      console.error("   1. Verify Mailjet API credentials in .env file");
      console.error(
        "   2. Check if ratyat416@gmail.com is verified in Mailjet",
      );
      console.error("      → Visit: https://app.mailjet.com/account/sender");
      console.error("   3. Ensure Mailjet account is active (not suspended)");
      console.error("   4. Check daily sending limits");
      console.error("   5. Run: node diagnose-email.js your-email@example.com");
      console.error("=".repeat(50));

      // Return error to user since email is critical
      return res.status(500).json({
        error:
          "Failed to send OTP email. Please check your email address or contact support.",
        emailSent: false,
        technicalDetails:
          emailError.statusCode === 401
            ? "Email service authentication failed"
            : "Email delivery service error",
      });
    }
  } catch (error) {
    console.error("❌ Send OTP Error:", error);
    console.error("   Full Error:", error.message);
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
});

// ✅ Verify OTP Route (Step 2 of registration)
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Trim and convert email to lowercase for consistent handling
    const normalizedEmail = email.trim().toLowerCase();

    // Find OTP in database
    const otpRecord = await Otp.findOne({ email: normalizedEmail });

    if (!otpRecord) {
      return res.status(400).json({ error: "OTP not found or expired" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP is valid, delete it and allow registration
    await Otp.deleteOne({ email: normalizedEmail });

    console.log("✅ OTP verified successfully for:", normalizedEmail);
    res.json({
      message: "OTP verified successfully",
      verified: true,
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("❌ Verify OTP Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Complete Registration Route (Step 3 - after OTP verification)
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      institutionName,
      email,
      accountType,
      password,
      confirmPassword,
      phone,
      address,
    } = req.body;

    // Basic validation
    if (
      !email ||
      !accountType ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (accountType === "Individual User" && !fullName) {
      return res
        .status(400)
        .json({ error: "Full name is required for individual users" });
    }

    if (accountType === "Bank/Institution" && !institutionName) {
      return res
        .status(400)
        .json({ error: "Institution name is required for banks" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Trim and convert email to lowercase for consistent handling
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists in either collection
    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).maxTimeMS(30000);
    const existingBank = await Bank.findOne({
      email: normalizedEmail,
    }).maxTimeMS(30000);
    if (existingUser || existingBank) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let savedEntity;
    if (accountType === "Individual User") {
      // Create user in User collection
      const newUser = new User({
        fullName,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        address,
        accountType,
      });
      savedEntity = await newUser.save();
    } else if (accountType === "Bank/Institution") {
      // Create user in User collection with institutionName for banks
      const normalizedInst = institutionName.trim().toLowerCase();
      const newUser = new User({
        fullName: institutionName,
        institutionName,
        normalizedInstitutionName: normalizedInst,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        address,
        accountType,
      });
      savedEntity = await newUser.save();

      // Also create bank in Bank collection for backward compatibility
      const newBank = new Bank({
        institutionName,
        normalizedInstitutionName: normalizedInst,
        displayInstitutionName: institutionName,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        address,
      });
      await newBank.save();
    }

    console.log("✅ Account registered successfully for:", normalizedEmail);
    res.json({ message: "Account registered successfully 🚀" });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    console.error("   Full Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Trim and convert email to lowercase for consistent handling
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    console.log("🔍 Login attempt for:", normalizedEmail);

    // Try to find user in User collection first
    let entity = await User.findOne({ email: normalizedEmail }).maxTimeMS(
      30000,
    );
    let accountType = "Individual User";

    // If not found in User collection, try Bank collection
    if (!entity) {
      entity = await Bank.findOne({ email: normalizedEmail }).maxTimeMS(30000);
      accountType = "Bank/Institution";
    }

    if (!entity) {
      console.log("❌ User not found for email:", normalizedEmail);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log("✅ User found:", entity.email, "Account type:", accountType);

    // Check password
    const isMatch = await bcrypt.compare(trimmedPassword, entity.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", normalizedEmail);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // If 2FA enabled for this user, require OTP verification instead of issuing JWT immediately
    if (entity.twoFactorEnabled) {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP to database (expires per Otp model)
      try {
        await Otp.findOneAndUpdate({ email: normalizedEmail }, { otp }, { upsert: true, new: true });
      } catch (err) {
        console.error('Failed to save OTP for 2FA:', err);
      }

      // Try to send OTP email (best-effort). If mail fails we'll still return OTP in response for dev.
      let emailSent = false;
      try {
        const mailjetClient = getMailjet();
        const request = mailjetClient.post('send', { version: 'v3.1' }).request({
          Messages: [
            {
              From: { Email: 'ratyat416@gmail.com', Name: 'KYCChain' },
              To: [{ Email: normalizedEmail, Name: entity.fullName || 'User' }],
              Subject: 'Your KYCChain 2FA Code',
              TextPart: `Your 2FA code is: ${otp}. This code will expire in 5 minutes.`,
              HTMLPart: premiumOTPTemplate(otp, normalizedEmail),
            },
          ],
        });
        await request;
        emailSent = true;
        console.log('✅ 2FA OTP sent to', normalizedEmail);
      } catch (mailErr) {
        console.warn('⚠️ 2FA email send failed (dev fallback):', mailErr.message || mailErr);
      }

      // Do not issue JWT yet. Client must call /auth/verify-otp to complete login.
      return res.json({ twoFactorRequired: true, email: normalizedEmail, emailSent, otp: emailSent ? undefined : otp, message: '2FA required. Enter the OTP sent to your email.' });
    }

    // Generate JWT token
    const displayName =
      accountType === "Individual User"
        ? entity.fullName
        : entity.institutionName;

    const institutionNameValue =
      accountType === "Bank/Institution" ? entity.institutionName : undefined;
    const normalizedInstitutionNameValue =
      accountType === "Bank/Institution" ? entity.normalizedInstitutionName || (entity.institutionName && entity.institutionName.toLowerCase()) : undefined;

    const token = jwt.sign(
      {
        userId: entity._id,
        email: entity.email,
        fullName: displayName,
        accountType,
        institutionName: institutionNameValue,
        normalizedInstitutionName: normalizedInstitutionNameValue,
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "24h" },
    );

    // Include logoUrl for banks
    const logoUrl =
      accountType === "Bank/Institution" ? entity.logoUrl : undefined;

    console.log("✅ Login successful for:", normalizedEmail);
    res.json({
      message: "Login successful ✅",
      user: {
        fullName: displayName,
        accountType,
        institutionName: institutionNameValue,
        logoUrl,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
