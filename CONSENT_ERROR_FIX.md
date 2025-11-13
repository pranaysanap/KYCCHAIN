# Consent JSON Error - Troubleshooting Guide

## Error Description
**Error:** "Unexpected token, type is not JSON"

This error occurs when the frontend tries to parse a response from the backend, but instead of JSON, it receives HTML or plain text.

## Root Causes

### 1. Backend Server Not Running
The most common cause is that the backend server is not running.

**Solution:**
```bash
cd Backend
node server.js
```

You should see:
```
✅ MongoDB Connected
✅ Cloudinary Connected
🚀 Server running on http://localhost:5000
```

### 2. Routes Not Properly Registered
The consent routes might not be loaded in the server.

**Check:** Open `Backend/server.js` and verify:
```javascript
import consentRoutes from "./routes/consent.js";
app.use("/api/consent", consentRoutes);
```

### 3. CORS Issues
Cross-Origin Resource Sharing might be blocking the requests.

**Check:** In `Backend/server.js`, verify CORS is enabled:
```javascript
import cors from "cors";
app.use(cors());
```

### 4. MongoDB Connection Failed
If MongoDB is not connected, routes might fail silently.

**Check:** Look for this in backend console:
```
✅ MongoDB Connected
```

If you see an error, check:
- Internet connection
- MongoDB Atlas whitelist (allow 0.0.0.0/0 for testing)
- `.env` file has correct MONGO_URI

### 5. Authentication Token Issues
The JWT token might be invalid or missing.

**Check:** Open browser DevTools → Console, look for:
```
🌐 API Request: http://localhost:5000/api/consent/consents
📡 Response Status: 401 Unauthorized
```

**Solution:** Log out and log in again to get a fresh token.

## Step-by-Step Diagnosis

### Step 1: Check Backend Server
```bash
cd Backend
node server.js
```

Expected output:
```
✅ MongoDB Connected
✅ Backend is ready!
   API Endpoint: http://localhost:5000/api
```

### Step 2: Test Server Health
Open browser and go to: `http://localhost:5000/`

You should see: `Backend working 🚀`

If you see "Cannot GET /", the server is not running correctly.

### Step 3: Check Browser Console
1. Open the application in browser
2. Press F12 to open DevTools
3. Go to Console tab
4. Try to grant consent
5. Look for error messages

Expected logs:
```
🌐 API Request: http://localhost:5000/api/consent/consents
📡 Response Status: 200 OK
✅ API Response: [...]
```

Error logs will show:
```
❌ JSON Parse Error
📄 Response Text: <!DOCTYPE html>...
```

This means the server returned HTML instead of JSON.

### Step 4: Run Diagnostic Test
```bash
cd Backend
node test-consent-api.js
```

Update the TEST_USER credentials in the file first:
```javascript
const TEST_USER = {
  email: "your-email@example.com",
  password: "your-password",
};
```

This will test:
- Server health
- Login functionality
- Get consents endpoint
- Grant consent endpoint

### Step 5: Check MongoDB Atlas
1. Go to MongoDB Atlas dashboard
2. Click "Network Access"
3. Make sure your IP is whitelisted or add `0.0.0.0/0` for testing
4. Check "Database Access" - user has read/write permissions

## Common Solutions

### Solution 1: Restart Backend Server
```bash
# Kill any running node processes
# Windows:
taskkill /F /IM node.exe

# Linux/Mac:
killall node

# Then restart:
cd Backend
node server.js
```

### Solution 2: Clear Browser Cache and Tokens
```javascript
// Open browser console and run:
localStorage.clear();
// Then refresh the page and login again
```

### Solution 3: Verify Environment Variables
Check `Backend/.env` file has:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kycchain?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
PORT=5000
```

### Solution 4: Check Package Dependencies
```bash
cd Backend
npm install
```

Make sure these packages are installed:
- express
- mongoose
- cors
- jsonwebtoken
- bcryptjs

### Solution 5: Test API Manually with Postman/curl

**1. Login to get token:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'
```

**2. Get consents:**
```bash
curl -X GET http://localhost:5000/api/consent/consents \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**3. Grant consent:**
```bash
curl -X POST http://localhost:5000/api/consent/consents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"institutionName":"State Bank of India"}'
```

## Quick Fix Checklist

- [ ] Backend server is running (`node server.js`)
- [ ] MongoDB is connected (check backend console)
- [ ] Can access `http://localhost:5000/` in browser
- [ ] Browser console shows API requests
- [ ] No CORS errors in browser console
- [ ] Valid authentication token exists
- [ ] `.env` file is configured correctly
- [ ] All npm packages are installed

## Still Not Working?

### Check Backend Console Logs
When you try to grant consent, you should see:
```
📝 Grant Consent Request:
   Institution Name: State Bank of India
   User ID: 507f1f77bcf86cd799439011
✅ User found: user@example.com John Doe
✅ Consent created successfully for: State Bank of India
```

If you don't see these logs, the request is not reaching the backend.

### Check Network Tab
1. Open DevTools → Network tab
2. Try to grant consent
3. Look for the request to `/api/consent/consents`
4. Click on it and check:
   - Request URL
   - Request Headers (Authorization header present?)
   - Response (what did server return?)

### Enable Detailed Logging
The code now has detailed logging. Check:
- Browser Console (frontend logs)
- Backend Terminal (server logs)

Both will show exactly what's happening at each step.

## Prevention

To avoid this error in the future:

1. **Always check backend is running** before testing
2. **Monitor backend console** for errors
3. **Keep browser console open** during testing
4. **Test with Postman** before integrating with frontend
5. **Use the diagnostic script** after making backend changes

## Contact Support

If none of these solutions work, provide:
1. Backend console logs
2. Browser console logs
3. Network tab screenshot
4. Output of `node test-consent-api.js`
5. Your `.env` configuration (hide sensitive data)

---

**Last Updated:** 2024
**Version:** 1.0