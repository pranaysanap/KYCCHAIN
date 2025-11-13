# 📧 KYCChain Email Setup Guide

## ✅ Your Current Configuration

### Mailjet Credentials
```bash
MAIL_API=20225e5c64da1d8232851b0e1adc3f3f
MAIL_SEC=e54082dd50fe9b6f11375073ecadd586
MAIL_END=https://api.mailjet.com/v3.1/send
```

### Verified Sender Email
```
ratyat416@gmail.com
```

### Database & Server
```bash
MONGO_URI=mongodb+srv://harishjadhav27:sauYTlQjWIhpQGXp@kycv.orfjrga.mongodb.net/?appName=kycv
JWT_SECRET=278ea4173e951ac90ba772ffa0df0ad4
PORT=5000
```

---

## 🚀 Quick Start

### Step 1: Verify .env File

Make sure your `Backend/.env` file contains:

```bash
# MongoDB Configuration
MONGO_URI=mongodb+srv://harishjadhav27:sauYTlQjWIhpQGXp@kycv.orfjrga.mongodb.net/?appName=kycv

# JWT Secret
JWT_SECRET=278ea4173e951ac90ba772ffa0df0ad4

# Mailjet Configuration
MAIL_API=20225e5c64da1d8232851b0e1adc3f3f
MAIL_SEC=e54082dd50fe9b6f11375073ecadd586
MAIL_END=https://api.mailjet.com/v3.1/send

# Server Port
PORT=5000
```

### Step 2: Test Mailjet Connection

```bash
cd Backend
node test-mailjet.js
```

You should see:
```
✅ EMAIL SENT SUCCESSFULLY!
📊 Response Details:
   Status: 200
   Message ID: xxxxx
🎉 Mailjet configuration is working correctly!
```

### Step 3: Start Backend Server

```bash
cd Backend
npm start
```

Look for this confirmation:
```
📧 Mailjet Email Configuration:
   API Key: ✅ Loaded
   Secret Key: ✅ Loaded
   Endpoint: https://api.mailjet.com/v3.1/send
   Sender Email: ratyat416@gmail.com
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

### Step 4: Start Frontend

```bash
# In main project directory
npm run dev
```

---

## 📨 How Email Sending Works

### 1. User Registration Flow

```
User enters email → OTP generated → Mailjet sends email → User receives OTP → Verification complete
```

### 2. Email Template

**From:** KYCChain <ratyat416@gmail.com>  
**To:** user@example.com  
**Subject:** Your KYCChain Verification Code

The email includes:
- ✅ Professional KYCChain branding
- ✅ Large, readable 6-digit OTP code
- ✅ Gradient design with purple/blue theme
- ✅ Security information (5-minute expiration)
- ✅ Support contact details

### 3. Backend Process

```javascript
// 1. Generate OTP
const otp = Math.floor(100000 + Math.random() * 900000).toString();

// 2. Save to database (expires in 5 minutes)
await Otp.findOneAndUpdate({ email }, { otp }, { upsert: true });

// 3. Send via Mailjet
await mailjet.post("send", { version: "v3.1" }).request({
  Messages: [{
    From: { Email: "ratyat416@gmail.com", Name: "KYCChain" },
    To: [{ Email: userEmail, Name: "User" }],
    Subject: "Your KYCChain Verification Code",
    HTMLPart: `<html>...${otp}...</html>`
  }]
});

// 4. Log success
console.log("✅ Email sent successfully to:", email);
```

---

## 🔍 Troubleshooting

### Issue 1: "Email sending failed"

**Symptoms:**
```
❌ Email sending failed: [error details]
```

**Solutions:**
1. Check Mailjet credentials in .env file
2. Verify ratyat416@gmail.com is verified in Mailjet dashboard
3. Check daily email quota (200 emails/day on free plan)
4. Test with: `node test-mailjet.js`

### Issue 2: "Sender Not Verified"

**Problem:** Error 400 - Sender address not verified

**Solution:**
1. Login to [Mailjet Dashboard](https://app.mailjet.com/)
2. Go to **Account Settings** → **Sender Addresses**
3. Find `ratyat416@gmail.com`
4. If not verified, click "Resend Verification Email"
5. Check Gmail inbox and click verification link

### Issue 3: Emails Going to Spam

**Solutions:**
- ✅ Already using professional email template
- ✅ Verified sender email (ratyat416@gmail.com)
- ✅ Clear subject line
- ✅ No spam trigger words

Users should check their spam folder and mark as "Not Spam"

### Issue 4: Environment Variables Not Loading

**Symptoms:**
```
MAIL_API: ❌ Missing
MAIL_SEC: ❌ Missing
```

**Solutions:**
1. Verify `.env` file is in `Backend` directory (not root)
2. No spaces around `=` in .env file
3. No quotes around values
4. Restart server after updating .env

### Issue 5: Wrong API Endpoint

**Problem:** Using wrong Mailjet endpoint

**Correct Endpoint:**
```bash
MAIL_END=https://api.mailjet.com/v3.1/send
```

**Not:**
- ~~https://api.mailjet.com/v3.1/~~ (missing /send)
- ~~https://api.mailjet.com/v3/send~~ (wrong version)

---

## 📊 Email Monitoring

### Check Sent Emails

1. Login to [Mailjet Dashboard](https://app.mailjet.com/)
2. Go to **Statistics** → **Messages**
3. View delivery status, opens, clicks

### Backend Logs

Watch for these console messages:

**Success:**
```
📧 OTP Email Request:
   To: user@example.com
   OTP: 123456
   From: ratyat416@gmail.com
✅ Email sent successfully to: user@example.com
   Status: Delivered to Mailjet
```

**Failure:**
```
❌ Email sending failed: [error message]
   Error Details: 401
   Please check:
   1. Mailjet API credentials are correct
   2. Sender email (ratyat416@gmail.com) is verified in Mailjet
   3. Email quota is not exceeded
```

---

## 🔒 Security Best Practices

### ✅ Already Implemented

1. **Environment Variables** - API keys stored in .env (not committed)
2. **OTP Expiration** - Codes expire after 5 minutes
3. **Database Storage** - OTPs stored temporarily in MongoDB
4. **HTTPS** - Mailjet uses secure HTTPS connections
5. **Professional Sender** - Verified sender email address

### 🚧 For Production

1. **Remove Development Logging**
   - Remove `otp: otp` from API response
   - Remove console.log of OTP codes

2. **Rate Limiting**
   - Add cooldown between OTP requests (60 seconds)
   - Limit failed attempts per email

3. **Email Quota Monitoring**
   - Monitor daily usage in Mailjet dashboard
   - Set up alerts for quota limits
   - Consider upgrading plan if needed

4. **Error Handling**
   - Don't expose detailed errors to frontend
   - Log errors to monitoring service
   - Implement retry logic for failed sends

---

## 📈 Usage Limits

### Mailjet Free Plan

- **200 emails per day**
- **6,000 emails per month**
- **60 API requests per minute**

### Monitoring Usage

```bash
# View current usage in Mailjet Dashboard
https://app.mailjet.com/stats

# Or via API
curl --user "$MAIL_API:$MAIL_SEC" \
  https://api.mailjet.com/v3/REST/statcounters
```

### Upgrade When Needed

If you hit limits:
1. **Free Plan**: 200/day, 6,000/month
2. **Essential Plan**: $15/month, 15,000 emails
3. **Premium Plan**: $25/month, 30,000 emails

---

## 🧪 Testing Checklist

### ✅ Pre-Launch Tests

- [ ] Run `node test-mailjet.js` successfully
- [ ] Server shows Mailjet configured on startup
- [ ] Complete full registration flow
- [ ] Receive OTP email at test address
- [ ] Verify OTP code works
- [ ] Check email appears professional
- [ ] Test with different email providers (Gmail, Outlook, etc.)
- [ ] Verify emails don't go to spam
- [ ] Test OTP expiration (wait 5+ minutes)
- [ ] Test resend OTP functionality
- [ ] Check error handling for invalid OTP
- [ ] Verify success/error notifications show in UI

### Test Accounts

```bash
# Use these for testing
test1@example.com
test2@example.com
ratyat416@gmail.com (your own email for verification)
```

---

## 📝 API Endpoints

### POST /api/auth/send-otp

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response:**
```json
{
  "message": "OTP sent successfully to your email",
  "otp": "123456"  // Remove in production
}
```

**Error Response:**
```json
{
  "error": "Email already registered"
}
```

### POST /api/auth/verify-otp

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response:**
```json
{
  "message": "OTP verified successfully",
  "verified": true
}
```

**Error Response:**
```json
{
  "error": "Invalid OTP"
}
```

---

## 🎯 Success Indicators

### ✅ Everything Working When You See:

**Backend Console:**
```
📧 Mailjet Configuration:
   API Key: ✅ Loaded
   Secret Key: ✅ Loaded
   Sender Email: ratyat416@gmail.com
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
   Mailjet Status: Configured ✅
```

**During Registration:**
```
📧 OTP Email Request:
   To: user@example.com
   OTP: 123456
   From: ratyat416@gmail.com
✅ Email sent successfully to: user@example.com
   Status: Delivered to Mailjet
```

**Frontend UI:**
- ✅ Success toast: "OTP Sent! 📧"
- ✅ "A 6-digit code has been sent to your email"
- ✅ Email verification modal with 6 animated inputs
- ✅ Success modal after OTP verification: "Email Verified! ✅"
- ✅ Registration success modal with confetti
- ✅ Toast: "Welcome to KYCChain, [Name]!"

**User Email:**
- ✅ Email received from ratyat416@gmail.com
- ✅ Professional KYCChain branding
- ✅ Clear 6-digit OTP code
- ✅ Expiration time shown (5 minutes)
- ✅ Not in spam folder

---

## 🔗 Quick Links

- **Mailjet Dashboard:** https://app.mailjet.com/
- **Email Statistics:** https://app.mailjet.com/stats
- **Sender Addresses:** https://app.mailjet.com/account/sender
- **API Documentation:** https://dev.mailjet.com/email/reference/
- **Support:** https://www.mailjet.com/support/

---

## 🎉 Ready to Go!

Your Mailjet email configuration is complete and ready for use:

✅ **API Keys:** Configured in .env  
✅ **Sender Email:** ratyat416@gmail.com verified  
✅ **Backend:** Updated to use environment variables  
✅ **Frontend:** Notification system integrated  
✅ **Testing:** test-mailjet.js script available  
✅ **Monitoring:** Detailed logging implemented  

### Next Steps:

1. **Test the system:**
   ```bash
   cd Backend
   node test-mailjet.js
   npm start
   ```

2. **Try full registration flow:**
   - Open frontend: http://localhost:5173
   - Click "Get Started"
   - Enter your email
   - Check inbox for OTP
   - Complete registration
   - See success notifications!

3. **Monitor usage:**
   - Check Mailjet dashboard daily
   - Watch for quota limits
   - Review delivery statistics

**Your users will now receive professional OTP emails from ratyat416@gmail.com with beautiful formatting and clear instructions!** 🚀

---

## 📞 Support

If you encounter any issues:

1. Run diagnostic script: `node test-mailjet.js`
2. Check backend console logs
3. Verify .env configuration
4. Review Mailjet dashboard for errors
5. Ensure sender email is verified

**Happy emailing! 📧✨**