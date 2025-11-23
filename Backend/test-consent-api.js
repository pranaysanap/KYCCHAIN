import fetch from "node-fetch";

const API_BASE = "http://localhost:5000/api";

// Test credentials - replace with actual test user
const TEST_USER = {
  email: "testuser@example.com",
  password: "password123",
};

let authToken = null;

async function testLogin() {
  console.log("\n🔐 Testing Login...");
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TEST_USER),
    });

    const data = await response.json();

    if (response.ok) {
      authToken = data.token;
      console.log("✅ Login successful");
      console.log("   User:", data.user.fullName);
      console.log("   Token:", authToken ? "Generated" : "Missing");
      return true;
    } else {
      console.error("❌ Login failed:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Login error:", error.message);
    return false;
  }
}

async function testGetConsents() {
  console.log("\n📋 Testing GET /api/consent/consents...");
  try {
    const response = await fetch(`${API_BASE}/consent/consents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const text = await response.text();
    console.log("   Response Status:", response.status);
    console.log("   Response Text:", text);

    try {
      const data = JSON.parse(text);
      console.log("✅ Get consents successful");
      console.log("   Consents count:", data.length);
      console.log("   Data:", JSON.stringify(data, null, 2));
      return true;
    } catch (e) {
      console.error("❌ JSON Parse Error:", e.message);
      console.error("   Server returned non-JSON response");
      return false;
    }
  } catch (error) {
    console.error("❌ Get consents error:", error.message);
    return false;
  }
}

async function testGrantConsent() {
  console.log("\n✍️  Testing POST /api/consent/consents...");
  const institutionName = "State Bank of India";

  try {
    const response = await fetch(`${API_BASE}/consent/consents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ institutionName }),
    });

    const text = await response.text();
    console.log("   Response Status:", response.status);
    console.log("   Response Text:", text);

    try {
      const data = JSON.parse(text);
      if (response.ok) {
        console.log("✅ Grant consent successful");
        console.log("   Consent:", JSON.stringify(data, null, 2));
        return true;
      } else {
        console.error("❌ Grant consent failed:", data.error);
        return false;
      }
    } catch (e) {
      console.error("❌ JSON Parse Error:", e.message);
      console.error("   Server returned non-JSON response");
      return false;
    }
  } catch (error) {
    console.error("❌ Grant consent error:", error.message);
    return false;
  }
}

async function testServerHealth() {
  console.log("\n🏥 Testing Server Health...");
  try {
    const response = await fetch(`${API_BASE.replace("/api", "")}/`, {
      method: "GET",
    });

    const text = await response.text();
    console.log("   Response Status:", response.status);
    console.log("   Response:", text);

    if (response.ok) {
      console.log("✅ Server is running");
      return true;
    } else {
      console.error("❌ Server returned error");
      return false;
    }
  } catch (error) {
    console.error("❌ Server is not running:", error.message);
    return false;
  }
}

async function runTests() {
  console.log("=".repeat(60));
  console.log("🧪 CONSENT API DIAGNOSTIC TEST");
  console.log("=".repeat(60));
  console.log(`API Base URL: ${API_BASE}`);
  console.log(`Test User: ${TEST_USER.email}`);

  // Test 1: Server Health
  const serverOk = await testServerHealth();
  if (!serverOk) {
    console.log("\n❌ Server is not running. Start the server first:");
    console.log("   cd Backend");
    console.log("   node server.js");
    return;
  }

  // Test 2: Login
  const loginOk = await testLogin();
  if (!loginOk) {
    console.log("\n❌ Login failed. Check your test credentials:");
    console.log("   1. Make sure the user exists in the database");
    console.log("   2. Register a new user if needed");
    console.log("   3. Update TEST_USER credentials in this file");
    return;
  }

  // Test 3: Get Consents
  await testGetConsents();

  // Test 4: Grant Consent
  await testGrantConsent();

  console.log("\n" + "=".repeat(60));
  console.log("✅ DIAGNOSTIC TEST COMPLETED");
  console.log("=".repeat(60));
  console.log("\nNOTES:");
  console.log("1. If you see HTML responses, the routes may not be registered");
  console.log("2. If you see 401 errors, check JWT authentication");
  console.log("3. If you see 500 errors, check MongoDB connection");
  console.log("4. Check Backend console for detailed error logs");
}

// Run tests
runTests().catch((error) => {
  console.error("\n💥 Fatal Error:", error);
  process.exit(1);
});
