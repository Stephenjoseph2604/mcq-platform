import express from "express";
import { bulkCreateQuestions, deleteQuestion, getQuestionById, updateQuestion } from "./question.controller.js";
import { getCategoriesWithQuestionCount, getQuestionsByCategory } from "./question.controller.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { superAdminOnly } from "../../middlewares/superAdmin.middleware.js";
const router = express.Router();

// 🔐 add admin middleware later
router.post("/bulk",authMiddleware, adminOnly, bulkCreateQuestions);
router.get("/categories/count", authMiddleware, adminOnly, getCategoriesWithQuestionCount);
router.get("/category/:categoryId",authMiddleware, adminOnly, getQuestionsByCategory);


router.delete("/:id", authMiddleware, superAdminOnly, deleteQuestion);

router.put("/:id", authMiddleware, adminOnly, updateQuestion);

router.get("/:id",authMiddleware, adminOnly, getQuestionById);

export default router; 
