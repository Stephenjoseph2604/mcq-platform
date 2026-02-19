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
export const getStudentById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id, name, email, mobile, department_id, is_email_verified, created_at
    FROM users
    WHERE id = ?
  `;

  pool.query(sql, [id], (err, result) => {
    if (err) return error(res, "Database error", err);

    if (result.length === 0)
      return error(res, "Student not found", null, 404);

    res.json(result[0]);
  });
};

// DELETE student
export const deleteStudent = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM users WHERE id = ?`;

  pool.query(sql, [id], (err, result) => {
    if (err) return error(res, "Database error", err);

    if (result.affectedRows === 0)
      return error(res, "Student not found", null, 404);

    return success(res, "Student deleted successfully");
  });
};
