import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const auth = isAuthenticated();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children; // ✅ Directly renders the child component
};

export default ProtectedRoute;
