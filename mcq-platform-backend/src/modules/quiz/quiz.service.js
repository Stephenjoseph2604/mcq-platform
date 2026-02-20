import db from "../../config/db.js";

export const createQuiz = async (payload) => {
  const { title, quiz_code, duration_minutes, rules, config } = payload;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const totalQuestions = config.reduce((sum, c) => sum + c.question_count, 0);

    const [quizResult] = await conn.execute(
      `INSERT INTO quiz (title, quiz_code, duration_minutes, total_questions)
       VALUES (?, ?, ?, ?)`,
      [title, quiz_code, duration_minutes, totalQuestions],
    );

    const quizId = quizResult.insertId;

    for (const rule of rules) {
      await conn.execute(
        `INSERT INTO quiz_rule (quiz_id, rule_text)
         VALUES (?, ?)`,
        [quizId, rule],
      );
    }

    for (const c of config) {
      await conn.execute(
        `INSERT INTO quiz_question_config
         (quiz_id, category_id, department_id, question_count)
         VALUES (?, ?, NULL, ?)`,
        [quizId, c.category_id, c.question_count],
      );
    }

    await conn.commit();
    return quizId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const updateQuiz = async (quizId, payload) => {
  const { title, duration_minutes, rules, config } = payload;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // ❗ Block editing if quiz already attempted
    const [attempts] = await conn.execute(
      `SELECT 1 FROM quiz_attempt WHERE quiz_id = ? LIMIT 1`,
      [quizId],
    );

    if (attempts.length) {
      throw new Error("Quiz cannot be edited after attempts started");
    }

    // 1️⃣ Update quiz basic info
    const totalQuestions = config.reduce((sum, c) => sum + c.question_count, 0);

    await conn.execute(
      `UPDATE quiz
       SET title = ?, duration_minutes = ?, total_questions = ?
       WHERE id = ?`,
      [title, duration_minutes, totalQuestions, quizId],
    );

    // 2️⃣ Replace rules
    await conn.execute(`DELETE FROM quiz_rule WHERE quiz_id = ?`, [quizId]);

    for (const rule of rules) {
      await conn.execute(
        `INSERT INTO quiz_rule (quiz_id, rule_text)
         VALUES (?, ?)`,
        [quizId, rule],
      );
    }

    // 3️⃣ Replace category config
    await conn.execute(`DELETE FROM quiz_question_config WHERE quiz_id = ?`, [
      quizId,
    ]);

    for (const c of config) {
      await conn.execute(
        `INSERT INTO quiz_question_config
         (quiz_id, category_id, department_id, question_count)
         VALUES (?, ?, NULL, ?)`,
        [quizId, c.category_id, c.question_count],
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

/**
 * Start quiz: lock questions and return them
 */
export const startQuizForStudent = async (quizId, userId) => {
  const conn = await db.getConnection();

  try {
    // 🔒 0️⃣ Block if quiz already submitted
    const [submittedAttempt] = await conn.execute(
      `SELECT id 
       FROM quiz_attempt
       WHERE quiz_id = ? AND user_id = ? AND submitted = TRUE
       LIMIT 1`,
      [quizId, userId],
    );

    if (submittedAttempt.length > 0) {
      return {
        alreadySubmitted: true,
        message: "Quiz already submitted",
      };
    }

    // 1️⃣ Get quiz duration
    const [[quiz]] = await conn.execute(
      `SELECT duration_minutes FROM quiz WHERE id = ?`,
      [quizId],
    );

    if (!quiz) throw new Error("Quiz not found");

    const durationSeconds = quiz.duration_minutes * 60;

    // 2️⃣ Check active attempt
    const [attempts] = await conn.execute(
      `SELECT id, start_time 
       FROM quiz_attempt
       WHERE quiz_id = ? AND user_id = ? AND submitted = FALSE
       LIMIT 1`,
      [quizId, userId],
    );

    let attemptId;
    let startTime;

    if (attempts.length) {
      attemptId = attempts[0].id;
      startTime = new Date(attempts[0].start_time);

      const elapsedSeconds = Math.floor(
        (Date.now() - startTime.getTime()) / 1000,
      );

      const remainingTimeSeconds = Math.max(
        durationSeconds - elapsedSeconds,
        0,
      );

      if (remainingTimeSeconds <= 0) {
        await conn.execute(
          `UPDATE quiz_attempt
           SET submitted = TRUE, end_time = NOW()
           WHERE id = ?`,
          [attemptId],
        );

        return {
          alreadySubmitted: true,
          message: "Quiz time expired and auto-submitted",
        };
      }

      const [lockedQuestions] = await conn.execute(
        `SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d
         FROM quiz_attempt_questions qa
         JOIN questions q ON qa.question_id = q.id
         WHERE qa.attempt_id = ?`,
        [attemptId],
      );

      return {
        attemptId,
        remainingTimeSeconds,
        questions: lockedQuestions,
      };
    }

    // 3️⃣ Create new attempt
    startTime = new Date();
    const [result] = await conn.execute(
      `INSERT INTO quiz_attempt (quiz_id, user_id, start_time)
       VALUES (?, ?, ?)`,
      [quizId, userId, startTime],
    );
    attemptId = result.insertId;

    // 4️⃣ Get user's department
    const [[user]] = await conn.execute(
      `SELECT department_id FROM users WHERE id = ?`,
      [userId],
    );

    if (!user) throw new Error("User not found");

    // 5️⃣ Quiz config
    const [config] = await conn.execute(
      `SELECT category_id, department_id, question_count
       FROM quiz_question_config
       WHERE quiz_id = ?`,
      [quizId],
    );

    let questionsToInsert = [];

    for (const c of config) {
      let query = `
        SELECT id, question_text, option_a, option_b, option_c, option_d
        FROM questions
        WHERE category_id = ?
      `;
      const params = [c.category_id];

      if (!c.department_id && c.category_id === 4) {
        query += ` AND department_id = ?`;
        params.push(user.department_id);
      } else if (c.department_id) {
        query += ` AND department_id = ?`;
        params.push(c.department_id);
      }

      query += ` ORDER BY RAND() LIMIT ${c.question_count}`;

      const [rows] = await conn.execute(query, params);
      questionsToInsert.push(...rows);
    }

    // 6️⃣ Lock questions
    for (const q of questionsToInsert) {
      await conn.execute(
        `INSERT INTO quiz_attempt_questions (attempt_id, question_id)
         VALUES (?, ?)`,
        [attemptId, q.id],
      );
    }

    return {
      attemptId,
      remainingTimeSeconds: durationSeconds,
      questions: questionsToInsert,
    };
  } finally {
    conn.release();
  }
};

export const submitQuizForStudent = async (attemptId, answers) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ Validate attempt exists and is not submitted
    const [[attempt]] = await conn.query(
      `SELECT * FROM quiz_attempt WHERE id = ? AND submitted = FALSE`,
      [attemptId],
    );
    if (!attempt) throw new Error("Invalid or already submitted attempt");

    // 2️⃣ Fetch all locked questions for this attempt
    const [lockedQuestions] = await conn.query(
      `SELECT question_id FROM quiz_attempt_questions WHERE attempt_id = ?`,
      [attemptId],
    );
    const lockedIds = lockedQuestions.map((q) => q.question_id);

    // 3️⃣ Normalize frontend keys to match DB columns
    const normalizedAnswers = answers.map((a) => ({
      question_id: a.questionId,
      selected_option: a.selectedOption,
    }));

    // 4️⃣ Validate that submitted answers belong to locked questions
    for (const ans of normalizedAnswers) {
      if (!lockedIds.includes(ans.question_id)) {
        throw new Error(
          `Question ${ans.question_id} was not assigned in this attempt`,
        );
      }
    }

    // 5️⃣ Fetch correct options and categories for these questions
    const questionIds = normalizedAnswers.map((a) => a.question_id);
    const [questions] = await conn.query(
      `SELECT id, correct_option, category_id FROM questions WHERE id IN (?)`,
      [questionIds],
    );

    // 6️⃣ Map questionId -> { correct_option, category_id }
    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q.id] = {
        correct_option: q.correct_option,
        category_id: q.category_id,
      };
    });

    let totalCorrect = 0;
    const sectionTotals = {}; // { category_id: { total, correct } }

    // 7️⃣ Insert answers and calculate per-category stats
    for (const ans of normalizedAnswers) {
      const question = questionMap[ans.question_id];
      if (!question) throw new Error(`Invalid question_id: ${ans.question_id}`);

      const isCorrect = ans.selected_option === question.correct_option ? 1 : 0;
      if (isCorrect) totalCorrect++;

      // Maintain per-category totals
      if (!sectionTotals[question.category_id])
        sectionTotals[question.category_id] = { total: 0, correct: 0 };
      sectionTotals[question.category_id].total++;
      sectionTotals[question.category_id].correct += isCorrect;

      await conn.query(
        `INSERT INTO quiz_attempt_answers (attempt_id, question_id, selected_option, is_correct)
         VALUES (?, ?, ?, ?)`,
        [attemptId, ans.question_id, ans.selected_option, isCorrect],
      );
    }

    // 8️⃣ Insert per-section results
    for (const [categoryId, stats] of Object.entries(sectionTotals)) {
      const percentage = (stats.correct / stats.total) * 100;
      await conn.query(
        `INSERT INTO quiz_section_result (attempt_id, category_id, total_questions, correct_answers, percentage)
         VALUES (?, ?, ?, ?, ?)`,
        [attemptId, categoryId, stats.total, stats.correct, percentage],
      );
    }

    // 9️⃣ Update quiz_attempt with total score, percentage, end_time
    const totalQuestions = normalizedAnswers.length;
    const percentage = totalQuestions
      ? (totalCorrect / totalQuestions) * 100
      : 0;
    const endTime = new Date();

    await conn.query(
      `UPDATE quiz_attempt
       SET submitted = TRUE, total_score = ?, percentage = ?, end_time = ?
       WHERE id = ?`,
      [totalCorrect, percentage, endTime, attemptId],
    );

    await conn.commit();

    return { attemptId, totalCorrect, totalQuestions, percentage };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getStudentQuizReport = async (quizId, studentId) => {
  const conn = await db.getConnection();

  try {
    // 1️⃣ Fetch student info
    const [[student]] = await conn.query(
      `SELECT u.id, u.name, d.name AS department
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = ?`,
      [studentId],
    );

    if (!student) throw new Error("Student not found");

    // 2️⃣ Fetch quiz info and attempt
    // 2️⃣ Fetch quiz info and attempt ✅ FIXED
    const [[attempt]] = await conn.query(
      `SELECT 
      qa.id AS attempt_id,
      q.id AS quiz_id,
      q.title AS quiz_title,
      qa.start_time,
      qa.end_time,
      qa.submitted,
      qa.total_score,
      qa.percentage
   FROM quiz_attempt qa
   JOIN quiz q ON qa.quiz_id = q.id
   WHERE qa.quiz_id = ? AND qa.user_id = ?`,
      [quizId, studentId],
    );

    if (!attempt)
      throw new Error("No attempt found for this quiz by the student");

    // 3️⃣ Fetch all categories in this quiz
    const [categories] = await conn.query(
      `SELECT DISTINCT c.id, c.name
       FROM quiz_question_config qc
       JOIN question_category c ON qc.category_id = c.id
       WHERE qc.quiz_id = ?`,
      [quizId],
    );

    // 4️⃣ Fetch per-category performance
    // 4️⃣ Fetch per-category performance ✅ FIXED
    const [categoryResults] = await conn.query(
      `SELECT category_id, total_questions, correct_answers, percentage
   FROM quiz_section_result
   WHERE attempt_id = ?`,
      [attempt.attempt_id], // ✅ CORRECT
    );

    // 5️⃣ Map categories with results
    const categoryReport = categories.map((cat) => {
      const result = categoryResults.find((r) => r.category_id === cat.id);
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        totalQuestions: result?.total_questions || 0,
        correctAnswers: result?.correct_answers || 0,
        percentage: result?.percentage || 0,
      };
    });

    return {
      student: {
        id: student.id,
        name: student.name,
        department: student.department,
      },
      quiz: {
        id: attempt.quiz_id,
        title: attempt.quiz_title,
        startTime: attempt.start_time,
        endTime: attempt.end_time,
        submitted: attempt.submitted,
        totalScore: attempt.total_score,
        overallPercentage: attempt.percentage,
      },
      categories: categoryReport,
    };
  } finally {
    conn.release();
  }
};

export const getAllStudentsQuizReport = async (quizId) => {
  const conn = await db.getConnection();

  try {
    // 1️⃣ Fetch quiz info
    const [[quiz]] = await conn.query(
      `SELECT id, title FROM quiz WHERE id = ?`,
      [quizId],
    );

    if (!quiz) throw new Error("Quiz not found");

    // 2️⃣ Fetch all student attempts for this quiz
    const [attempts] = await conn.query(
      `SELECT 
          u.id AS student_id,
          u.name AS student_name,
          d.name AS department,
          qa.start_time,
          qa.end_time,
          qa.submitted,
          qa.total_score,
          qa.percentage
       FROM quiz_attempt qa
       JOIN users u ON qa.user_id = u.id
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE qa.quiz_id = ?
       ORDER BY qa.end_time DESC`,
      [quizId],
    );

    // 3️⃣ Format response
    const students = attempts.map((a) => ({
      studentId: a.student_id,
      studentName: a.student_name,
      department: a.department,
      startTime: a.start_time,
      endTime: a.end_time,
      submitted: a.submitted,
      totalScore: a.total_score,
      percentage: a.percentage,
    }));

    return {
      quiz: {
        id: quiz.id,
        title: quiz.title,
      },
      totalStudents: students.length,
      students,
    };
  } finally {
    conn.release();
  }
};

export const getAllQuizzes = async () => {
  const sql = `
    SELECT 
      q.id AS quiz_id,
      q.title,
      q.quiz_code,
      q.duration_minutes,
      q.total_questions,

      qc.category_id,
      qc.question_count,

      c.name AS category_name
    FROM quiz q
    LEFT JOIN quiz_question_config qc ON q.id = qc.quiz_id
    LEFT JOIN question_category c ON qc.category_id = c.id
    ORDER BY q.id
  `;

  const [rows] = await db.query(sql);

  const quizMap = new Map();

  for (const row of rows) {
    if (!quizMap.has(row.quiz_id)) {
      quizMap.set(row.quiz_id, {
        id: row.quiz_id,
        title: row.title,
        quiz_code: row.quiz_code,
        duration: `${row.duration_minutes} min`,
        totalQuestions: row.total_questions,
        categories: new Map(),
      });
    }

    if (row.category_id) {
      quizMap.get(row.quiz_id).categories.set(row.category_id, {
        id: row.category_id,
        name: row.category_name,
        question_count: row.question_count,
      });
    }
  }

  // Convert Maps → Arrays
  return Array.from(quizMap.values()).map((quiz) => ({
    ...quiz,
    categories: Array.from(quiz.categories.values()),
  }));
};
