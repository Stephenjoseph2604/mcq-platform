// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('mcqtoken');
  return !!token; // Returns true if token exists
};

// Get user data
export const getUser = () => {
  const user = localStorage.getItem('mcquser');
  return user ? JSON.parse(user) : null;
};

// Logout function
export const logout = () => {
  localStorage.removeItem('mcqtoken');
  localStorage.removeItem('mcquser');
  window.location.href = '/login';
};

// Get token for API headers
export const getToken = () => {
  return localStorage.getItem('mcqtoken');
};
