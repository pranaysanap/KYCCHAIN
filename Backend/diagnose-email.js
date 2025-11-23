// Email Delivery Diagnostic Script
// Run this to check and fix email delivery issues

import dotenv from "dotenv";
import Mailjet from "node-mailjet";

// Load environment variables
dotenv.config();

console.log("\n🔍 Email Delivery Diagnostic Tool");
console.log("=" .repeat(50));

// Step 1: Check Environment Variables
console.log("\n📋 Step 1: Checking Environment Variables");
console.log("-" .repeat(50));

const MAIL_API = process.env.MAIL_API;
const MAIL_SEC = process.env.MAIL_SEC;
const SENDER_EMAIL = process.env.SENDER_EMAIL || "ratyat416@gmail.com";

console.log("✓ MAIL_API:", MAIL_API ? `${MAIL_API.substring(0, 10)}...` : "❌ MISSING");
console.log("✓ MAIL_SEC:", MAIL_SEC ? `${MAIL_SEC.substring(0, 10)}...` : "❌ MISSING");
console.log("✓ SENDER_EMAIL:", SENDER_EMAIL);

if (!MAIL_API || !MAIL_SEC) {
  console.error("\n❌ ERROR: Mailjet credentials are missing!");
  console.error("Please check your .env file and ensure:");
  console.error("  MAIL_API=your_mailjet_api_key");
  console.error("  MAIL_SEC=your_mailjet_secret_key");
  process.exit(1);
}

// Step 2: Initialize Mailjet
console.log("\n📧 Step 2: Initializing Mailjet");
console.log("-" .repeat(50));

let mailjet;
try {
  mailjet = Mailjet.apiConnect(MAIL_API, MAIL_SEC);
  console.log("✓ Mailjet initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Mailjet:", error.message);
  process.exit(1);
}

// Step 3: Test Mailjet Connection
console.log("\n🔌 Step 3: Testing Mailjet Connection");
console.log("-" .repeat(50));

async function testConnection() {
  try {
    const result = await mailjet.get("sender", { version: "v3" }).request();
    console.log("✓ Connection successful!");
    console.log(`✓ Found ${result.body.Data.length} verified sender(s)`);

    if (result.body.Data.length > 0) {
      console.log("\n📨 Verified Senders:");
      result.body.Data.forEach((sender, index) => {
        console.log(`  ${index + 1}. ${sender.Email} - Status: ${sender.Status}`);
      });
    }

    return result.body.Data;
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    if (error.statusCode === 401) {
      console.error("   → Invalid API credentials. Please check your MAIL_API and MAIL_SEC");
    }
    return null;
  }
}

// Step 4: Check Sender Email Verification
console.log("\n✉️  Step 4: Checking Sender Email Verification");
console.log("-" .repeat(50));

async function checkSenderVerification(senders) {
  if (!senders || senders.length === 0) {
    console.error("❌ No verified sender emails found!");
    console.error("\n📝 To fix this:");
    console.error("   1. Go to https://app.mailjet.com/account/sender");
    console.error("   2. Add and verify your sender email: " + SENDER_EMAIL);
    console.error("   3. Wait for verification email and confirm");
    return false;
  }

  const senderVerified = senders.find(s =>
    s.Email.toLowerCase() === SENDER_EMAIL.toLowerCase() &&
    s.Status === "Active"
  );

  if (senderVerified) {
    console.log("✓ Sender email is verified and active!");
    return true;
  } else {
    console.error("❌ Sender email is NOT verified!");
    console.error(`   Current sender: ${SENDER_EMAIL}`);
    console.error("\n📝 Available verified senders:");
    senders.forEach(sender => {
      console.error(`   - ${sender.Email} (${sender.Status})`);
    });
    return false;
  }
}

// Step 5: Send Test Email
console.log("\n📮 Step 5: Sending Test Email");
console.log("-" .repeat(50));

async function sendTestEmail(testEmailAddress) {
  const testOTP = Math.floor(100000 + Math.random() * 900000).toString();

  console.log(`Sending test OTP to: ${testEmailAddress}`);
  console.log(`Test OTP Code: ${testOTP}`);

  // Simple HTML template for testing
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 40px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h1 style="color: #667eea; text-align: center;">KYCChain Test Email</h1>
    <p style="font-size: 16px; color: #333;">This is a test email from your KYCChain application.</p>
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0;">
      <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">Your Test OTP:</p>
      <p style="color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: monospace;">${testOTP}</p>
    </div>
    <p style="font-size: 14px; color: #666;">If you received this email, your email delivery is working correctly! ✅</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="font-size: 12px; color: #999; text-align: center;">Test sent at ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>`;

  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: SENDER_EMAIL,
            Name: "KYCChain Test",
          },
          To: [
            {
              Email: testEmailAddress,
              Name: "Test User",
            },
          ],
          Subject: "🧪 KYCChain - Test Email Delivery",
          TextPart: `Your test OTP code is: ${testOTP}`,
          HTMLPart: htmlContent,
        },
      ],
    });

    const result = await request;

    console.log("\n✅ Email sent successfully!");
    console.log("📊 Response Details:");
    console.log(`   Status: ${result.response.status} ${result.response.statusText}`);
    console.log(`   Messages sent: ${result.body.Messages.length}`);

    if (result.body.Messages[0]) {
      const msg = result.body.Messages[0];
      console.log(`   Message ID: ${msg.To[0].MessageID}`);
      console.log(`   Message UUID: ${msg.To[0].MessageUUID}`);
    }

    console.log("\n📬 Next Steps:");
    console.log("   1. Check your inbox: " + testEmailAddress);
    console.log("   2. Check your spam/junk folder");
    console.log("   3. Wait 1-2 minutes for delivery");
    console.log("   4. Your test OTP code is: " + testOTP);

    return true;
  } catch (error) {
    console.error("\n❌ Failed to send test email!");
    console.error("Error:", error.message);

    if (error.statusCode) {
      console.error("Status Code:", error.statusCode);
    }

    if (error.response && error.response.body) {
      console.error("Error Details:", JSON.stringify(error.response.body, null, 2));
    }

    console.error("\n🔧 Common Issues:");
    console.error("   1. Sender email not verified in Mailjet");
    console.error("   2. Invalid API credentials");
    console.error("   3. Mailjet account suspended or limited");
    console.error("   4. Daily sending limit reached");

    return false;
  }
}

// Step 6: Check Mailjet Account Status
async function checkAccountStatus() {
  console.log("\n📊 Step 6: Checking Mailjet Account Status");
  console.log("-" .repeat(50));

  try {
    const result = await mailjet.get("myprofile", { version: "v3" }).request();
    const profile = result.body.Data[0];

    console.log("✓ Account Information:");
    console.log(`   Email: ${profile.Email || 'N/A'}`);
    console.log(`   Username: ${profile.Username || 'N/A'}`);

    // Check sending statistics
    try {
      const stats = await mailjet.get("statcounters", { version: "v3" }).request();
      if (stats.body.Data && stats.body.Data.length > 0) {
        const todayStats = stats.body.Data[0];
        console.log("\n📈 Today's Statistics:");
        console.log(`   Messages Sent: ${todayStats.MessageSentCount || 0}`);
        console.log(`   Messages Delivered: ${todayStats.MessageDeliveredCount || 0}`);
        console.log(`   Messages Opened: ${todayStats.MessageOpenedCount || 0}`);
      }
    } catch (statsError) {
      console.log("   (Could not fetch statistics)");
    }

  } catch (error) {
    console.error("❌ Could not fetch account information");
    console.error("   This may indicate API permission issues");
  }
}

// Main Execution
async function runDiagnostics() {
  try {
    // Run connection test
    const senders = await testConnection();

    if (!senders) {
      console.error("\n❌ Diagnostic failed at connection test");
      return;
    }

    // Check sender verification
    const isVerified = await checkSenderVerification(senders);

    if (!isVerified) {
      console.error("\n❌ Diagnostic failed: Sender email not verified");
      console.error("\n🔧 SOLUTION:");
      console.error("   1. Go to: https://app.mailjet.com/account/sender");
      console.error("   2. Click 'Add a sender address'");
      console.error("   3. Enter: " + SENDER_EMAIL);
      console.error("   4. Check your inbox and verify the email");
      console.error("   5. Run this diagnostic again");
      return;
    }

    // Check account status
    await checkAccountStatus();

    // Ask for test email
    console.log("\n" + "=".repeat(50));
    console.log("📮 Ready to send test email!");
    console.log("=".repeat(50));

    // Get test email from command line argument or use default
    const testEmail = process.argv[2] || SENDER_EMAIL;

    if (!testEmail || !testEmail.includes("@")) {
      console.error("\n❌ Invalid email address");
      console.error("Usage: node diagnose-email.js your-email@example.com");
      return;
    }

    await sendTestEmail(testEmail);

    console.log("\n" + "=".repeat(50));
    console.log("✅ Diagnostic Complete!");
    console.log("=".repeat(50));
    console.log("\nIf you received the test email, your setup is working!");
    console.log("If not, please check the error messages above.\n");

  } catch (error) {
    console.error("\n❌ Diagnostic Error:", error.message);
    console.error("\nPlease check your Mailjet configuration and try again.");
  }
}

// Run the diagnostics
runDiagnostics();
