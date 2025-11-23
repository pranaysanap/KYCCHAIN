# 📧 Email Delivery Troubleshooting Guide

## 🚨 Problem: OTP Email Not Being Received

If users are not receiving OTP emails, follow this step-by-step guide to diagnose and fix the issue.

---

## 🔍 Quick Diagnosis

Run the diagnostic tool first:

```bash
cd Backend
node diagnose-email.js your-email@example.com
```

This will check:
- ✅ Environment variables
- ✅ Mailjet connection
- ✅ Sender verification
- ✅ Send a test email

---

## 📋 Common Issues & Solutions

### Issue 1: Sender Email Not Verified ⚠️

**Problem:** Mailjet requires sender email verification before sending emails.

**Symptoms:**
- Email "sent successfully" but not received
- Error: "Sender email not authorized"
- Status 401 or 403 errors

**Solution:**

1. **Login to Mailjet:**
   - Go to: https://app.mailjet.com/account/sender

2. **Add Your Sender Email:**
   - Click "Add a sender address"
   - Enter: `ratyat416@gmail.com` (or your sender email)
   - Click "Save"

3. **Verify Email:**
   - Check inbox for verification email from Mailjet
   - Click the verification link
   - Wait 5-10 minutes for activation

4. **Update .env if needed:**
   ```env
   SENDER_EMAIL=ratyat416@gmail.com
   ```

5. **Test Again:**
   ```bash
   node diagnose-email.js your-email@example.com
   ```

**How to Check:**
```bash
# Check if sender is verified
curl -X GET \
  --user "your-api-key:your-secret-key" \
  https://api.mailjet.com/v3/REST/sender
```

---

### Issue 2: Invalid Mailjet Credentials 🔑

**Problem:** API Key or Secret Key is incorrect or missing.

**Symptoms:**
- Error: "Mailjet not initialized"
- Error: "Authentication failed" (401)
- Console shows: "❌ MAIL_API: MISSING"

**Solution:**

1. **Get Your Credentials:**
   - Login to: https://app.mailjet.com/account/apikeys
   - Copy your API Key and Secret Key

2. **Update .env File:**
   ```env
   MAIL_API=your_actual_api_key_here
   MAIL_SEC=your_actual_secret_key_here
   SENDER_EMAIL=ratyat416@gmail.com
   ```

3. **Verify .env is Loaded:**
   - Make sure `.env` file is in `Backend/` directory
   - Check file is not named `.env.txt` or `.env.example`

4. **Restart Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm start
   ```

5. **Check Console Output:**
   ```
   📧 Mailjet Configuration:
      API Key: ✅ Loaded
      Secret Key: ✅ Loaded
      Sender: ratyat416@gmail.com
   ```

---

### Issue 3: Emails Going to Spam 📬

**Problem:** Emails are sent but land in spam/junk folder.

**Symptoms:**
- Backend shows "Email sent successfully"
- User doesn't see email in inbox
- Email found in spam after checking

**Solution:**

**Immediate Fix:**
1. Check spam/junk folder
2. Mark email as "Not Spam"
3. Add sender to contacts

**Long-term Fix:**

1. **Setup SPF Record:**
   - Add to your domain DNS:
   ```
   v=spf1 include:spf.mailjet.com ~all
   ```

2. **Setup DKIM:**
   - Go to: https://app.mailjet.com/account/sender
   - Follow DKIM setup instructions
   - Add DKIM records to DNS

3. **Use Verified Domain:**
   - Instead of `ratyat416@gmail.com`
   - Use: `noreply@yourdomain.com`
   - Verify domain in Mailjet

4. **Improve Email Content:**
   - Already done! ✅ (You have beautiful templates)
   - Avoid spam trigger words
   - Include unsubscribe link

---

### Issue 4: Mailjet Account Limits 📊

**Problem:** Free tier daily sending limit exceeded.

**Symptoms:**
- Error: "Quota exceeded"
- Error: "Daily limit reached"
- First few emails work, then stop

**Solution:**

1. **Check Current Limits:**
   - Login to: https://app.mailjet.com/stats
   - View daily/monthly usage

2. **Free Tier Limits:**
   - 200 emails per day
   - 6,000 emails per month

3. **Upgrade Plan (if needed):**
   - Go to: https://app.mailjet.com/pricing
   - Choose appropriate plan

4. **Optimize Sending:**
   - Implement rate limiting
   - Cache OTP for retry attempts
   - Use SMS as backup

---

### Issue 5: Network/Firewall Issues 🔥

**Problem:** Server cannot reach Mailjet API.

**Symptoms:**
- Error: "ETIMEDOUT" or "ECONNREFUSED"
- Error: "Network error"
- Long delays before error

**Solution:**

1. **Check Internet Connection:**
   ```bash
   ping api.mailjet.com
   ```

2. **Test Mailjet API:**
   ```bash
   curl -I https://api.mailjet.com/v3/REST/sender \
     --user "api-key:secret-key"
   ```

3. **Check Firewall:**
   - Allow outbound HTTPS (port 443)
   - Whitelist: `api.mailjet.com`

4. **Check Proxy Settings:**
   - If behind corporate proxy, configure:
   ```javascript
   const mailjet = Mailjet.apiConnect(API, SECRET, {
     proxyUrl: 'http://proxy.example.com:8080'
   });
   ```

---

### Issue 6: Email Address Invalid ❌

**Problem:** Recipient email address is malformed.

**Symptoms:**
- Error: "Invalid email address"
- Error: "Recipient address rejected"

**Solution:**

1. **Validate Email Format:**
   ```javascript
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
     return res.status(400).json({ error: "Invalid email format" });
   }
   ```

2. **Check for Common Issues:**
   - Extra spaces: `" user@example.com "`
   - Missing domain: `user@`
   - Invalid characters: `user<>@example.com`

3. **Test with Known Good Email:**
   ```bash
   node diagnose-email.js gmail-address@gmail.com
   ```

---

## 🛠️ Step-by-Step Troubleshooting Process

### Step 1: Run Diagnostic Script

```bash
cd Backend
node diagnose-email.js your-email@example.com
```

**Expected Output:**
```
✓ MAIL_API: Loaded
✓ MAIL_SEC: Loaded
✓ Connection successful!
✓ Sender email is verified and active!
✅ Email sent successfully!
```

### Step 2: Check Server Logs

Start your server and watch console:

```bash
npm start
```

Look for:
```
📧 Mailjet initialized successfully
📧 Mailjet Configuration:
   API Key: ✅ Loaded
   Secret Key: ✅ Loaded
   Sender: ratyat416@gmail.com
```

### Step 3: Send Test OTP

Use your API endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

**Check Console for:**
```
📧 OTP Email Request:
   To: your-email@example.com
   OTP: 123456
   From: ratyat416@gmail.com
✅ Email sent successfully!
   Status: 200 OK
   Message ID: xxxx-xxxx-xxxx
```

### Step 4: Check Mailjet Dashboard

1. Go to: https://app.mailjet.com/stats
2. Check "Recent Activity"
3. Look for your email
4. Check status: Sent, Delivered, Opened, Bounced

### Step 5: Check Email Inbox

**Important Places to Check:**
1. ✉️ **Inbox** - Main folder
2. 🗑️ **Spam/Junk** - Check here first!
3. 📁 **Promotions** - Gmail tab
4. 📁 **Updates** - Gmail tab
5. 🔍 **Search** - Search for "KYCChain"

**Wait Time:** Can take 1-5 minutes

---

## 🔧 Manual Email Test

If diagnostic fails, test manually:

### Using cURL:

```bash
curl -X POST \
  https://api.mailjet.com/v3.1/send \
  -H 'Content-Type: application/json' \
  -u 'YOUR_API_KEY:YOUR_SECRET_KEY' \
  -d '{
    "Messages": [{
      "From": {
        "Email": "ratyat416@gmail.com",
        "Name": "KYCChain"
      },
      "To": [{
        "Email": "your-email@example.com",
        "Name": "Test"
      }],
      "Subject": "Test Email",
      "TextPart": "This is a test email",
      "HTMLPart": "<h1>Test Email</h1><p>This is a test.</p>"
    }]
  }'
```

**Expected Response:**
```json
{
  "Messages": [{
    "Status": "success",
    "To": [{
      "Email": "your-email@example.com",
      "MessageID": 123456789
    }]
  }]
}
```

---

## 📊 Verification Checklist

Use this checklist to verify everything:

- [ ] `.env` file exists in `Backend/` directory
- [ ] `MAIL_API` is set and correct
- [ ] `MAIL_SEC` is set and correct
- [ ] `SENDER_EMAIL` is set
- [ ] Sender email is verified in Mailjet dashboard
- [ ] Mailjet account is active (not suspended)
- [ ] Server starts without Mailjet errors
- [ ] Diagnostic script passes all tests
- [ ] Test email is received (check spam too)
- [ ] OTP email template displays correctly
- [ ] Email shows OTP code clearly

---

## 🆘 Still Not Working?

### Check Mailjet Status:
- Visit: https://status.mailjet.com/
- Check for service outages

### Contact Mailjet Support:
- Email: support@mailjet.com
- Live Chat: https://app.mailjet.com/support
- Phone: Available on website

### Alternative Solutions:

1. **Use Different Email Service:**
   - SendGrid
   - AWS SES
   - Postmark
   - Resend

2. **Use SMS OTP Instead:**
   - Twilio SMS
   - AWS SNS
   - MessageBird

3. **Temporary Workaround:**
   - Log OTP to console (development only)
   - Display OTP in response (remove in production)

---

## 📱 Test Commands Quick Reference

```bash
# 1. Run full diagnostic
node diagnose-email.js your-email@example.com

# 2. Check environment variables
node -e "require('dotenv').config(); console.log(process.env.MAIL_API ? '✅' : '❌')"

# 3. Test Mailjet connection
curl -I https://api.mailjet.com/v3/REST/sender \
  --user "api-key:secret-key"

# 4. Send test OTP via API
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 5. Check server logs
npm start | grep -i "mail"
```

---

## 💡 Pro Tips

1. **Always Check Spam First** - 90% of "not received" emails are in spam
2. **Verify Sender Email** - Most common issue
3. **Check Mailjet Dashboard** - Shows exact delivery status
4. **Wait 2-5 Minutes** - Email delivery isn't instant
5. **Use Gmail for Testing** - Most reliable for testing
6. **Check Mobile App Too** - Sometimes mobile shows emails faster

---

## 🎯 Success Indicators

You'll know everything is working when:

✅ Server starts with: `📧 Mailjet initialized successfully`
✅ Console shows: `✅ Email sent successfully!`
✅ Mailjet dashboard shows: "Delivered"
✅ User receives email within 2 minutes
✅ Email looks beautiful (not broken HTML)
✅ OTP code is clearly visible
✅ Email not in spam folder

---

## 📚 Additional Resources

- **Mailjet Documentation:** https://dev.mailjet.com/
- **Mailjet Dashboard:** https://app.mailjet.com/
- **Email Testing Tool:** https://www.mail-tester.com/
- **SPF/DKIM Checker:** https://mxtoolbox.com/

---

## 🔄 Next Steps After Fixing

1. **Test thoroughly** with multiple email providers
2. **Monitor Mailjet dashboard** for delivery rates
3. **Set up email alerts** for failures
4. **Implement retry logic** for failed sends
5. **Add email delivery tracking** to your logs
6. **Consider backup email service** for redundancy

---

**Created for KYCChain Email System**
**Last Updated:** 2024

✉️ Happy Emailing!