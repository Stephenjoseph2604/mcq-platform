import QuestionService from "./question.service.js";
import pool from "../../config/db.js";
import { success, error } from "../../utils/response.js";

export const bulkCreateQuestions = async (req, res) => {
  try {
    const { category_id, department_id, questions } = req.body;

    // 1️⃣ Basic validation
    if (!category_id || !Array.isArray(questions) || !questions.length) {
      return error(res, "Invalid payload");
    }

    // 2️⃣ Fetch category name
    const [[category]] = await pool.execute(
      "SELECT name FROM question_category WHERE id = ?",
      [category_id]
    );

    if (!category) {
      return error(res, "Invalid category_id");
    }

    // 3️⃣ Technical category rule
    if (category.name === "Technical" && !department_id) {
      return error(res, "department_id is required for Technical category");
    }

    if (category.name !== "Technical" && department_id) {
      return error(res, "department_id must be null for non-technical categories");
    }

    // 4️⃣ Validate each question
    for (const q of questions) {
      if (
        !q.question_text ||
        !q.option_a ||
        !q.option_b ||
        !q.option_c ||
        !q.option_d ||
        !["A", "B", "C", "D"].includes(q.correct_option)
      ) {
        return error(res, "Invalid question format");
      }
    }

    // 5️⃣ Bulk insert
    const count = await QuestionService.bulkCreate({
      category_id,
      department_id: category.name === "Technical" ? department_id : null,
      questions
    });

    return success(res, "Questions inserted", {
      inserted: count
    });
  } catch (err) {
    console.error(err);
    return error(res, "Failed to insert questions");
  }
};
