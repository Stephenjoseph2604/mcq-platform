import express from "express";
import { bulkCreateQuestions } from "./question.controller.js";
import { getCategoriesWithQuestionCount, getQuestionsByCategory } from "./question.controller.js";

const router = express.Router();

// 🔐 add admin middleware later
router.post("/bulk", bulkCreateQuestions);
router.get("/categories/count", getCategoriesWithQuestionCount);
router.get("/category/:categoryId", getQuestionsByCategory);
export default router;
