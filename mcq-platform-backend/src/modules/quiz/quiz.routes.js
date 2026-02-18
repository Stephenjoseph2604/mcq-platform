import express from "express";

import { createQuiz, updateQuiz,startQuiz,submitQuiz,studentQuizReport } from "./quiz.controller.js";


const router = express.Router();

router.post("/", createQuiz);
router.put("/:quizId", updateQuiz);

router.get("/:quizId/student/:userId/start", startQuiz);

router.post("/submit", submitQuiz);

router.get("/report/:quizId/:studentId", studentQuizReport); 
export default router;
