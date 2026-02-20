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



export const deleteQuestionById = async (id) => {
  const sql = `DELETE FROM questions WHERE id = ?`;

  const [result] = await pool.query(sql, [id]);

  return result.affectedRows > 0;
};



export const updateQuestionById = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.category_id !== undefined) {
    fields.push("category_id = ?");
    values.push(data.category_id);
  }

  if (data.department_id !== undefined) {
    fields.push("department_id = ?");
    values.push(data.department_id);
  }

  if (data.question_text !== undefined) {
    fields.push("question_text = ?");
    values.push(data.question_text);
  }

  if (data.option_a !== undefined) {
    fields.push("option_a = ?");
    values.push(data.option_a);
  }

  if (data.option_b !== undefined) {
    fields.push("option_b = ?");
    values.push(data.option_b);
  }

  if (data.option_c !== undefined) {
    fields.push("option_c = ?");
    values.push(data.option_c);
  }

  if (data.option_d !== undefined) {
    fields.push("option_d = ?");
    values.push(data.option_d);
  }

  if (data.correct_option !== undefined) {
    fields.push("correct_option = ?");
    values.push(data.correct_option);
  }

  if (fields.length === 0) {
    return false;
  }

  const sql = `
    UPDATE questions
    SET ${fields.join(", ")}
    WHERE id = ?
  `;

  values.push(id);

  const [result] = await pool.query(sql, values);

  return result.affectedRows > 0;
};



export const getQuestionById = async (id) => {
  const sql = `
    SELECT 
      q.id,
      q.category_id,
      q.department_id,
      q.question_text,
      q.option_a,
      q.option_b,
      q.option_c,
      q.option_d,
      q.correct_option,
      q.created_at
    FROM questions q
    WHERE q.id = ?
    LIMIT 1
  `;

  const [rows] = await pool.query(sql, [id]);

  return rows.length ? rows[0] : null;
};