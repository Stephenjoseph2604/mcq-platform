import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT), // ✅ IMPORTANT
  secure: false, // true only for 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 🔍 Verify SMTP connection on server start
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
    
    console.error("❌ Mail server error:", error.message);
  } else {
    console.log("✅ Mail server ready");
  }
});

// User OTP template - matching your luxury purple dark theme
const getUserOtpEmailTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Email Verification</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0f0f23;
      color: #e2e8f0;
      line-height: 1.6;
      padding: 20px;
    }
    .email-container {
      max-width: 550px;
      margin: 0 auto;
      background: #111827;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(107, 70, 193, 0.3);
      border: 1px solid #374151;
    }
    .header {
      background: linear-gradient(135deg, #6b46c1 0%, #9f7aea 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo-title {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 50px 40px;
      text-align: center;
    }
    .greeting {
      font-size: 20px;
      color: #cbd5e1;
      margin-bottom: 30px;
      font-weight: 500;
    }
    .otp-container {
      background: linear-gradient(145deg, #6b46c1, #9f7aea);
      border-radius: 16px;
      padding: 45px 30px;
      margin: 40px 0;
      box-shadow: 0 20px 40px rgba(107, 70, 193, 0.4);
      position: relative;
    }
    .otp-label {
      font-size: 16px;
      color: rgba(255,255,255,0.95);
      margin-bottom: 16px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .otp-code {
      font-size: 48px;
      font-weight: 700;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      color: #ffffff;
      letter-spacing: 8px;
      margin: 0 0 20px 0;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .validity {
      font-size: 14px;
      color: rgba(255,255,255,0.95);
      font-weight: 500;
      background: rgba(255,255,255,0.15);
      padding: 12px 24px;
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,0.2);
      display: inline-block;
      letter-spacing: 0.3px;
    }
    .instruction-text {
      color: #94a3b8;
      font-size: 15px;
      margin-top: 25px;
      line-height: 1.7;
    }
    .footer {
      background: #1f2937;
      padding: 30px 30px 25px;
      text-align: center;
      border-top: 1px solid #374151;
    }
    .footer-text {
      font-size: 14px;
      color: #9ca3af;
      line-height: 1.6;
    }
    .footer-signature {
      color: #9f7aea;
      font-weight: 600;
      margin-top: 8px;
    }
    @media screen and (max-width: 600px) {
      body { padding: 15px; }
      .email-container { margin: 10px; border-radius: 10px; }
      .header, .content, .footer { padding-left: 25px; padding-right: 25px; }
      .otp-code { font-size: 40px; letter-spacing: 6px; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo-title">MCQ Platform</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Welcome aboard! Please verify your email address.</p>
      
      <div class="otp-container">
        <p class="otp-label">Your Verification Code</p>
        <h1 class="otp-code">${otp}</h1>
        <div class="validity">
          Valid for 10 minutes
        </div>
      </div>
      
      <p class="instruction-text">
        Enter this code on the MCQ Platform website to complete your verification.
      </p>
    </div>
    
    <div class="footer">
      <p class="footer-text">
        This is an automated security email. Please do not reply to this message.
      </p>
      <p class="footer-signature">MCQ Platform Team</p>
    </div>
  </div>
</body>
</html>
`;
};

// Updated user send function
export const sendOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Email Verification OTP",
    html: getUserOtpEmailTemplate(otp),
  });
};

// Separate template function - extracts the HTML generation logic
const getAdminOtpEmailTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Admin OTP Verification</title>
  <style>
    /* Email-safe reset and base styles */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0f0f23;
      color: #e2e8f0;
      line-height: 1.6;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #111827;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(107, 70, 193, 0.4);
      border: 1px solid #374151;
    }
    .header {
      background: linear-gradient(135deg, #6b46c1 0%, #9f7aea 100%);
      padding: 45px 35px;
      text-align: center;
    }
    .logo-title {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 16px;
      color: rgba(255,255,255,0.9);
      margin: 0;
      font-weight: 500;
    }
    .content {
      padding: 50px 40px;
      text-align: center;
    }
    .greeting {
      font-size: 22px;
      color: #f8fafc;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .message {
      font-size: 16px;
      color: #cbd5e1;
      margin-bottom: 35px;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.7;
    }
    .otp-container {
      background: linear-gradient(145deg, #6b46c1, #9f7aea);
      border-radius: 20px;
      padding: 50px 30px;
      margin: 45px 0;
      box-shadow: 0 25px 50px rgba(107, 70, 193, 0.45);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .otp-label {
      font-size: 17px;
      color: rgba(255,255,255,0.95);
      margin-bottom: 20px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.2px;
    }
    .otp-code {
      font-size: 56px;
      font-weight: 700;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      color: #ffffff;
      letter-spacing: 10px;
      margin: 0 0 25px 0;
      text-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .validity {
      font-size: 15px;
      color: rgba(255,255,255,0.95);
      font-weight: 600;
      background: rgba(255,255,255,0.15);
      padding: 14px 28px;
      border-radius: 30px;
      border: 1px solid rgba(255,255,255,0.2);
      display: inline-block;
      letter-spacing: 0.4px;
    }
    .security-note {
      font-size: 14px;
      color: #a78bfa;
      margin-top: 35px;
      font-weight: 500;
      line-height: 1.6;
    }
    .footer {
      background: #1f2937;
      padding: 35px 35px 30px;
      text-align: center;
      border-top: 1px solid #374151;
    }
    .footer-text {
      font-size: 14px;
      color: #9ca3af;
      line-height: 1.6;
    }
    .footer-signature {
      color: #9f7aea;
      font-weight: 600;
      margin-top: 10px;
    }
    @media screen and (max-width: 600px) {
      body { padding: 15px; }
      .email-container { margin: 10px; border-radius: 12px; }
      .header, .content, .footer { padding-left: 25px; padding-right: 25px; }
      .otp-code { font-size: 44px; letter-spacing: 8px; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo-title">MCQ Platform</h1>
      <p class="subtitle">Admin Panel Access Verification</p>
    </div>
    
    <div class="content">
      <p class="greeting">Hello Admin,</p>
      <p class="message">
        You have requested to register as an <strong>Admin</strong> on our MCQ Platform. 
        Please use the secure One-Time Password (OTP) below to complete your verification.
      </p>
      
      <div class="otp-container">
        <p class="otp-label">Your Verification Code</p>
        <h1 class="otp-code">${otp}</h1>
        <div class="validity">
          Valid for 10 minutes
        </div>
      </div>
      
      <p class="security-note">
        If you did not request this code, please ignore this email or contact support immediately.
      </p>
    </div>
    
    <div class="footer">
      <p class="footer-text">
        This is an automated security email. Please do not reply directly to this message.
      </p>
      <p class="footer-signature">MCQ Platform Admin Team</p>
    </div>
  </div>
</body>
</html>
`;
};
 
// Updated send function - now uses the template function
export const sendAdminOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Admin Registration OTP Verification",
    html: getAdminOtpEmailTemplate(otp),
  });
};
