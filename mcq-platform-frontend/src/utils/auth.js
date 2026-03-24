// // Check if user is authenticated
// export const isAuthenticated = () => {
//   const token = localStorage.getItem('mcqtoken');
//   return !!token; // Returns true if token exists
// };

// // Get user data
// export const getUser = () => {
//   const user = localStorage.getItem('mcquser');
//   return user ? JSON.parse(user) : null;
// };

// // Logout function
// export const logout = () => {
//   localStorage.removeItem('mcqtoken');
//   localStorage.removeItem('mcquser');
//   window.location.href = '/login';
// };

// // Get token for API headers
// export const getToken = () => {
//   return localStorage.getItem('mcqtoken');
// };

// //  Check if admin is authenticated
// export const isAdminAuthenticated = () => {
//   const token = localStorage.getItem('mcqadmintoken');
//   return !!token;
// };

// //  Get admin data
// export const getAdmin = () => {
//   const admin = localStorage.getItem('mcqadmin');
//   return admin ? JSON.parse(admin) : null;
// };

// //  Admin logout function
// export const adminLogout = () => {
//   localStorage.removeItem('mcqadmintoken');
//   localStorage.removeItem('mcqadmin');
//   window.location.href = '/admin/login';
// };

// // : Get admin token for API headers
// export const getAdminToken = () => {
//   return localStorage.getItem('mcqadmintoken');
// };

// // Check if either student OR admin is logged in
// export const isAnyAuthenticated = () => {
//   return isAuthenticated() || isAdminAuthenticated();
// };

// //  Get current user type
// export const getUserType = () => {
//   if (isAdminAuthenticated()) return 'admin';
//   if (isAuthenticated()) return 'student';
//   return null;
// };



// utils/auth.js

// 🔐 Storage Keys (centralized)
const TOKEN_KEY = "crmusertoken123";
const USER_KEY = "crmuserdata123";

// ================= BASIC =================

// Check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return !!token;
};

// Get token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get user object
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// ================= ROLE =================

// Get role (STUDENT / SUPER_ADMIN)
export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

// Check role
export const isAdmin = () => {
  return getUserRole() === "SUPER_ADMIN";
};

export const isStudent = () => {
  return getUserRole() === "STUDENT";
};

// ================= LOGOUT =================

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  // 🔥 Role-based redirect
  const role = getUserRole();

  if (role === "SUPER_ADMIN") {
    window.location.href = "/admin/login";
  } else {
    window.location.href = "/login";
  }
};

// ================= GLOBAL CHECK =================

// Check if any user logged in
export const isAnyAuthenticated = () => {
  return isAuthenticated();
};
