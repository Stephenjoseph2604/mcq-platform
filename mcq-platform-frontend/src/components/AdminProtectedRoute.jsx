import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdmin, isAdminAuthenticated } from '../utils/auth';


const AdminProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminToken = isAdminAuthenticated();
      const admin = getAdmin();
      
      // Check if admin token exists AND role is SUPER_ADMIN or ADMIN
      if (adminToken && admin) {
        const isSuperAdmin = admin.role === 'SUPER_ADMIN';
        const isAdminRole = admin.role === 'ADMIN';
        
        if (isSuperAdmin || isAdminRole) {
          console.log(`✅ ${admin.role} authorized:`, admin.name);
          setIsAuthorized(true);
        } else {
          console.log('❌ Insufficient admin role:', admin.role);
        }
      } else {
        console.log('❌ No admin token found');
      }
      
      setIsLoading(false);
    };

    checkAdminAuth();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // Not authorized - redirect to admin login
  if (!isAuthorized) {
    console.log('🔒 Redirecting to admin login');
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // Authorized - render children
  return children;
};

export default AdminProtectedRoute;
