import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import db from '../../config/db.js';
import { generateToken } from '../../config/jwt.js';
import { sendAdminOtpMail, sendOtpMail } from '../../config/mail.js';


const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


export const createDefaultSuperAdmin = async () => {
  try {
    const {
      SUPER_ADMIN_NAME,
      SUPER_ADMIN_EMAIL,
      SUPER_ADMIN_PASSWORD,
      SUPER_ADMIN_ROLE,
    } = process.env;

    if (
      !SUPER_ADMIN_NAME ||
      !SUPER_ADMIN_EMAIL ||
      !SUPER_ADMIN_PASSWORD ||
      !SUPER_ADMIN_ROLE
    ) {
      throw new Error("SuperAdmin environment variables are missing");
    }

    // 🔍 Check if SuperAdmin already exists
    const [existing] = await db.query(
      "SELECT id FROM admin WHERE email = ?",
      [SUPER_ADMIN_EMAIL]
    );
 
    
    if (existing.length > 0) {
      console.log("✅ SuperAdmin already exists");
      return;
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

    // 🧑‍💼 Insert SuperAdmin
    await db.query(
      `
      INSERT INTO admin (name, email, password_hash, role)
      VALUES (?, ?, ?, 'SUPER_ADMIN')
      `,
      [
        SUPER_ADMIN_NAME,
        SUPER_ADMIN_EMAIL,
        hashedPassword,
      ]
    );
 
    console.log("🚀 Default SuperAdmin created successfully");
  } catch (error) {
    console.error("❌ Failed to create SuperAdmin:", error.message);
  }
};



export const loginAdmin = async (email, password) => {
  const [rows] = await db.query(
    `SELECT *
     FROM admin 
     WHERE email = ?`,
    [email]
  );

  if (rows.length === 0) {
    throw { message: "Invalid email or password", statusCode: 401 };
  }

  const admin = rows[0];

  // ✅ Check if admin is active
  if (!admin.is_active) {
    throw { message: "Account is deactivated. Contact SUPER_ADMIN.", statusCode: 403 };
  }

  // ✅ Check password
  const isMatch = await bcrypt.compare(password, admin.password_hash);
  if (!isMatch) {
    throw { message: "Invalid email or password", statusCode: 401 };
  }

  // JWT Payload
  const tokenPayload = {
    id: admin.id,
    role: admin.role,
    type: "ADMIN",
  };

  const token = generateToken(tokenPayload);

  // Remove password_hash before response
  const { password_hash, ...adminData } = admin;

  return {
    token,
    admin: adminData,
  };
};

export const fetchAdminMetaData = async () => {
  const [rows] = await db.query(`
    SELECT
      (SELECT COUNT(*) FROM question_category) AS categories,
      (SELECT COUNT(*) FROM questions) AS questions,
      (SELECT COUNT(*) FROM departments) AS departments,
      (SELECT COUNT(*) FROM quiz) AS quizzes,
      (SELECT COUNT(*) FROM users) AS students
  `);

  return rows[0];
};

export const sendAdminOtp = async (email) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.query("DELETE FROM email_otp WHERE email = ?", [email]);

  await db.query(
    `INSERT INTO email_otp (email, otp, expires_at) VALUES (?, ?, ?)`,
    [email, otp, expiresAt]
  );

  await sendAdminOtpMail(email, otp);
};


export const verifyOtpAndCreateAdminRequest = async (data) => {
  const { name, email, password, otp ,role} = data;

  const [otpRows] = await db.query(
    `SELECT * FROM email_otp 
     WHERE email = ? AND otp = ? AND expires_at > NOW()`,
    [email, otp]
  );
console.log('hi');

  if (!otpRows.length) throw new Error("Invalid or expired OTP");

  const [exists] = await db.query(
    "SELECT id FROM admin WHERE email = ?",
    [email]
  );
  if (exists.length) throw new Error("Admin already exists");

  const passwordHash = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO admin_requests (name, email, password_hash,role)
     VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash,role]
  );

  await db.query("DELETE FROM email_otp WHERE email = ?", [email]);
};


export const approveAdminRequest = async (requestId) => {
  const [rows] = await db.query(
    "SELECT * FROM admin_requests WHERE id = ? AND status = 'PENDING'",
    [requestId]
  );

  if (!rows.length) throw new Error("Request not found");

  const request = rows[0];

  await db.query(
    `INSERT INTO admin (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [request.name, request.email, request.password_hash,request.role]
  );

  await db.query(
    "UPDATE admin_requests SET status = 'APPROVED' WHERE id = ?",
    [requestId]
  );
};


export const rejectAdminRequest = async (requestId) => {
  await db.query(
    "UPDATE admin_requests SET status = 'REJECTED' WHERE id = ?",
    [requestId]
  );
};

export const deleteAdminRequest = async (requestId) => {
  await db.query("DELETE FROM admin_requests WHERE id = ?", [requestId]);
};


export const activateAdmin = async (adminId) => {
  await db.query(
    "UPDATE admin SET is_active = TRUE WHERE id = ?",
    [adminId]
  );
};


export const deactivateAdmin = async (adminId) => {
  // Check admin exists
  const [rows] = await db.query(
    "SELECT role FROM admin WHERE id = ?",
    [adminId]
  );

  if (!rows.length) {
    throw new Error("Admin not found");
  }

  const admin = rows[0];

  // ❌ Prevent SUPER_ADMIN deactivation
  if (admin.role === "SUPER_ADMIN") {
    throw new Error("SUPER_ADMIN cannot be deactivated");
  }

  await db.query(
    "UPDATE admin SET is_active = FALSE WHERE id = ?",
    [adminId]
  );
};


export const deleteAdmin = async (adminId) => {
  // Check if admin exists
  const [rows] = await db.query(
    "SELECT role FROM admin WHERE id = ?",
    [adminId]
  );

  if (!rows.length) {
    throw new Error("Admin not found");
  }

  const admin = rows[0];

  // Prevent SUPER_ADMIN deletion
  if (admin.role === "SUPER_ADMIN") {
    throw new Error("SUPER_ADMIN cannot be deleted");
  }

  // Delete if not SUPER_ADMIN
  await db.query("DELETE FROM admin WHERE id = ?", [adminId]);
};



export const getAllAdmins = async () => {
  const [rows] = await db.query(
    `SELECT id, name, email, role, is_active, created_at
     FROM admin`
  );

  return rows;
};

export const getAllAdminRequests = async () => {
  const [rows] = await db.query(
    `SELECT id, name, email,role, status,role, requested_at
     FROM admin_requests
     ORDER BY requested_at DESC`
  );

  return rows;
};


export const getPendingAdminRequests = async () => {
  const [rows] = await db.query(
    `SELECT id, name, email, status,role, requested_at
     FROM admin_requests
     WHERE status = 'PENDING'
     ORDER BY requested_at DESC`
  );

  return rows;
};