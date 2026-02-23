import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "./category.controller.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { superAdminOnly } from "../../middlewares/superAdmin.middleware.js";
const router = express.Router();

// 🔐 add admin middleware later
router.post("/",authMiddleware, adminOnly, createCategory);
router.get("/",authMiddleware, getCategories);
router.get("/:id",authMiddleware, adminOnly, getCategoryById);
router.put("/:id", authMiddleware, adminOnly, updateCategory);
router.delete("/:id",authMiddleware, superAdminOnly, deleteCategory);

export default router;
