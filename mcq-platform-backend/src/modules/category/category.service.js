import pool from "../../config/db.js";

class CategoryService {
  static async create({ name }) {
    const [result] = await pool.execute(
      "INSERT INTO question_category (name) VALUES (?)",
      [name]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      "SELECT id, name FROM question_category ORDER BY name"
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, name FROM question_category WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async update(id, { name }) {
    const [result] = await pool.execute(
      "UPDATE question_category SET name = ? WHERE id = ?",
      [name, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM question_category WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  }
}

export default CategoryService;
