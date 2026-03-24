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

export const deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
  
    
    await quizService.deleteQuiz(quizId)
    return success(res, "Quiz deleted successfully", { quizId });
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


export const allStudentsQuizReport = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      return error(res, "quizId is required");
    }

    const report = await quizService.getAllStudentsQuizReport(quizId);
    return success(res, "All students quiz report fetched successfully", report);
  } catch (err) {
    console.error(err);
    return error(res, err.message);
  }
};

export const getQuizFullSubmissionReport = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      return error(res, "Quiz ID is required", null, 400);
    }

    // ✅ PASS quizId
    const report = await quizService.getQuizFullSubmissionReport(quizId);

    return success(res, "Full Quiz submission report fetched", report);
  } catch (error) {
    console.error(error);
    return error(res, error.message || "Failed to fetch report");
  }
};

export const getQuizFullSubmissionReportForStudent = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { studentId } = req.params;

    if (!quizId || !studentId) {
      return error(res, "Quiz ID and studentId is required", null, 400);
    }

    // ✅ PASS quizId
    const report = await quizService.getQuizDetailsForStudent(studentId,quizId);

    return success(res, "Full Quiz submission report fetched", report);
  } catch (error) {
    console.error(error);
    return error(res, error.message || "Failed to fetch report");
  }
};

export const getAllQuizList = async (req, res) => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    return success(res, "Quizzes fetched successfully", quizzes);
  } catch (err) {
    console.error(err);
    return error(res, "Failed to fetch quizzes");
  }
};


export const getAllQuizzesWithSubmissions = async (req, res) => {
  try {
    const data = await quizService.getAllQuizzesWithSubmissions();
    return success(res, "Quizzes fetched successfully", data);
  } catch (err) {
    return error(res, err.message);
  }
};





export const deleteQuizSubmissionReport = async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    if (!quizId || !userId) {
      return res.status(400).json({
        message: "Quiz ID and User ID are required",
      });
    }

    await quizService.deleteQuizSubmissionReport(quizId, userId);

    return res.status(200).json({
      message: "Quiz submission report deleted successfully",
    });
  } catch (error) {
    console.error("Delete submission error:", error);
    return res.status(500).json({
      message: error.message || "Failed to delete quiz submission report",
    });
  }
};