import pool from "../../config/db.js";
import { success, error } from "../../utils/response.js";

// GET all students
export const getAllStudents = async (req, res) => {
  try {
    const sql = `
      SELECT id, name, email, mobile, department_id,
             is_email_verified, created_at
      FROM users
    `;

    const [rows] = await pool.query(sql);

    return success(res, "Students fetched successfully", rows);
  } catch (err) {
    console.error(err);
    return error(res, "Database error");
  }
};

// GET student by ID
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT id, name, email, mobile, department_id, 
             is_email_verified, created_at
      FROM users
      WHERE id = ?
    `;

    const [rows] = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return error(res, "Student not found", null, 404);
    }

    return success(res, "Student fetched successfully", rows[0]);
  } catch (err) {
    console.error(err);
    return error(res, "Database error");
  }
};

// DELETE student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return error(res, "Student ID is required", null, 400);
    }

    const sql = `DELETE FROM users WHERE id = ?`;

    const [result] = await pool.query(sql, [id]);

    if (result.affectedRows === 0) {
      return error(res, "Student not found", null, 404);
    }

    return success(res, "Student deleted successfully");
  } catch (err) {
    console.error(err);
    return error(res, "Database error");
  }
};
