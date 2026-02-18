import * as quizService from "./quiz.service.js";
import { success, error } from "../../utils/response.js";

export const createQuiz = async (req, res) => {
  try {
    const quizId = await quizService.createQuiz(req.body);
    return success(res, "Quiz created successfully", { quizId });
  } catch (err) {
    console.error(err);
    return error(res, err.message || "Quiz creation failed");
  }
};


export const updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    await quizService.updateQuiz(quizId, req.body);
    return success(res, "Quiz updated successfully");
  } catch (err) {
    console.error(err);
    return error(res, err.message || "Quiz update failed");
  }
};


export const startQuiz = async (req, res) => {
  try {
    const { quizId, userId } = req.params;
    const questions = await quizService.startQuizForStudent(quizId, userId);
    return success(res, "Quiz started successfully", questions); 
  } catch (err) {
    console.error(err);
    return error(res, err.message || "Failed to start quiz");
  }
};


export const submitQuiz = async (req, res) => {
  try {
    const { attempt_id, answers } = req.body;

    if (!attempt_id || !answers || !answers.length) {
      // Pass res as first argument
      return error(res, "attempt_id and answers are required");
    }

    const result = await quizService.submitQuizForStudent(attempt_id, answers);

    // Pass res as first argument
    return success(res, "Quiz submitted successfully", result);
  } catch (err) {
    console.error(err);
    return error(res, err.message); // Again, pass res
  }
};


export const studentQuizReport = async (req, res) => {
  try {
    const { quizId, studentId } = req.params;

    if (!quizId || !studentId) {
      return error(res, "quizId and studentId are required");
    }

    const report = await quizService.getStudentQuizReport(quizId, studentId);
    return success(res, "Student quiz report fetched successfully", report);
  } catch (err) {
    console.error(err);
    return error(res, err.message);
  }
};