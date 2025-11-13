// Simple Mailjet Connection Test
import dotenv from "dotenv";
import Mailjet from "node-mailjet";

dotenv.config();

console.log("\n🧪 Testing Mailjet Connection...\n");

// Check environment variables
console.log("1. Environment Variables:");
console.log("   MAIL_API:", process.env.MAIL_API ? "✅ " + process.env.MAIL_API.substring(0, 10) + "..." : "❌ MISSING");
console.log("   MAIL_SEC:", process.env.MAIL_SEC ? "✅ " + process.env.MAIL_SEC.substring(0, 10) + "..." : "❌ MISSING");

if (!process.env.MAIL_API || !process.env.MAIL_SEC) {
  console.error("\n❌ ERROR: Environment variables missing!");
  process.exit(1);
}

// Initialize Mailjet
console.log("\n2. Initializing Mailjet...");
let mailjet;

try {
  mailjet = Mailjet.apiConnect(
    process.env.MAIL_API,
    process.env.MAIL_SEC
  );
  console.log("   ✅ Mailjet object created");
} catch (error) {
  console.error("   ❌ Failed to create Mailjet object:", error.message);
  process.exit(1);
}

// Test connection
console.log("\n3. Testing API Connection...");
try {
  const result = await mailjet
    .get("sender", { version: "v3" })
    .request();

  console.log("   ✅ Connection successful!");
  console.log("   ✅ Found", result.body.Data.length, "verified sender(s)");

  if (result.body.Data.length > 0) {
    console.log("\n   📧 Verified Senders:");
    result.body.Data.forEach((sender, i) => {
      console.log(`      ${i + 1}. ${sender.Email} (${sender.Status})`);
    });
  }
} catch (error) {
  console.error("   ❌ Connection failed:", error.message);
  if (error.statusCode === 401) {
    console.error("   ❌ Authentication failed - Invalid API credentials");
  }
  process.exit(1);
}

// Send test email
console.log("\n4. Sending Test Email...");
const testEmail = process.argv[2] || "ratyat416@gmail.com";
const testOTP = Math.floor(100000 + Math.random() * 900000).toString();

console.log("   To:", testEmail);
console.log("   OTP:", testOTP);

try {
  const request = mailjet
    .post("send", { version: "v3.1" })
    .request({
      Messages: [
        {
          From: {
            Email: "ratyat416@gmail.com",
            Name: "KYCChain Test",
          },
          To: [
            {
              Email: testEmail,
              Name: "Test User",
            },
          ],
          Subject: "🧪 Test Email - KYCChain OTP",
          TextPart: `Your test OTP code is: ${testOTP}`,
          HTMLPart: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5;">
  <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
    <h1 style="color: #667eea; text-align: center;">KYCChain Test</h1>
    <p style="font-size: 16px; color: #333;">This is a test email from your KYCChain application.</p>
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 20px 0;">
      <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">Your Test OTP:</p>
      <p style="color: white; font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: monospace;">${testOTP}</p>
    </div>
    <p style="font-size: 14px; color: #666; text-align: center;">✅ If you see this, your email is working!</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #999; text-align: center;">Test sent at ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>`,
        },
      ],
    });

  const result = await request;

  console.log("\n   ✅ EMAIL SENT SUCCESSFULLY!");
  console.log("   Status:", result.response.status, result.response.statusText);
  console.log("   Message ID:", result.body.Messages[0]?.To[0]?.MessageID);
  console.log("   Message UUID:", result.body.Messages[0]?.To[0]?.MessageUUID);

  console.log("\n📬 IMPORTANT:");
  console.log("   1. Check inbox:", testEmail);
  console.log("   2. Check SPAM/JUNK folder ⚠️");
  console.log("   3. Wait 1-2 minutes for delivery");
  console.log("   4. Your test OTP:", testOTP);

} catch (error) {
  console.error("\n   ❌ EMAIL SENDING FAILED!");
  console.error("   Error:", error.message);
  console.error("   Status Code:", error.statusCode || "N/A");

  if (error.response && error.response.body) {
    console.error("   Details:", JSON.stringify(error.response.body, null, 2));
  }

  console.error("\n   🔧 POSSIBLE ISSUES:");
  console.error("      1. Sender email not verified in Mailjet");
  console.error("      2. Invalid API credentials");
  console.error("      3. Mailjet account suspended");
  console.error("      4. Daily limit exceeded");

  process.exit(1);
}

console.log("\n✅ ALL TESTS PASSED!\n");
