import express from "express";
import { getAllStudents ,getStudentById,deleteStudent} from "./student.controller.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { superAdminOnly } from "../../middlewares/superAdmin.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
const router = express.Router(); 
 
router.get("/",authMiddleware,adminOnly, getAllStudents);
router.get("/:id",authMiddleware, adminOnly, getStudentById);
router.delete("/:id", authMiddleware, superAdminOnly, deleteStudent);

export default router;
