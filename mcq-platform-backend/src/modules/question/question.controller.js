import pool from "../../config/db.js";
import { success, error } from "../../utils/response.js";
import * as questionService from "./question.service.js";
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
      [category_id],
    );

    if (!category) {
      return error(res, "Invalid category_id");
    }

    // 3️⃣ Technical category rule
    if (category.name === "Technical" && !department_id) {
      return error(res, "department_id is required for Technical category");
    }

    if (category.name !== "Technical" && department_id) {
      return error(
        res,
        "department_id must be null for non-technical categories",
      );
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
    const count = await questionService.bulkCreateQuestionsService({
      category_id,
      department_id: category.name === "Technical" ? department_id : null,
      questions,
    });

    return success(res, "Questions inserted", {
      inserted: count,
    });
  } catch (err) {
    console.error(err);
    return error(res, "Failed to insert questions");
  }
};

export const getCategoriesWithQuestionCount = async (req, res) => {
  try {
    console.log("Fetching categories with question count...");
    const data = await questionService.getCategoriesWithQuestionCount();
    return success(res, "Categories fetched successfully", data);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getQuestionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // department_id is OPTIONAL
    const departmentId = req.query?.department_id;
    console.log(departmentId)
    const data = await questionService.getQuestionsByCategory(
      categoryId,
      departmentId,
    );

    return success(res, "Questions fetched successfully", data);
  } catch (err) {
    return error(res, err.message);
  }
};



// controllers/question.controller.js
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await questionService.deleteQuestionById(id);

    if (!deleted) {
      return error(res, "Question not found");
    }

    return success(res, "Question deleted successfully");
  } catch (err) {
    return error(res, err.message);
  }
};



export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await questionService.updateQuestionById(id, req.body);

    if (!updated) {
      return error(res, "Question not found or no changes made");
    }

    return success(res, "Question updated successfully");
  } catch (err) {
    return error(res, err.message);
  }
};


export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await questionService.getQuestionById(id);

    if (!question) {
      return error(res, "Question not found");
    }

    return success(res, "Question fetched successfully", question);
  } catch (err) {
    return error(res, err.message);
  }
};