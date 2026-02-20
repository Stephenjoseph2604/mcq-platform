import pool from "../../config/db.js";

export const bulkCreateQuestionsService = async ({
  category_id,
  department_id,
  questions,
}) => {
  const values = questions.map((q) => [
    category_id,
    department_id,
    q.question_text,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.correct_option,
  ]);

  const sql = `
    INSERT INTO questions
    (category_id, department_id, question_text,
     option_a, option_b, option_c, option_d, correct_option)
    VALUES ?
  `;

  const [result] = await pool.query(sql, [values]);
  return result.affectedRows;
};
export const getCategoriesWithQuestionCount = async () => {
  const sql = `
    SELECT 
      c.id,
      c.name,
      COUNT(q.id) AS totalQuestions
    FROM question_category c
    LEFT JOIN questions q ON q.category_id = c.id
    GROUP BY c.id, c.name
    ORDER BY c.id;
  `;

  const [categories] = await pool.query(sql);

  // Find Technical category
  const technicalCategory = categories.find((c) => c.name === "Technical");

  if (technicalCategory) {
    const deptSql = `
      SELECT 
        d.id AS department_id,
        d.name AS department_name,
        COUNT(q.id) AS questionCount
      FROM questions q
      JOIN departments d ON d.id = q.department_id
      WHERE q.category_id = ?
      GROUP BY d.id, d.name
    `;

    const [departments] = await pool.query(deptSql, [technicalCategory.id]);

    technicalCategory.departments = departments;
  }

  return categories;
};

export const getQuestionsByCategory = async (categoryId, departmentId) => {
  let sql = `
    SELECT 
      id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option
    FROM questions
    WHERE category_id = ?
  `;

  const params = [categoryId];

  // Applied ONLY when frontend sends department_id (Technical case)
  if (departmentId !== undefined && departmentId !== null) {
    sql += ` AND department_id = ?`;
    params.push(departmentId);
  }

  sql += ` ORDER BY created_at DESC LIMIT 500`;

  const [rows] = await pool.query(sql, params);
  return rows;
};
