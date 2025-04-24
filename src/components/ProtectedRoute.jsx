import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // If user exists, allow access to the route
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
