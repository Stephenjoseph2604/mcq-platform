import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import db from '../../config/db.js';
import { generateToken } from '../../config/jwt.js';

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