# 🎨 Beautiful OTP Email Templates

Professional, responsive, and stunning email templates for OTP verification codes in your KYCChain application.

## 📦 Available Templates

### 1. **Premium Gradient** (Default)
- **File:** `otp-premium.js`
- **Style:** Ultra modern design with beautiful purple-blue gradient theme
- **Features:**
  - Animated background patterns
  - Large, bold OTP display with 48px font
  - Security tips card
  - Decorative circles and glassmorphism effects
  - Professional footer with support button

### 2. **Elegant Minimalist**
- **File:** `otp-elegant.js`
- **Style:** Clean, professional design with subtle animations
- **Features:**
  - Light background with clean card design
  - Step-by-step instructions
  - Numbered guide for user clarity
  - Minimalist aesthetic
  - Perfect for corporate/professional use

### 3. **Dark Theme**
- **File:** `otp-dark.js`
- **Style:** Sleek, modern dark design with neon accents
- **Features:**
  - Dark background (#0f0f23)
  - Neon cyan (#64ffda) accents
  - Glowing effects and grid patterns
  - Futuristic, tech-forward design
  - Perfect for tech-savvy audiences

## 🚀 Usage

### Basic Usage (Using Default Template)

```javascript
import premiumOTPTemplate from '../email-templates/otp-premium.js';

// Generate HTML for email
const htmlContent = premiumOTPTemplate(otp, userEmail);

// Use in Mailjet or any email service
const request = mailjet.post("send", { version: "v3.1" }).request({
  Messages: [{
    From: {
      Email: "your-email@example.com",
      Name: "KYCChain",
    },
    To: [{
      Email: userEmail,
      Name: "User",
    }],
    Subject: "Your KYCChain Verification Code",
    HTMLPart: htmlContent,
  }],
});
```

### Using Different Templates

```javascript
// Import specific template
import elegantOTPTemplate from '../email-templates/otp-elegant.js';
import darkOTPTemplate from '../email-templates/otp-dark.js';

// Use elegant template
const htmlContent = elegantOTPTemplate(otp, userEmail);

// Or use dark template
const htmlContent = darkOTPTemplate(otp, userEmail);
```

### Using Template Helper

```javascript
import { getTemplate } from '../email-templates/index.js';

// Get template by name
const template = getTemplate('dark'); // Options: 'premium', 'elegant', 'dark'
const htmlContent = template(otp, userEmail);
```

## 📝 Template Function Signature

All templates follow the same function signature:

```javascript
templateFunction(otp, email)
```

**Parameters:**
- `otp` (string, required): The 6-digit OTP code to display
- `email` (string, optional): User's email address (shown in footer)

**Returns:** HTML string ready to be sent via email

## 🎨 Customization

### Change Colors

Edit the gradient colors in any template file:

```javascript
// Find these gradient definitions in the template
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

// Replace with your brand colors
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%)
```

### Change OTP Display Size

```javascript
// Find the OTP span element
font-size: 48px; // Change this value

// Example: Make it larger
font-size: 56px;
```

### Add Your Logo

Replace the SVG icon section with your logo image:

```html
<img src="https://your-domain.com/logo.png" alt="Logo" style="width: 80px; height: 80px;" />
```

### Update Company Information

Search for "KYCChain" in the template and replace with your company name.

## 🔧 Integration with Auth Routes

The templates are already integrated in `routes/auth.js`:

```javascript
import premiumOTPTemplate from "../email-templates/otp-premium.js";

// In your send-otp route
HTMLPart: premiumOTPTemplate(otp, email),
```

To switch templates, just change the import:

```javascript
// Use elegant template instead
import elegantOTPTemplate from "../email-templates/otp-elegant.js";
HTMLPart: elegantOTPTemplate(otp, email),
```

## ✨ Features Common to All Templates

- ✅ **Fully Responsive:** Works perfectly on all devices and email clients
- ✅ **Email Client Compatible:** Tested with Gmail, Outlook, Apple Mail, etc.
- ✅ **Professional Design:** Modern, eye-catching layouts
- ✅ **Security Focused:** Includes security warnings and best practices
- ✅ **5-Minute Expiry Notice:** Clear indication of code validity
- ✅ **Support Contact:** Easy access to help
- ✅ **Legal Footer:** Copyright and policy links
- ✅ **Accessible:** Good contrast ratios and readable fonts

## 📱 Email Client Support

All templates have been optimized for:
- ✅ Gmail (Web, iOS, Android)
- ✅ Outlook (Web, Desktop, Mobile)
- ✅ Apple Mail (macOS, iOS)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Thunderbird
- ✅ Samsung Mail

## 🎯 Best Practices Implemented

1. **Inline CSS:** All styles are inline for maximum compatibility
2. **Table-Based Layout:** Uses tables for consistent rendering across email clients
3. **Web-Safe Fonts:** Uses system fonts with fallbacks
4. **Alt Text:** Images have descriptive alt text
5. **Clear Call-to-Action:** OTP code is prominently displayed
6. **Security Warnings:** Reminds users never to share codes
7. **Expiry Notice:** Clear 5-minute expiration message

## 🛠️ Testing Your Templates

### Test in Development

```javascript
// Create a test route to preview emails
router.get("/test-email", (req, res) => {
  const testOTP = "123456";
  const testEmail = "test@example.com";
  const html = premiumOTPTemplate(testOTP, testEmail);
  res.send(html);
});
```

Visit `http://localhost:5000/api/auth/test-email` to preview the email in your browser.

### Test with Real Email

```javascript
// Send test email to yourself
const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
const htmlContent = premiumOTPTemplate(testOTP, "your-email@example.com");
// Send via your email service
```

## 🌟 Screenshots Preview

### Premium Gradient Template
- Beautiful purple-blue gradient header
- Large OTP code with glassmorphism effect
- Information cards with icons
- Professional footer

### Elegant Minimalist Template
- Clean white card design
- Step-by-step numbered instructions
- Subtle gradient accents
- Corporate-friendly style

### Dark Theme Template
- Dark background with neon accents
- Futuristic grid pattern
- Glowing OTP display
- Tech-forward design

## 📄 License

These templates are part of the KYCChain project and are free to use and modify for your application.

## 🤝 Contributing

Feel free to create new templates following the same structure:
1. Create a new file: `otp-[name].js`
2. Export a function that takes `(otp, email)` parameters
3. Return a complete HTML email string
4. Add it to `index.js` exports

## 💡 Tips

- **Test Thoroughly:** Always test emails in multiple clients before going to production
- **Keep It Simple:** Don't over-complicate the design
- **Mobile First:** Most users will view on mobile devices
- **Clear CTA:** Make the OTP code easy to find and copy
- **Security:** Always include security warnings about not sharing codes

## 🆘 Troubleshooting

**Email looks broken in Outlook:**
- Make sure all CSS is inline
- Use table-based layouts
- Avoid CSS features like flexbox or grid

**OTP code not displaying correctly:**
- Use monospace fonts for OTP codes
- Ensure sufficient letter-spacing
- Test with different OTP lengths

**Images not showing:**
- Use absolute URLs for images
- Provide alt text
- Consider using inline SVGs for icons

## 📞 Support

For questions or issues:
- Email: support@kycchain.com
- Check the main project README
- Review the code comments in template files

---

**Created with ❤️ for KYCChain**

*Last Updated: 2024*