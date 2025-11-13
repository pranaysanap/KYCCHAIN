import { apiService } from "../services/api";

// Test script to verify backend API connectivity
export class APITester {
  private static readonly TEST_EMAIL = "test@kycchain.com";
  private static readonly TEST_OTP = "123456";

  static async testConnection(): Promise<void> {
    console.log("🔄 Starting API connectivity tests...");

    try {
      // Test 1: Send OTP
      console.log("📧 Testing send-otp endpoint...");
      const otpResponse = await apiService.sendOTP({
        email: APITester.TEST_EMAIL,
      });
      console.log("✅ Send OTP successful:", otpResponse.message);

      // In development, the OTP might be returned for testing
      if (otpResponse.otp) {
        console.log("🔑 Development OTP:", otpResponse.otp);
      }
    } catch (error) {
      console.error("❌ Send OTP failed:", error);
    }

    try {
      // Test 2: Verify OTP (will fail with test OTP, but tests endpoint)
      console.log("🔐 Testing verify-otp endpoint...");
      await apiService.verifyOTP({
        email: APITester.TEST_EMAIL,
        otp: APITester.TEST_OTP,
      });
      console.log("✅ Verify OTP endpoint accessible");
    } catch (error) {
      console.log(
        "ℹ️ Verify OTP responded (expected for test OTP):",
        (error as Error).message,
      );
    }

    try {
      // Test 3: Register (will fail due to missing OTP verification, but tests endpoint)
      console.log("📝 Testing register endpoint...");
      await apiService.register({
        fullName: "Test User",
        email: APITester.TEST_EMAIL,
        accountType: "Individual User",
        password: "test123",
        confirmPassword: "test123",
        phone: "+1234567890",
        address: "123 Test Street, Test City, TC 12345",
      });
      console.log("✅ Register endpoint accessible");
    } catch (error) {
      console.log("ℹ️ Register endpoint responded:", (error as Error).message);
    }

    try {
      // Test 4: Login (will fail with test credentials, but tests endpoint)
      console.log("🔑 Testing login endpoint...");
      await apiService.login({
        email: APITester.TEST_EMAIL,
        password: "test123",
      });
      console.log("✅ Login successful");
    } catch (error) {
      console.log(
        "ℹ️ Login endpoint responded (expected for test credentials):",
        (error as Error).message,
      );
    }

    console.log("🎉 API connectivity tests completed!");
    console.log(
      "💡 If you see responses from all endpoints, the API connection is working correctly.",
    );
  }

  static async testEmailFlow(realEmail: string): Promise<void> {
    console.log(`📧 Starting email flow test with ${realEmail}...`);

    try {
      // Send OTP to real email
      const otpResponse = await apiService.sendOTP({ email: realEmail });
      console.log("✅ OTP sent successfully:", otpResponse.message);

      if (otpResponse.otp) {
        console.log(
          "🔑 Development OTP (use this to verify):",
          otpResponse.otp,
        );
        console.log(
          "💡 In production, you would check your email for the OTP.",
        );
      }

      console.log("📝 Next steps:");
      console.log("1. Check your email for the OTP code");
      console.log("2. Use the OTP in the email verification modal");
      console.log("3. Complete the registration flow");
    } catch (error) {
      console.error("❌ Email flow test failed:", error);
    }
  }
}

// Auto-run basic connectivity test in development
if (process.env.NODE_ENV === "development") {
  // Add a delay to ensure the app has loaded
  setTimeout(() => {
    console.log("🚀 KYCChain API Test Suite");
    console.log("Run APITester.testConnection() to test API endpoints");
    console.log(
      'Run APITester.testEmailFlow("your@email.com") to test email flow',
    );

    // Make functions available in console for manual testing
    (window as { APITester?: typeof APITester }).APITester = APITester;
  }, 2000);
}

export default APITester;
