import db from "../../config/db.js";

export const startQuiz = async ({ quiz_id, user_id }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Existing attempt check
    const [existing] = await conn.execute(
      `SELECT id FROM quiz_attempt
       WHERE quiz_id = ? AND user_id = ?`,
      [quiz_id, user_id]
    );

    let attemptId;

    if (existing.length) {
      attemptId = existing[0].id;
    } else {
      const [attempt] = await conn.execute(
        `INSERT INTO quiz_attempt (quiz_id, user_id, start_time)
         VALUES (?, ?, NOW())`,
        [quiz_id, user_id]
      );
      attemptId = attempt.insertId;
    }

    // 2. User department
    const [[user]] = await conn.execute(
      `SELECT department_id FROM users WHERE id = ?`,
      [user_id]
    );

    if (!user) throw new Error("User not found");

    // 3. Config
    const [configs] = await conn.execute(
      `SELECT * FROM quiz_question_config WHERE quiz_id = ?`,
      [quiz_id]
    );

    // 4. Lock questions if not already locked
    const [locked] = await conn.execute(
      `SELECT 1 FROM quiz_attempt_questions WHERE attempt_id = ? LIMIT 1`,
      [attemptId]
    );

    if (!locked.length) {
      for (const cfg of configs) {
        let query = `
          SELECT id FROM questions
          WHERE category_id = ?
        `;
        const params = [cfg.category_id];

        // Technical → department based
        if (cfg.category_id === 4) {
          query += ` AND department_id = ?`;
          params.push(user.department_id);
        }

        query += ` ORDER BY RAND() LIMIT ?`;
        params.push(cfg.question_count);

        const [questions] = await conn.execute(query, params);

        for (const q of questions) {
          await conn.execute(
            `INSERT INTO quiz_attempt_questions (attempt_id, question_id)
             VALUES (?, ?)`,
            [attemptId, q.id]
          );
        }
      }
    }

    // 5. Fetch locked questions
    const [finalQuestions] = await conn.execute(
      `SELECT q.id, q.question_text,
              q.option_a, q.option_b, q.option_c, q.option_d,
              q.category_id
       FROM quiz_attempt_questions aq
       JOIN questions q ON q.id = aq.question_id
       WHERE aq.attempt_id = ?`,
      [attemptId]
    );

    await conn.commit();

    return {
      attempt_id: attemptId,
      questions: finalQuestions
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
