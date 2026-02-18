import pool from "../../config/db.js";

class DepartmentService {
  static async create({ code, name }) {
    const [result] = await pool.execute(
      "INSERT INTO departments (code, name) VALUES (?, ?)",
      [code, name]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      "SELECT id, code, name FROM departments ORDER BY name"
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, code, name FROM departments WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async update(id, { code, name }) {
    const [result] = await pool.execute(
      "UPDATE departments SET code = ?, name = ? WHERE id = ?",
      [code, name, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM departments WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  }
}

export default DepartmentService;
