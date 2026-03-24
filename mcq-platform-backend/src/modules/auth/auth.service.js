import db from "../../config/db.js";
import bcrypt from "bcryptjs";
import { sendOtpMail } from "../../config/mail.js";
import { generateToken } from "../../config/jwt.js";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* SEND OTP */
export const sendOtp = async (email) => {
    console.log("Sending OTP to:", email);
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('hello');

  await db.query("DELETE FROM email_otp WHERE email = ?", [email]);
    console.log('hi');
    
  await db.query(
    `INSERT INTO email_otp (email, otp, expires_at) VALUES (?, ?, ?)`,
    [email, otp, expiresAt]
  );

  await sendOtpMail(email, otp);
};

/* VERIFY OTP + REGISTER */
export const verifyOtpAndRegister = async (data) => {
  const { name, email, mobile, department_id, password, otp } = data;

  const [otpRows] = await db.query(
    `SELECT * FROM email_otp 
     WHERE email = ? AND otp = ? AND expires_at > NOW()`,
    [email, otp]
  );

  if (!otpRows.length) throw new Error("Invalid or expired OTP");

  const [userExists] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  if (userExists.length) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO users 
    (name, email, mobile, department_id, password_hash, is_email_verified)
     VALUES (?, ?, ?, ?, ?, true)`,
    [name, email, mobile, department_id, passwordHash]
  );

  await db.query("DELETE FROM email_otp WHERE email = ?", [email]);
};

/* LOGIN */
export const login = async ({ email, password }) => {
  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email, u.mobile, d.code AS department, u.password_hash
     FROM users u
     JOIN departments d ON d.id = u.department_id
     WHERE u.email = ?`,
    [email]
  );

  if (!rows.length) throw new Error("Invalid credentials");

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");

  const token = generateToken({
    userId: user.id,
    role: "STUDENT"
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      department: user.department,
      role:'STUDENT'
    }
  };
};
