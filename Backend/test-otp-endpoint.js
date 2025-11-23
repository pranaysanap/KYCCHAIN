// Test OTP Endpoint Directly
import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";

const API_URL = "http://localhost:5000/api/auth/send-otp";
const TEST_EMAIL = "harishjadhav500812@gmail.com";

console.log("\n🧪 Testing OTP Endpoint\n");
console.log("API URL:", API_URL);
console.log("Test Email:", TEST_EMAIL);
console.log("\nEnvironment Check:");
console.log("  MAIL_API:", process.env.MAIL_API ? "✅ Loaded" : "❌ Missing");
console.log("  MAIL_SEC:", process.env.MAIL_SEC ? "✅ Loaded" : "❌ Missing");

console.log("\n📤 Sending POST request...\n");

try {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: TEST_EMAIL,
    }),
  });

  console.log("Response Status:", response.status, response.statusText);

  const data = await response.json();

  console.log("\n📥 Response Data:");
  console.log(JSON.stringify(data, null, 2));

  if (response.ok) {
    console.log("\n✅ SUCCESS! Email sent successfully!");
    if (data.otp) {
      console.log("🔢 OTP Code:", data.otp);
    }
    console.log("\n📬 IMPORTANT:");
    console.log("   1. Check inbox:", TEST_EMAIL);
    console.log("   2. Check SPAM/JUNK folder ⚠️");
    console.log("   3. Wait 1-2 minutes");
  } else {
    console.log("\n❌ FAILED! Email not sent");
    console.log("Error:", data.error);
    console.log("Technical Details:", data.technicalDetails);

    console.log("\n🔧 TROUBLESHOOTING:");
    console.log("   1. Check server.log for detailed errors");
    console.log("   2. Verify Mailjet credentials in .env");
    console.log("   3. Check if sender email is verified");
    console.log("   4. Run: node test-mailjet-simple.js");
  }

} catch (error) {
  console.error("\n❌ REQUEST FAILED!");
  console.error("Error:", error.message);
  console.error("\n🔧 Make sure:");
  console.error("   1. Server is running (npm start)");
  console.error("   2. Server is on port 5000");
  console.error("   3. No firewall blocking localhost");
}

console.log("\n");
