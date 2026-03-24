import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();

  const isAuth = isAuthenticated();
  const role = getUserRole();

  // 🔥 Not logged in → go to admin login
  if (!isAuth) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // 🔥 Logged in but NOT admin → block access
  if (role !== "SUPER_ADMIN") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // ✅ Authorized
  return children;
};

export default AdminProtectedRoute;