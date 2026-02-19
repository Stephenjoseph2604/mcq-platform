import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import departmentRoutes from "./modules/department/department.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import questionRoutes from "./modules/question/question.routes.js";
import attemptRoutes from "./modules/attempt/attempt.routes.js";
import quizRoutes from "./modules/quiz/quiz.routes.js";
import studentRoutes from "./modules/student/student.routes.js";
import cors from "./config/cors.js";
const app = express();
app.use(cors);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/attempt", attemptRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the MCQ Platform API");
});

export default app;
