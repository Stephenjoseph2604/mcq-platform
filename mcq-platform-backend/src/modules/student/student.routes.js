import express from "express";
import { getAllStudents ,getStudentById,deleteStudent} from "./student.controller.js";


const router = express.Router(); 
 
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.delete("/:id", deleteStudent);

export default router;
