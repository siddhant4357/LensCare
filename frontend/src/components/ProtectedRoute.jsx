import { Navigate } from 'react-router-dom';
import { isAdmin, getCurrentUser } from '../services/authService';

export const ProtectedRoute = ({ children }) => {
  if (!getCurrentUser()) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export const AdminRoute = ({ children }) => {
  if (!getCurrentUser()) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin()) {
    // User is logged in but not an admin, redirect to home
    return <Navigate to="/" replace />;
  }
  
  return children;
};