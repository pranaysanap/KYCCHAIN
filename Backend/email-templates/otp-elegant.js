// Elegant Minimalist OTP Email Template
// Clean, professional design with subtle animations

export const elegantOTPTemplate = (otp, email = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify Your Email - KYCChain</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f7fa; padding: 50px 20px;">
    <tr>
      <td align="center">

        <!-- Main Email Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px 30px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <!-- Logo Circle -->
              <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>

              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">KYCChain</h1>
              <p style="margin: 8px 0 0 0; font-size: 15px; color: rgba(255, 255, 255, 0.9); font-weight: 400;">Secure Identity Verification</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">

              <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #1a202c; text-align: center;">Verify Your Email</h2>

              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4a5568; text-align: center;">
                Thank you for choosing KYCChain! To complete your registration and secure your account, please use the verification code below.
              </p>

              <!-- OTP Display Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 35px 0;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px 40px; border-radius: 16px; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.35); position: relative;">

                      <!-- Decorative elements -->
                      <div style="position: absolute; top: 10px; right: 10px; width: 50px; height: 50px; border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 50%;"></div>
                      <div style="position: absolute; bottom: 10px; left: 10px; width: 40px; height: 40px; border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 50%;"></div>

                      <p style="margin: 0 0 15px 0; font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.85); letter-spacing: 2px; text-transform: uppercase;">Verification Code</p>

                      <div style="background: rgba(255, 255, 255, 0.15); padding: 20px 35px; border-radius: 12px; display: inline-block; backdrop-filter: blur(5px); border: 1px solid rgba(255, 255, 255, 0.2);">
                        <span style="font-size: 44px; font-weight: 800; color: #ffffff; letter-spacing: 10px; font-family: 'Courier New', monospace; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">${otp}</span>
                      </div>

                      <p style="margin: 15px 0 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.85);">
                        <strong>Expires in 5 minutes</strong>
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Instructions -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 35px 0;">
                <tr>
                  <td style="background: #f7fafc; border-left: 4px solid #667eea; border-radius: 10px; padding: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 17px; font-weight: 700; color: #2d3748;">
                      📋 How to Use This Code
                    </h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 5px 0;">
                          <p style="margin: 0; font-size: 15px; color: #4a5568; line-height: 1.5;">
                            <span style="color: #667eea; font-weight: 700; margin-right: 8px;">1.</span>
                            Copy the verification code above
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;">
                          <p style="margin: 0; font-size: 15px; color: #4a5568; line-height: 1.5;">
                            <span style="color: #667eea; font-weight: 700; margin-right: 8px;">2.</span>
                            Return to the KYCChain registration page
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;">
                          <p style="margin: 0; font-size: 15px; color: #4a5568; line-height: 1.5;">
                            <span style="color: #667eea; font-weight: 700; margin-right: 8px;">3.</span>
                            Enter the code in the verification field
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;">
                          <p style="margin: 0; font-size: 15px; color: #4a5568; line-height: 1.5;">
                            <span style="color: #667eea; font-weight: 700; margin-right: 8px;">4.</span>
                            Complete your registration
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Tips -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%); border: 2px solid #fc8181; border-radius: 10px; padding: 20px; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #c53030; line-height: 1.6;">
                      <strong style="font-size: 18px;">🔒</strong><br>
                      <strong>Important:</strong> Never share this code with anyone. KYCChain will never ask for your verification code via phone, email, or any other communication channel.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Help Text -->
              <p style="margin: 30px 0 0 0; font-size: 14px; color: #718096; text-align: center; line-height: 1.6;">
                Didn't request this verification code?<br>
                You can safely ignore this email. Your account remains secure.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(180deg, #f7fafc 0%, #edf2f7 100%); padding: 35px 40px; border-top: 1px solid #e2e8f0;">

              <!-- Support Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td align="center">
                    <a href="mailto:support@kycchain.com" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                      💬 Contact Support
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Company Info -->
              <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #2d3748;">KYCChain</h3>
                <p style="margin: 0; font-size: 13px; color: #718096; line-height: 1.5;">
                  Empowering secure document verification worldwide
                </p>
              </div>

              <!-- Divider -->
              <div style="height: 1px; background: linear-gradient(90deg, transparent, #cbd5e0, transparent); margin: 20px 0;"></div>

              <!-- Legal Footer -->
              <p style="margin: 0; font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.7;">
                This is an automated message from KYCChain. Please do not reply to this email.<br>
                © ${new Date().getFullYear()} KYCChain. All rights reserved.<br>
                <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a> •
                <a href="#" style="color: #667eea; text-decoration: none;">Terms of Service</a>
              </p>

              ${email ? `<p style="margin: 15px 0 0 0; font-size: 11px; color: #cbd5e0; text-align: center;">
                Sent to: ${email}
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

export default elegantOTPTemplate;
