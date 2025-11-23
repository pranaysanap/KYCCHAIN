# KYCChain Email Verification Flow - Quick Start Guide

## 🚀 Getting Started

This guide will help you quickly test the complete email verification flow implementation.

## ⚡ Quick Setup

### 1. Start the Backend Server
```bash
# Navigate to backend directory
cd Backend

# Install dependencies (if not already done)
npm install

# Start the server
npm start
# or
node server.js
```

The backend should be running on `http://localhost:5000`

### 2. Start the Frontend Development Server
```bash
# Navigate to the main project directory
cd /path/to/KYCCHAIN

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The frontend should be running on `http://localhost:5173`

## 🧪 Testing the Email Verification Flow

### Method 1: Full User Flow (Recommended)

1. **Open the Application**
   - Navigate to `http://localhost:5173`
   - You should see the KYCChain landing page

2. **Start Email Verification**
   - Click the "Get Started" button in the Hero section
   - The Email Verification Modal should open

3. **Enter Your Email**
   - Enter a valid email address you can access
   - Click "Send Verification Code"
   - Check your email for the 6-digit OTP code

4. **Enter OTP Code**
   - The modal will switch to OTP input
   - Enter the 6-digit code from your email
   - The animated input boxes will auto-focus and validate

5. **Complete Registration**
   - After successful OTP verification, the Registration Modal opens
   - Your email will be pre-filled and disabled
   - Choose account type (Individual User or Bank/Institution)
   - Fill in all required fields:
     - Full Name or Institution Name
     - Phone number
     - Address
     - Password (minimum 6 characters)
     - Confirm password
   - Click "Create Account"

6. **Automatic Login**
   - You'll be automatically logged in after successful registration
   - You'll be redirected to the dashboard with your personalized welcome message

### Method 2: API Testing (Developer Mode)

1. **Open Browser Console**
   - Press F12 or right-click → Inspect Element
   - Go to the Console tab

2. **Run API Tests**
   ```javascript
   // Test basic API connectivity
   APITester.testConnection()

   // Test email flow with your real email
   APITester.testEmailFlow("your-email@example.com")
   ```

3. **Check Results**
   - The console will show detailed test results
   - Any API connection issues will be clearly displayed

### Method 3: Login Flow Testing

1. **Access Login Modal**
   - Click "Login" in the header
   - Enter valid credentials for an existing account

2. **Demo Accounts (if available)**
   - Click "Demo User" or "Demo Bank" for quick testing
   - Note: Demo accounts use mock credentials

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Email Not Received
```
Problem: OTP email doesn't arrive
Solutions:
- Check spam/junk folder
- Verify email address spelling
- Check backend console for Mailjet errors
- Ensure Mailjet API keys are configured correctly
```

#### 2. API Connection Error
```
Problem: "Network error occurred" or similar
Solutions:
- Ensure backend server is running on port 5000
- Check browser console for CORS errors
- Verify API_BASE_URL in frontend code
```

#### 3. OTP Verification Fails
```
Problem: "Invalid OTP" error
Solutions:
- Ensure you're using the correct 6-digit code
- Check if OTP has expired (5 minutes)
- Request a new OTP using the "Resend Code" button
```

#### 4. Registration Fails
```
Problem: Registration form shows errors
Solutions:
- Ensure all fields are filled correctly
- Check password meets minimum requirements (6+ characters)
- Verify passwords match
- Check backend logs for specific validation errors
```

## 🛠 Development Features

### Console Commands (Available in Development)
```javascript
// Access the API tester
APITester.testConnection()
APITester.testEmailFlow("test@example.com")

// Check authentication state
useAuth() // (if you're in a React component)

// Clear local storage (force logout)
localStorage.clear()
```

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('kycchain_debug', 'true')

// Check stored authentication data
console.log('User:', localStorage.getItem('kycchain_user'))
console.log('Token:', localStorage.getItem('kycchain_token'))
console.log('Profile:', localStorage.getItem('kycchain_profile'))
```

## 📱 User Experience Features

### Email Verification Modal
- ✅ Two-step process (Email → OTP)
- ✅ 6 animated input boxes with auto-focus
- ✅ Paste support for OTP codes
- ✅ Resend functionality with countdown
- ✅ Back navigation between steps
- ✅ Loading states and error handling

### Registration Modal
- ✅ Dynamic form based on account type
- ✅ Pre-filled email from verification
- ✅ Real-time validation
- ✅ Password strength indicators
- ✅ Proper error messaging

### Dashboard Integration
- ✅ Dynamic user welcome message
- ✅ Role-based content display
- ✅ Persistent login state
- ✅ Proper logout functionality

## 🔒 Security Features

### Implemented Security
- ✅ JWT token authentication
- ✅ OTP expiration (5 minutes)
- ✅ Password hashing (backend)
- ✅ Input validation (client & server)
- ✅ CORS protection
- ✅ Rate limiting (resend countdown)

## 📊 Test Scenarios

### Happy Path
1. Enter valid email → OTP sent
2. Enter correct OTP → Verification success
3. Complete registration form → Account created
4. Automatic login → Dashboard access

### Error Scenarios
1. Invalid email format → Validation error
2. Wrong OTP code → Error message + retry
3. Expired OTP → Request new code
4. Incomplete registration → Field validation
5. Password mismatch → Clear error message

## 🎯 Next Steps

After testing the basic flow:

1. **Test Edge Cases**
   - Very long email addresses
   - Special characters in form fields
   - Network interruptions during API calls

2. **Performance Testing**
   - Multiple rapid OTP requests
   - Large form data submissions
   - Concurrent user registrations

3. **Mobile Testing**
   - Responsive design on mobile devices
   - Touch interactions with OTP inputs
   - Mobile email app integration

## 📞 Support

If you encounter any issues:

1. Check the browser console for JavaScript errors
2. Check the backend console for API errors
3. Verify all environment variables are set correctly
4. Review the detailed implementation documentation in `EMAIL_VERIFICATION_IMPLEMENTATION.md`

## 🎉 Success Indicators

You'll know everything is working correctly when:
- ✅ Email verification modal opens smoothly
- ✅ OTP emails are delivered promptly
- ✅ OTP input boxes animate and function properly
- ✅ Registration completes without errors
- ✅ Dashboard shows personalized welcome message
- ✅ Login/logout flow works seamlessly

Happy testing! 🚀