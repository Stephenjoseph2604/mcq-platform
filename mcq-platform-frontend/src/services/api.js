import axios from "axios";
import {  getToken,logout } from "../utils/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Attach token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid / expired
      logout();
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  sendOTP: (email) => api.post("/auth/send-otp", { email }),
  verifyOTPRegister: (data) => api.post("/auth/verify-otp-register", data),
  login: (credentials) => api.post("/auth/login", credentials),

  adminLogin: (credentials) => api.post("/auth/admin/login", credentials), // ✅

  // Admin registration APIs
  adminSendOtp: (emailData) => api.post("/auth/admin/send-otp", emailData),
  adminVerifyOtp: (registerData) =>
    api.post("/auth/admin/verify-otp", registerData),
};

export const studentAPI = {
  // Get all students
  getAll: () =>
    api.get("/students/"),
  // Delete student (implement this endpoint in backend)
  delete: (id) =>
    api.delete(`/students/${id}`),
};

export const departmentAPI = {
  // Get all departments
  getAll: () =>
    api.get("/departments"),
  // Create new department
  create: (code, name) =>
    api.post(
      "/departments",
      { code, name }
    ),
  // Update department
  update: (id, code, name) =>
    api.put(
      `/departments/${id}`,
      { code, name }
      
    ),
  // Delete department
  delete: (id) =>
    api.delete(`/departments/${id}`),
};

export const quizAPI = {
  getQuizzes: () =>
    api.get("/quiz"),
  getCategories: () =>
    api.get("/categories"),
  createQuiz: (data) =>
    api.post("/quiz/", data),
  deleteQuiz: (quizId) =>
    api.delete(`/quiz/${quizId}`),
  updateQuiz: (quizId, data) =>
    api.put(`/quiz/${quizId}`, data),
  startQuiz: (quizId, studentId) => {
    const token = getToken();
    return api.get(`/quiz/${quizId}/student/${studentId}/start`);
  },
  // ✅ NEW: Submit quiz endpoint
  submitQuiz: (submitData) => {
    const token = getToken();
    return api.post("/quiz/submit", submitData);
  },
};

export const adminAPI = {
  getMeta: () => {
    return api.get("/auth/admin/meta");
  },
  getPendingAdminRequests: () =>
    api.get("/auth/admin/admin-requests/pending"),
  getAdminRequestHistory: () =>
    api.get("/auth/admin/admin-requests"),
  acceptAdminRequest: (id) =>
    api.post(
      `/auth/admin/approve/${id}`,
      {}
    ),
  rejectAdminRequest: (id) =>
    api.post(
      `/auth/admin/reject/${id}`,
      {}
    ),
  deleteAdminRequest: (id) =>
    api.delete(`/auth/admin/requests/${id}`),

  getEmployees: () =>
    api.get("/auth/admin/all"),
  activateEmployee: (id) => api.patch(`/auth/admin/activate/${id}`, {}),
  deactivateEmployee: (id) => api.patch(`/auth/admin/deactivate/${id}`, {}),
  deleteEmployee: (id) => api.delete(`/auth/admin/${id}`),
};

export const questionsAPI = {
  // Get categories with counts
  getCategoriesCount: () =>
    api.get("/questions/categories/count"),

  // Bulk upload questions
  bulkUpload: (data) =>
    api.post("/questions/bulk", data),

  // Get questions by category (with optional department_id in body)
  getQuestionsByCategory: (categoryId, departmentId = null) => {
    const config = {
      params: { category_id: categoryId },
    };

    // For technical category, send department_id in body

    return api.get(`/questions/category/${categoryId}`, {
      params: { department_id: departmentId },
      
    });
  },
  // NEW: Update question (PATCH with partial fields)
  updateQuestion: (questionId, updatedFields) =>
    api.put(`/questions/${questionId}`, updatedFields ),

  // NEW: Delete question
  deleteQuestion: (questionId) =>
    api.delete(`/questions/${questionId}`),
  // Bulk load questions (you'll need this endpoint later)
  bulkLoadQuestions: (data) =>
    api.post("/questions/bulk-load", data),
};

export const reportAPI = {
  // Get all quizzes
  getQuizzes: () =>
    api.get("/quiz/quizzes"),
  // Add other report endpoints as needed
  getQuizReport: (quizId) =>
    api.get(`/quiz/report/full/${quizId}`),
  deleteSubmission: (quizId, studentId) =>
    api.delete(`/quiz/report/${quizId}/${studentId}`),
  getStudentReport: (quizId, studentId) =>
    api.get(`/quiz/report/full/${quizId}/${studentId}`),
};

export const categoriesAPI = {
  // Get all categories
  getAll: () =>
    api.get("/categories/"),
  // Create new category
  create: (name) =>
    api.post(
      "/categories/",
      { name },
      
    ),
  // Update category
  update: (id, name) =>
    api.put(
      `/categories/${id}`,
      { name },
      
    ),
  // Delete category
  delete: (id) =>
    api.delete(`/categories/${id}`),
};

export default api;
