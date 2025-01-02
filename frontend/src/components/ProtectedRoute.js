import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTable } from '../context/TableContext';

const ProtectedRoute = ({ children }) => {
  const { sessionData } = useTable();
  const location = useLocation();

  if (!sessionData?.sessionId) {
    // Redirect to QR page if no session exists
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 