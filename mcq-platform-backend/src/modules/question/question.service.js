import pool from "../../config/db.js";

class QuestionService {
  static async bulkCreate({
    category_id,
    department_id,
    questions
  }) {
    const values = questions.map(q => [
      category_id,
      department_id,
      q.question_text,
      q.option_a,
      q.option_b,
      q.option_c,
      q.option_d,
      q.correct_option
    ]);

    const sql = `
      INSERT INTO questions
      (category_id, department_id, question_text,
       option_a, option_b, option_c, option_d, correct_option)
      VALUES ?
    `;

    const [result] = await pool.query(sql, [values]);
    return result.affectedRows;
  }
}

export default QuestionService;
