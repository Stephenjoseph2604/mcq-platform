import express from "express";
import { bulkCreateQuestions, deleteQuestion, getQuestionById, updateQuestion } from "./question.controller.js";
import { getCategoriesWithQuestionCount, getQuestionsByCategory } from "./question.controller.js";

const router = express.Router();

// 🔐 add admin middleware later
router.post("/bulk", bulkCreateQuestions);
router.get("/categories/count", getCategoriesWithQuestionCount);
router.get("/category/:categoryId", getQuestionsByCategory);


router.delete("/:id", deleteQuestion);

router.put("/:id", updateQuestion);

router.get("/:id", getQuestionById);

export default router; 
