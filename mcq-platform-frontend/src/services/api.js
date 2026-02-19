import axios from "axios";

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
};

export const departmentAPI = {
  getDepartments: () => api.get("/departments"),
};

export const quizAPI = {
  getQuizzes: () => api.get('/quiz/'),
};

export default api;
