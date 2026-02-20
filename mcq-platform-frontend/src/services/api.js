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
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export const authAPI = {
  sendOTP: (email) => api.post("/auth/send-otp", { email }),
  verifyOTPRegister: (data) => api.post("/auth/verify-otp-register", data),
  login: (credentials) => api.post("/auth/login", credentials),
  adminLogin: (credentials) => api.post("/auth/admin/login", credentials), // ✅
};

export const departmentAPI = {
  getDepartments: () => api.get("/departments"),
};

export const quizAPI = {
  getQuizzes: () => api.get("/quiz/"),
  getCategories: () =>
    api.get("/categories", {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
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
  getCategoriesCount: () => api.get("/questions/categories/count"),
  
  // Get questions by category (with optional department_id in body)
  getQuestionsByCategory: (categoryId, departmentId = null) => {
    const config = {
      params: { category_id: categoryId }
    };
    
    // For technical category, send department_id in body
    if (departmentId) {
      config.data = { department_id: departmentId };
    }
    
    return api.post("/questions/category/" + categoryId, config.data || {});
  },
  
  // Bulk load questions (you'll need this endpoint later)
  bulkLoadQuestions: (data) => api.post("/questions/bulk-load", data),
};

export default api;
