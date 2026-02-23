import axios from "axios";
import { getAdminToken, getToken } from "../utils/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth token (if needed later)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {

    return Promise.reject(error);
  },
);

export const authAPI = {
  sendOTP: (email) => api.post("/auth/send-otp", { email }),
  verifyOTPRegister: (data) => api.post("/auth/verify-otp-register", data),
  login: (credentials) => api.post("/auth/login", credentials),
  adminLogin: (credentials) => api.post("/auth/admin/login", credentials), // ✅
};

export const studentAPI = {
  // Get all students
  getAll: () => api.get("/students/", {
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  }),
  // Delete student (implement this endpoint in backend)
  delete: (id) => api.delete(`/students/${id}`, {
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  }),
};

export const departmentAPI = {
  // Get all departments
  getAll: () => api.get("/departments",{
      headers: { Authorization: `Bearer ${getToken()}` },
    }),
  // Create new department
  create: (code, name) => api.post("/departments", { code, name },{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
  // Update department
  update: (id, code, name) => api.put(`/departments/${id}`, { code, name },{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
  // Delete department
  delete: (id) => api.delete(`/departments/${id}`,{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
};

export const quizAPI = {
  getQuizzes: () => api.get("/quiz",{
      headers: { Authorization: `Bearer ${getToken() || getAdminToken()}` },
    }),
  getCategories: () =>
    api.get("/categories", {
      headers: { Authorization: `Bearer ${getToken() || getAdminToken()}` },
    }),
  createQuiz: (data) =>
    api.post("/quiz/", data, {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
  updateQuiz: (quizId, data) =>
    api.put(`/quiz/${quizId}`, data, {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
  startQuiz: (quizId, studentId) => {
    const token = getToken();
    return api.get(`/quiz/${quizId}/student/${studentId}/start`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  // ✅ NEW: Submit quiz endpoint
  submitQuiz: (submitData) => {
    const token = getToken();
    return api.post("/quiz/submit", submitData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  },
};

export const adminAPI = {
  getMeta: () => {
    const token = getAdminToken();
    return api.get("/auth/admin/meta", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const questionsAPI = {
  // Get categories with counts
  getCategoriesCount: () =>
    api.get("/questions/categories/count", {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),

  // Bulk upload questions
  bulkUpload: (data) =>
    api.post("/questions/bulk", data, {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),

  // Get questions by category (with optional department_id in body)
  getQuestionsByCategory: (categoryId, departmentId = null) => {
    const config = {
      params: { category_id: categoryId },
    };
    console.log(departmentId);
    // For technical category, send department_id in body

    return api.get(
      `/questions/category/${categoryId}`,
      {
        params: { department_id: departmentId },
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      },
 
    );
  },
  // NEW: Update question (PATCH with partial fields)
  updateQuestion: (questionId, updatedFields) =>
    api.put(`/questions/${questionId}`, updatedFields,{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),

  // NEW: Delete question
  deleteQuestion: (questionId) => api.delete(`/questions/${questionId}`,{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
  // Bulk load questions (you'll need this endpoint later)
  bulkLoadQuestions: (data) => api.post("/questions/bulk-load", data,{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
};

export const reportAPI = {
  // Get all quizzes
  getQuizzes: () => api.get("/quiz/quizzes",{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
  // Add other report endpoints as needed
  getQuizReport: (quizId) => api.get(`/quiz/report/${quizId}`,{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
  getStudentReport: (quizId, studentId) =>
    api.get(`/quiz/report/${quizId}/${studentId}`,{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
};

export const categoriesAPI = {
  // Get all categories
  getAll: () => api.get("/categories/",{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
  // Create new category
  create: (name) => api.post("/categories/", { name },{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
  // Update category
  update: (id, name) => api.put(`/categories/${id}`, { name },{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
  // Delete category
  delete: (id) => api.delete(`/categories/${id}`,{
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    }),
};

export default api;
