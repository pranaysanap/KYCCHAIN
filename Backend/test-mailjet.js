import dotenv from "dotenv";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Mailjet = require("node-mailjet");

// Load environment variables
dotenv.config();

console.log("🧪 Testing Mailjet Configuration...\n");

// Check if environment variables are loaded
console.log("📋 Environment Variables Check:");
console.log("   MAIL_API:", process.env.MAIL_API ? "✅ Loaded" : "❌ Missing");
console.log("   MAIL_SEC:", process.env.MAIL_SEC ? "✅ Loaded" : "❌ Missing");
console.log(
  "   MAIL_END:",
  process.env.MAIL_END || "https://api.mailjet.com/v3.1/send",
);
console.log("   Sender Email: ratyat416@gmail.com\n");

// Initialize Mailjet
const mailjet = Mailjet.apiConnect(process.env.MAIL_API, process.env.MAIL_SEC);

// Test email sending
async function testMailjetConnection() {
  try {
    console.log("📧 Sending test email...\n");

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "ratyat416@gmail.com",
            Name: "KYCChain Test",
          },
          To: [
            {
              Email: "ratyat416@gmail.com", // Send to same email for testing
              Name: "Test User",
            },
          ],
          Subject: "KYCChain Mailjet Configuration Test",
          TextPart:
            "This is a test email from KYCChain to verify Mailjet configuration.",
          HTMLPart: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">KYCChain</h1>
                  <p style="color: #e8eaf6; margin: 10px 0 0 0;">Configuration Test</p>
                </div>
                <div style="padding: 30px;">
                  <h2 style="color: #2d3748; margin: 0 0 20px 0;">✅ Test Successful!</h2>
                  <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                    If you're reading this email, your Mailjet configuration is working correctly!
                  </p>
                  <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 16px;">Configuration Details:</h3>
                    <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
                      <li>Sender: ratyat416@gmail.com</li>
                      <li>Service: Mailjet Email API</li>
                      <li>Status: Connected ✅</li>
                      <li>Timestamp: ${new Date().toLocaleString()}</li>
                    </ul>
                  </div>
                  <p style="color: #718096; font-size: 14px; margin-top: 20px;">
                    Your KYCChain OTP emails will be sent from this verified address.
                  </p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                    This is an automated test from KYCChain Backend
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        },
      ],
    });

    const result = await request;

    console.log("✅ EMAIL SENT SUCCESSFULLY!\n");
    console.log("📊 Response Details:");
    console.log("   Status:", result.response.status);
    console.log("   Message ID:", result.body.Messages[0].To[0].MessageID);
    console.log("   Message UUID:", result.body.Messages[0].To[0].MessageUUID);
    console.log("\n🎉 Mailjet configuration is working correctly!");
    console.log(
      "   Check your inbox at ratyat416@gmail.com for the test email.\n",
    );
  } catch (error) {
    console.error("\n❌ EMAIL SENDING FAILED!\n");
    console.error("Error Details:");
    console.error("   Status Code:", error.statusCode || "N/A");
    console.error("   Message:", error.message);

    if (error.statusCode === 401) {
      console.error("\n🔑 Authentication Error:");
      console.error("   - Check that MAIL_API and MAIL_SEC are correct");
      console.error("   - Verify credentials in Mailjet dashboard");
      console.error("   - Make sure .env file is in Backend directory");
    } else if (error.statusCode === 400) {
      console.error("\n⚠️ Bad Request:");
      console.error(
        "   - Verify sender email (ratyat416@gmail.com) is verified in Mailjet",
      );
      console.error("   - Check email format is correct");
    } else if (error.statusCode === 403) {
      console.error("\n🚫 Forbidden:");
      console.error("   - Sender email may not be verified");
      console.error("   - Check Mailjet account status");
    } else {
      console.error("\n🔧 Troubleshooting Steps:");
      console.error("   1. Verify .env file exists in Backend directory");
      console.error("   2. Check MAIL_API and MAIL_SEC values");
      console.error("   3. Verify ratyat416@gmail.com in Mailjet dashboard");
      console.error("   4. Check Mailjet account quota and status");
      console.error("   5. Review error message above for specific details");
    }

    console.error("\n📖 Full Error:", error);
  }
}

// Run the test
console.log("🚀 Starting Mailjet connection test...\n");
testMailjetConnection();
