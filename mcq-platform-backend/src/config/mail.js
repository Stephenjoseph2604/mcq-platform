import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT), // ✅ IMPORTANT
  secure: false, // true only for 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});
 
// 🔍 Verify SMTP connection on server start
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail server error:", error.message);
  } else {
    console.log("✅ Mail server ready");
  }
});

export const sendOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM, // ✅ better
    to: email,
    subject: "Email Verification OTP",
    html: `
      <h2>MCQ Platform</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for <b>10 minutes</b>.</p>
    `
  }); 
};
