import express from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from "./department.controller.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { superAdminOnly } from "../../middlewares/superAdmin.middleware.js";
const router = express.Router();

// 🔐 add admin middleware later
router.post("/",authMiddleware, adminOnly, createDepartment);
router.get("/",  getDepartments);
router.get("/:id", authMiddleware, adminOnly, getDepartmentById);
router.put("/:id", authMiddleware, adminOnly, updateDepartment);
router.delete("/:id", authMiddleware, superAdminOnly, deleteDepartment);

export default router;
