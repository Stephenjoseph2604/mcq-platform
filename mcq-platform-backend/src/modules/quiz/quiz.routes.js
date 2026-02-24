import express from "express";

import { createQuiz, updateQuiz,startQuiz,submitQuiz,studentQuizReport ,allStudentsQuizReport, getAllQuizList, getAllQuizzesWithSubmissions, deleteQuizSubmissionReport, getQuizFullSubmissionReport} from "./quiz.controller.js";

import { adminOnly } from "../../middlewares/admin.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { superAdminOnly } from "../../middlewares/superAdmin.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, adminOnly, createQuiz);
router.put("/:quizId", authMiddleware, adminOnly, updateQuiz);
router.get("/",authMiddleware, getAllQuizList);
router.get("/:quizId/student/:userId/start",authMiddleware, startQuiz);

router.post("/submit",authMiddleware, submitQuiz);

router.get("/quizzes",authMiddleware, adminOnly, getAllQuizzesWithSubmissions);

router.get("/report/:quizId",authMiddleware, adminOnly, allStudentsQuizReport);
router.get("/report/full/:quizId",authMiddleware, adminOnly, getQuizFullSubmissionReport);

router.get("/report/:quizId/:studentId",authMiddleware, adminOnly, studentQuizReport); 

// DELETE submission report by attemptId
router.delete("/report/:quizId/:userId",authMiddleware, superAdminOnly, deleteQuizSubmissionReport);

 


export default router;
