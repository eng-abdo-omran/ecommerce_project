import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export function RequireAuth() {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RequireAdmin() {
  const role = useAuthStore((s) => s.role);
  if (role !== 1) return <Navigate to="/login" replace />;
  return <Outlet />;
}