# Mailjet Email Configuration Guide

## 📧 Overview

This guide explains how to properly configure Mailjet email service for KYCChain's OTP verification and notification system.

## ✅ Current Configuration

### Verified Sender Email
```
Email: ratyat416@gmail.com
Service: Mailjet Email API
Status: ✅ Verified and Active
```

### API Credentials
```bash
MAIL_API=20225e5c64da1d8232851b0e1adc3f3f
MAIL_SEC=e54082dd50fe9b6f11375073ecadd586
MAIL_END=https://api.mailjet.com/v3.1/
```

## 🔧 Backend Configuration

### Environment Variables (.env)

Create or update your `Backend/.env` file with the following configuration:

```bash
# MongoDB Configuration
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/kycchain

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Mailjet Email Configuration
MAIL_API=20225e5c64da1d8232851b0e1adc3f3f
MAIL_SEC=e54082dd50fe9b6f11375073ecadd586
MAIL_END=https://api.mailjet.com/v3.1/

# Server Configuration
PORT=5000
NODE_ENV=development

# Cloudinary (for document uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenAI (for fraud detection)
OPENAI_API_KEY=your_openai_api_key
```

### Backend Code Configuration

The `Backend/routes/auth.js` file now properly uses environment variables:

```javascript
// Initialize Mailjet with environment variables
const mailjet = Mailjet.apiConnect(
  process.env.MAIL_API,
  process.env.MAIL_SEC
);

// Email sending configuration
From: {
  Email: "ratyat416@gmail.com",  // Your verified sender
  Name: "KYCChain",
}
```

## 📨 Email Features

### OTP Email Template

The system sends professionally formatted HTML emails with:

- **Subject**: "Your KYCChain Verification Code"
- **From**: ratyat416@gmail.com (KYCChain)
- **Content**: 
  - Branded header with KYCChain logo
  - Large, readable 6-digit OTP code
  - Professional styling with gradients
  - Important information box
  - Footer with support contact

### Email Content Example

```
From: KYCChain <ratyat416@gmail.com>
To: user@example.com
Subject: Your KYCChain Verification Code

╔══════════════════════════════════╗
║         KYCChain                 ║
║  Secure Document Verification    ║
╚══════════════════════════════════╝

Verify Your Email Address

Welcome to KYCChain! To complete your 
registration and secure your account, 
please use the verification code below:

    ┌─────────────────┐
    │   123456        │
    └─────────────────┘

Important Information:
• This code will expire in 5 minutes
• Do not share this code with anyone
• Enter this code in the verification field

If you didn't request this code, please 
ignore this email.

═══════════════════════════════════════
KYCChain
Empowering secure document verification
```

## 🚀 Setup Instructions

### Step 1: Verify Mailjet Account

1. Login to [Mailjet Dashboard](https://app.mailjet.com/)
2. Go to **Account Settings** → **Sender Addresses**
3. Verify that `ratyat416@gmail.com` is listed and verified
4. If not verified, click "Add Sender Address" and verify

### Step 2: Configure Environment Variables

1. Navigate to `Backend` directory
2. Create or update `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Add Mailjet credentials:
   ```bash
   MAIL_API=20225e5c64da1d8232851b0e1adc3f3f
   MAIL_SEC=e54082dd50fe9b6f11375073ecadd586
   MAIL_END=https://api.mailjet.com/v3.1/
   ```

### Step 3: Verify Configuration

Test the email sending:

```bash
cd Backend
node -e "
const Mailjet = require('node-mailjet');
require('dotenv').config();

const mailjet = Mailjet.apiConnect(
  process.env.MAIL_API,
  process.env.MAIL_SEC
);

mailjet
  .post('send', { version: 'v3.1' })
  .request({
    Messages: [{
      From: {
        Email: 'ratyat416@gmail.com',
        Name: 'KYCChain Test'
      },
      To: [{
        Email: 'your-email@example.com',
        Name: 'Test User'
      }],
      Subject: 'KYCChain Email Test',
      TextPart: 'This is a test email from KYCChain.',
      HTMLPart: '<h1>Test Email</h1><p>If you receive this, Mailjet is configured correctly!</p>'
    }]
  })
  .then(result => {
    console.log('✅ Email sent successfully!');
    console.log(result.body);
  })
  .catch(err => {
    console.error('❌ Email failed:', err.statusCode, err.message);
  });
"
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Email Not Sending

**Problem**: OTP emails are not being sent

**Solutions**:
- ✅ Verify environment variables are loaded: `console.log(process.env.MAIL_API)`
- ✅ Check Mailjet API keys are correct
- ✅ Verify sender email (ratyat416@gmail.com) is verified in Mailjet
- ✅ Check Mailjet dashboard for error logs
- ✅ Ensure `.env` file is in `Backend` directory

#### 2. "Sender Not Verified" Error

**Problem**: Error message about unverified sender

**Solutions**:
- ✅ Go to Mailjet dashboard
- ✅ Navigate to Account Settings → Sender Addresses
- ✅ Click on ratyat416@gmail.com
- ✅ Follow verification steps if needed
- ✅ Check Gmail inbox for verification email

#### 3. API Authentication Failed

**Problem**: 401 or 403 error when sending emails

**Solutions**:
- ✅ Verify MAIL_API and MAIL_SEC are correct
- ✅ Check for extra spaces in .env file
- ✅ Regenerate API keys in Mailjet if needed
- ✅ Ensure no quotes around values in .env

#### 4. Emails Going to Spam

**Problem**: OTP emails land in spam folder

**Solutions**:
- ✅ Add SPF record for Mailjet in domain settings
- ✅ Use professional email content (already implemented)
- ✅ Avoid spam trigger words
- ✅ Verify sender reputation in Mailjet

## 📊 Monitoring

### Check Email Sending Status

1. **Mailjet Dashboard**: https://app.mailjet.com/stats
2. **Backend Logs**: Check console for email sending confirmations
3. **Database**: Check OTP table for generated codes

### Success Indicators

```bash
# Backend Console Output
✅ OTP for user@example.com: 123456
✅ Email sent successfully
✅ OTP sent successfully to your email
```

### Error Indicators

```bash
# Backend Console Output
❌ Email sending failed: [error details]
❌ Mailjet API Error: 401 Unauthorized
❌ Failed to send OTP. Please try again.
```

## 🔒 Security Best Practices

### Environment Variables

- ✅ **Never commit** `.env` file to Git
- ✅ Add `.env` to `.gitignore`
- ✅ Use different API keys for development/production
- ✅ Rotate API keys periodically

### API Key Protection

```bash
# .gitignore (already configured)
.env
.env.local
.env.development
.env.production
*.env
```

### Production Configuration

For production deployment:

1. Use environment variables from hosting platform
2. Set `NODE_ENV=production`
3. Remove development OTP logging
4. Enable rate limiting for email sending
5. Monitor Mailjet usage and quota

## 📈 Usage Limits

### Mailjet Free Tier

- **Daily Limit**: 200 emails/day
- **Monthly Limit**: 6,000 emails/month
- **API Rate Limit**: 60 requests/minute

### Recommendations

- Implement request caching for OTP
- Add cooldown period between OTP requests
- Monitor daily usage in Mailjet dashboard
- Upgrade plan if approaching limits

## 🧪 Testing

### Test Email Sending

```javascript
// Test script: Backend/test-email.js
import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';

dotenv.config();

const mailjet = Mailjet.apiConnect(
  process.env.MAIL_API,
  process.env.MAIL_SEC
);

async function testEmail() {
  try {
    const result = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [{
          From: {
            Email: 'ratyat416@gmail.com',
            Name: 'KYCChain'
          },
          To: [{
            Email: 'test@example.com',
            Name: 'Test User'
          }],
          Subject: 'KYCChain Test Email',
          TextPart: 'Test email from KYCChain',
          HTMLPart: '<h1>Test Successful!</h1>'
        }]
      });
    
    console.log('✅ Email sent successfully!');
    console.log('Response:', result.body);
  } catch (error) {
    console.error('❌ Error:', error.statusCode, error.message);
  }
}

testEmail();
```

Run test:
```bash
cd Backend
node test-email.js
```

## 📝 Code Examples

### Send OTP Email

```javascript
// In auth.js
const otp = Math.floor(100000 + Math.random() * 900000).toString();

const request = mailjet
  .post('send', { version: 'v3.1' })
  .request({
    Messages: [{
      From: {
        Email: 'ratyat416@gmail.com',
        Name: 'KYCChain'
      },
      To: [{
        Email: userEmail,
        Name: 'User'
      }],
      Subject: 'Your KYCChain Verification Code',
      HTMLPart: `Your OTP code is: ${otp}`
    }]
  });

await request;
console.log('OTP email sent successfully');
```

### Error Handling

```javascript
try {
  await mailjet.post('send', { version: 'v3.1' }).request({...});
  console.log('✅ Email sent successfully');
} catch (emailError) {
  console.error('❌ Email sending failed:', emailError.message);
  // Continue registration even if email fails (optional)
  // Or throw error to stop registration
}
```

## 🎯 Best Practices

### Email Content

- ✅ Use clear, professional language
- ✅ Include branding (KYCChain name and logo)
- ✅ Make OTP code easily readable
- ✅ Add expiration time (5 minutes)
- ✅ Include security warnings
- ✅ Add support contact information

### Technical Implementation

- ✅ Use environment variables for credentials
- ✅ Implement proper error handling
- ✅ Log email sending status
- ✅ Add retry logic for failed sends
- ✅ Implement rate limiting
- ✅ Validate email format before sending

### User Experience

- ✅ Send email immediately after request
- ✅ Show clear feedback to users
- ✅ Allow OTP resend with cooldown
- ✅ Provide alternative verification methods
- ✅ Handle email delivery failures gracefully

## 📞 Support

### Mailjet Support

- **Documentation**: https://dev.mailjet.com/
- **API Reference**: https://dev.mailjet.com/email/reference/
- **Support**: https://www.mailjet.com/support/

### KYCChain Configuration Help

If you encounter issues:

1. Check backend console logs
2. Verify .env file configuration
3. Test with Mailjet API directly
4. Review error messages in Mailjet dashboard
5. Check email is verified in Mailjet account

## ✅ Configuration Checklist

Before going live:

- [ ] Mailjet account created and verified
- [ ] ratyat416@gmail.com verified as sender
- [ ] API keys added to .env file
- [ ] Environment variables loading correctly
- [ ] Test email sending works
- [ ] OTP emails deliver successfully
- [ ] Email content looks professional
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Monitoring set up
- [ ] Production keys secured
- [ ] Backup email method available

## 🎉 Success!

Once configured correctly, users will receive:

1. **Professional OTP emails** from ratyat416@gmail.com
2. **Clear verification codes** in beautifully formatted emails
3. **Timely delivery** within seconds
4. **Success notifications** in the UI confirming email sent
5. **Error feedback** if email fails to send

Your Mailjet configuration is now complete and ready for production use! 🚀