import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import db from '../../config/db.js';

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
