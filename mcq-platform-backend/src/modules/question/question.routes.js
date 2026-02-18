import express from "express";
import { bulkCreateQuestions } from "./question.controller.js";

const router = express.Router();

// 🔐 add admin middleware later
router.post("/bulk", bulkCreateQuestions);

export default router;
