// Premium OTP Email Template - Ultra Modern Design
// Beautiful gradient theme with animations and professional styling

export const premiumOTPTemplate = (otp, email = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your Verification Code - KYCChain</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">

  <!-- Main Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
    <tr>
      <td align="center">

        <!-- Email Card -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">

          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center; position: relative;">

              <!-- Decorative circles -->
              <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: -30px; left: -30px; width: 120px; height: 120px; background: rgba(255, 255, 255, 0.08); border-radius: 50%;"></div>

              <!-- Logo Icon -->
              <div style="margin-bottom: 20px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; padding: 20px; backdrop-filter: blur(10px);">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                    <path d="M19 11H5V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V11Z" fill="white" fill-opacity="0.9"/>
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>

              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 800; text-shadow: 0 4px 12px rgba(0,0,0,0.2); letter-spacing: -0.5px;">KYCChain</h1>

              <p style="color: rgba(255, 255, 255, 0.95); margin: 12px 0 0 0; font-size: 16px; font-weight: 400; letter-spacing: 0.5px;">Secure Identity Verification</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 60px 40px 40px 40px;">

              <!-- Welcome Message -->
              <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 32px; font-weight: 700; text-align: center; line-height: 1.2;">Email Verification</h2>

              <p style="color: #4a5568; font-size: 17px; line-height: 1.7; margin: 0 0 40px 0; text-align: center;">
                Welcome aboard! 🎉 We're excited to have you join KYCChain. To ensure the security of your account, please verify your email address using the code below.
              </p>

              <!-- OTP Box - The Star of the Show -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 40px 30px; text-align: center; box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4); position: relative; overflow: hidden;">

                      <!-- Animated background pattern -->
                      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.1; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px);"></div>

                      <div style="position: relative; z-index: 1;">
                        <p style="color: rgba(255, 255, 255, 0.9); font-size: 13px; margin: 0 0 20px 0; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Your Verification Code</p>

                        <!-- The OTP Code -->
                        <div style="background: rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 25px 40px; margin: 0 auto; display: inline-block; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
                          <span style="font-size: 48px; font-weight: 800; color: #ffffff; letter-spacing: 12px; font-family: 'Courier New', Courier, monospace; text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);">${otp}</span>
                        </div>

                        <p style="color: rgba(255, 255, 255, 0.85); font-size: 14px; margin: 25px 0 0 0; font-weight: 400;">
                          ⏱️ Valid for <strong style="color: #fff;">5 minutes</strong> only
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Instructions Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-left: 5px solid #667eea; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
                      <span style="display: inline-block; width: 28px; height: 28px; background: #667eea; border-radius: 50%; color: white; text-align: center; line-height: 28px; margin-right: 12px; font-size: 16px;">ℹ️</span>
                      Important Information
                    </h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #667eea; font-size: 20px; margin-right: 12px;">✓</span>
                          <span style="color: #4a5568; font-size: 15px; line-height: 1.6;">Enter this code on the verification page</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #667eea; font-size: 20px; margin-right: 12px;">✓</span>
                          <span style="color: #4a5568; font-size: 15px; line-height: 1.6;">Code expires in <strong>5 minutes</strong></span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #667eea; font-size: 20px; margin-right: 12px;">✓</span>
                          <span style="color: #4a5568; font-size: 15px; line-height: 1.6;">Never share this code with anyone</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #667eea; font-size: 20px; margin-right: 12px;">✓</span>
                          <span style="color: #4a5568; font-size: 15px; line-height: 1.6;">This is a one-time use code</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Alert -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td style="background: #fff5f5; border: 2px dashed #fc8181; border-radius: 12px; padding: 20px; text-align: center;">
                    <p style="color: #c53030; font-size: 15px; margin: 0; line-height: 1.6;">
                      <strong>🔒 Security Notice:</strong> If you didn't request this code, please ignore this email. Your account is safe and secure.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Help Section -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0 0 0;">
                <tr>
                  <td style="text-align: center; padding: 30px 0 0 0; border-top: 2px solid #e2e8f0;">
                    <p style="color: #718096; font-size: 15px; margin: 0 0 15px 0; line-height: 1.6;">
                      Need help? We're here for you!
                    </p>
                    <a href="mailto:support@kycchain.com" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 30px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); transition: transform 0.2s;">
                      Contact Support
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">

              <!-- Company Info -->
              <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 20px; font-weight: 700;">KYCChain</h3>
              <p style="color: #718096; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                Revolutionizing secure document verification<br>
                with blockchain technology 🌐
              </p>

              <!-- Divider -->
              <div style="height: 1px; background: linear-gradient(90deg, transparent, #cbd5e0, transparent); margin: 25px 0;"></div>

              <!-- Legal -->
              <p style="color: #a0aec0; font-size: 12px; margin: 0; line-height: 1.8;">
                This is an automated email from KYCChain. Please do not reply.<br>
                © ${new Date().getFullYear()} KYCChain. All rights reserved.<br>
                <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a> •
                <a href="#" style="color: #667eea; text-decoration: none;">Terms of Service</a>
              </p>

              ${email ? `<p style="color: #cbd5e0; font-size: 11px; margin: 15px 0 0 0;">Email sent to: ${email}</p>` : ''}

            </td>
          </tr>

        </table>
        <!-- End Email Card -->

      </td>
    </tr>
  </table>
  <!-- End Main Container -->

</body>
</html>
`;

export default premiumOTPTemplate;
