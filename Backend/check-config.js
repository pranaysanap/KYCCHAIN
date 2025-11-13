import dotenv from "dotenv";
import mongoose from "mongoose";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Mailjet = require("node-mailjet");

// Load environment variables
dotenv.config();

console.log("🔍 KYCChain Configuration Check\n");
console.log("=".repeat(50));

// ✅ Check Environment Variables
console.log("\n📋 Environment Variables:");
console.log("-".repeat(50));

const requiredEnvVars = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  MAIL_API: process.env.MAIL_API,
  MAIL_SEC: process.env.MAIL_SEC,
  MAIL_END: process.env.MAIL_END,
  PORT: process.env.PORT,
};

let allEnvVarsPresent = true;
for (const [key, value] of Object.entries(requiredEnvVars)) {
  const status = value ? "✅" : "❌";
  const displayValue = value
    ? key === "MAIL_SEC" || key === "JWT_SECRET"
      ? "***" + value.slice(-4)
      : value.length > 50
        ? value.slice(0, 47) + "..."
        : value
    : "MISSING";

  console.log(`   ${status} ${key}: ${displayValue}`);

  if (!value) allEnvVarsPresent = false;
}

if (!allEnvVarsPresent) {
  console.log("\n❌ Missing environment variables!");
  console.log("   Please check your .env file in Backend directory");
  process.exit(1);
}

console.log("\n✅ All environment variables loaded successfully!");

// ✅ Check MongoDB Connection
console.log("\n🗄️  MongoDB Connection Test:");
console.log("-".repeat(50));

async function checkMongoDB() {
  try {
    console.log("   Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("   ✅ MongoDB Connected Successfully!");
    console.log("   Database:", mongoose.connection.name);
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.log("   ❌ MongoDB Connection Failed!");
    console.log("   Error:", error.message);
    console.log("\n   Troubleshooting:");
    console.log("   1. Check your internet connection");
    console.log("   2. Verify MongoDB URI is correct");
    console.log("   3. Ensure MongoDB Atlas cluster is running");
    console.log("   4. Check firewall/VPN settings");
    return false;
  }
}

// ✅ Check Mailjet Configuration
console.log("\n📧 Mailjet Configuration Test:");
console.log("-".repeat(50));

async function checkMailjet() {
  try {
    const mailjet = Mailjet.apiConnect(
      process.env.MAIL_API,
      process.env.MAIL_SEC,
    );

    console.log("   Testing Mailjet API connection...");

    // Try to get account information (lightweight test)
    const request = mailjet.get("sender").request();
    await request;

    console.log("   ✅ Mailjet API Connected Successfully!");
    console.log("   Sender Email: ratyat416@gmail.com");
    console.log("   API Endpoint:", process.env.MAIL_END);
    return true;
  } catch (error) {
    console.log("   ❌ Mailjet Connection Failed!");
    console.log("   Error:", error.message);

    if (error.statusCode === 401) {
      console.log("\n   Issue: Authentication Failed");
      console.log("   Solution: Check MAIL_API and MAIL_SEC are correct");
    } else if (error.statusCode === 403) {
      console.log("\n   Issue: Access Forbidden");
      console.log("   Solution: Verify sender email is verified in Mailjet");
    } else {
      console.log("\n   Troubleshooting:");
      console.log("   1. Verify MAIL_API and MAIL_SEC in .env");
      console.log("   2. Check Mailjet account status");
      console.log("   3. Verify sender email (ratyat416@gmail.com)");
    }
    return false;
  }
}

// ✅ Run All Checks
async function runAllChecks() {
  console.log("\n" + "=".repeat(50));
  console.log("Starting Configuration Tests...");
  console.log("=".repeat(50));

  const mongoOk = await checkMongoDB();
  const mailjetOk = await checkMailjet();

  console.log("\n" + "=".repeat(50));
  console.log("📊 Configuration Check Summary");
  console.log("=".repeat(50));
  console.log(`   Environment Variables: ✅ Loaded (6 variables)`);
  console.log(`   MongoDB Connection: ${mongoOk ? "✅ Working" : "❌ Failed"}`);
  console.log(
    `   Mailjet Configuration: ${mailjetOk ? "✅ Working" : "❌ Failed"}`,
  );

  console.log("\n" + "=".repeat(50));

  if (mongoOk && mailjetOk) {
    console.log("✅ All Systems Ready!");
    console.log("\n🚀 You can now start the server with: npm start");
  } else {
    console.log("⚠️  Some Issues Detected");
    console.log("\n   Please fix the issues above before starting the server.");

    if (!mongoOk) {
      console.log("\n   📝 MongoDB Issue:");
      console.log("      This is likely a network/connectivity problem.");
      console.log(
        "      The server can still run, but database operations will fail.",
      );
    }

    if (!mailjetOk) {
      console.log("\n   📝 Mailjet Issue:");
      console.log("      Email sending (OTP) will not work.");
      console.log("      Verify your Mailjet credentials and sender email.");
    }
  }

  console.log("\n" + "=".repeat(50) + "\n");

  process.exit(mongoOk && mailjetOk ? 0 : 1);
}

// Run the checks
runAllChecks();
