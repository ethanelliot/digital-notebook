import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context"; // Import your useAuth hook

const ProtectedRoute: React.FC = () => {
  const { authUser, loading } = useAuth();

  if (loading) {
    // Todo: Loading
    return <div>Loading authentication status...</div>;
  }

  return authUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
