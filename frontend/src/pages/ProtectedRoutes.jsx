import React from 'react'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoutes = () => {
    const token = localStorage.getItem("token");
    return token ? <Outlet /> : <Navigate to="/login" replace />;
  
}

export default ProtectedRoutes