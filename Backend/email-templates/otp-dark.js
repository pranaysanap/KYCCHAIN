// Dark Theme OTP Email Template
// Sleek, modern dark design with neon accents

export const darkOTPTemplate = (otp, email = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify Your Email - KYCChain</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f0f23;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0f0f23; padding: 50px 20px;">
    <tr>
      <td align="center">

        <!-- Main Email Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); overflow: hidden; border: 1px solid rgba(102, 126, 234, 0.2);">

          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px 35px 40px; text-align: center; position: relative; background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);">

              <!-- Glowing circles -->
              <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: -40px; left: -40px; width: 150px; height: 150px; background: radial-gradient(circle, rgba(118, 75, 162, 0.25) 0%, transparent 70%); border-radius: 50%;"></div>

              <!-- Logo -->
              <div style="width: 90px; height: 90px; margin: 0 auto 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4), 0 0 40px rgba(102, 126, 234, 0.2); position: relative;">
                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>

              <h1 style="margin: 0; font-size: 38px; font-weight: 800; color: #ffffff; letter-spacing: -1px; text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);">KYCChain</h1>
              <p style="margin: 10px 0 0 0; font-size: 15px; color: #a8b2d1; font-weight: 400; letter-spacing: 1px;">SECURE IDENTITY VERIFICATION</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">

              <h2 style="margin: 0 0 20px 0; font-size: 30px; font-weight: 700; color: #e6f1ff; text-align: center; letter-spacing: -0.5px;">Email Verification</h2>

              <p style="margin: 0 0 40px 0; font-size: 16px; line-height: 1.7; color: #8892b0; text-align: center;">
                Welcome to the future of secure verification! 🚀<br>
                Enter the code below to unlock your KYCChain account.
              </p>

              <!-- OTP Display Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%); padding: 40px; border-radius: 18px; border: 2px solid rgba(102, 126, 234, 0.3); box-shadow: 0 0 40px rgba(102, 126, 234, 0.2), inset 0 0 20px rgba(102, 126, 234, 0.1); position: relative; overflow: hidden;">

                      <!-- Animated grid background -->
                      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: linear-gradient(rgba(102, 126, 234, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 126, 234, 0.03) 1px, transparent 1px); background-size: 20px 20px; opacity: 0.5;"></div>

                      <div style="position: relative; z-index: 1;">
                        <p style="margin: 0 0 20px 0; font-size: 11px; font-weight: 700; color: #64ffda; letter-spacing: 3px; text-transform: uppercase; text-shadow: 0 0 10px rgba(100, 255, 218, 0.5);">⚡ Your Verification Code ⚡</p>

                        <div style="background: rgba(0, 0, 0, 0.3); padding: 25px 40px; border-radius: 14px; display: inline-block; border: 2px solid rgba(102, 126, 234, 0.4); box-shadow: 0 0 30px rgba(102, 126, 234, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5);">
                          <span style="font-size: 52px; font-weight: 900; background: linear-gradient(135deg, #64ffda 0%, #667eea 50%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: 14px; font-family: 'Courier New', monospace; text-shadow: 0 0 20px rgba(100, 255, 218, 0.5);">${otp}</span>
                        </div>

                        <p style="margin: 20px 0 0 0; font-size: 14px; color: #8892b0;">
                          <span style="color: #64ffda; font-weight: 700;">⏱️ Expires in 5 minutes</span>
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Instructions Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0;">
                <tr>
                  <td style="background: rgba(100, 255, 218, 0.05); border-left: 4px solid #64ffda; border-radius: 12px; padding: 28px; border: 1px solid rgba(100, 255, 218, 0.2);">
                    <h3 style="margin: 0 0 18px 0; font-size: 18px; font-weight: 700; color: #e6f1ff;">
                      <span style="color: #64ffda; margin-right: 10px;">✨</span>Quick Steps
                    </h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 6px 0;">
                          <p style="margin: 0; font-size: 15px; color: #8892b0; line-height: 1.6;">
                            <span style="display: inline-block; width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; text-align: center; line-height: 24px; color: white; font-weight: 700; font-size: 12px; margin-right: 10px;">1</span>
                            Copy the verification code above
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <p style="margin: 0; font-size: 15px; color: #8892b0; line-height: 1.6;">
                            <span style="display: inline-block; width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; text-align: center; line-height: 24px; color: white; font-weight: 700; font-size: 12px; margin-right: 10px;">2</span>
                            Return to the verification page
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <p style="margin: 0; font-size: 15px; color: #8892b0; line-height: 1.6;">
                            <span style="display: inline-block; width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; text-align: center; line-height: 24px; color: white; font-weight: 700; font-size: 12px; margin-right: 10px;">3</span>
                            Paste the code and continue
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <p style="margin: 0; font-size: 15px; color: #8892b0; line-height: 1.6;">
                            <span style="display: inline-block; width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; text-align: center; line-height: 24px; color: white; font-weight: 700; font-size: 12px; margin-right: 10px;">4</span>
                            Start your secure journey!
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 35px 0;">
                <tr>
                  <td style="background: rgba(252, 129, 129, 0.1); border: 2px solid rgba(252, 129, 129, 0.3); border-radius: 12px; padding: 22px; text-align: center;">
                    <p style="margin: 0; font-size: 15px; color: #ff6b6b; line-height: 1.6;">
                      <strong style="font-size: 24px; display: block; margin-bottom: 8px;">🔐</strong>
                      <strong>Security First:</strong> Never share this code with anyone. KYCChain staff will NEVER ask for your verification code.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Help Text -->
              <p style="margin: 35px 0 0 0; font-size: 14px; color: #495670; text-align: center; line-height: 1.7;">
                Didn't request this code?<br>
                <span style="color: #64ffda;">Your account is safe.</span> Simply ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(180deg, rgba(15, 15, 35, 0.5) 0%, rgba(10, 10, 20, 0.8) 100%); padding: 40px; border-top: 1px solid rgba(102, 126, 234, 0.2);">

              <!-- Support Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:support@kycchain.com" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 30px; font-weight: 700; font-size: 14px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4), 0 0 20px rgba(102, 126, 234, 0.3); letter-spacing: 0.5px; text-transform: uppercase;">
                      💬 Need Help?
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Company Info -->
              <div style="text-align: center; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 800; color: #e6f1ff; letter-spacing: -0.5px;">KYCChain</h3>
                <p style="margin: 0; font-size: 13px; color: #8892b0; line-height: 1.6;">
                  Next-generation blockchain verification platform<br>
                  <span style="color: #64ffda;">Powered by cutting-edge technology</span> 🌐
                </p>
              </div>

              <!-- Divider -->
              <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent); margin: 25px 0;"></div>

              <!-- Legal Footer -->
              <p style="margin: 0; font-size: 11px; color: #495670; text-align: center; line-height: 1.8;">
                This is an automated security message from KYCChain.<br>
                © ${new Date().getFullYear()} KYCChain. All rights reserved.<br>
                <a href="#" style="color: #667eea; text-decoration: none;">Privacy</a> •
                <a href="#" style="color: #667eea; text-decoration: none;">Terms</a> •
                <a href="#" style="color: #667eea; text-decoration: none;">Security</a>
              </p>

              ${email ? `<p style="margin: 20px 0 0 0; font-size: 10px; color: #495670; text-align: center;">
                ${email}
              </p>` : ''}

            </td>
          </tr>

        </table>
        <!-- End Main Container -->

      </td>
    </tr>
  </table>

</body>
</html>
`;

export default darkOTPTemplate;
