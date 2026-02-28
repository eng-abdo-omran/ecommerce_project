import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

function buildAuthUrl(mode: "login" | "register", returnTo: string) {
  const sp = new URLSearchParams();
  sp.set("mode", mode);
  sp.set("returnTo", returnTo);
  return `/auth?${sp.toString()}`;
}

export function RequireAuth() {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  // اليوسر كان رايح صافحة اتطلب منه يسجل دخول بعد مبيسجل دخول ترجعه تاني الصفحة الي كان عايز يروحها
  if (!token) {
    const returnTo = location.pathname + location.search;
    return <Navigate to={buildAuthUrl("login", returnTo)} replace />;
  }
  return <Outlet />;
}

export function RequireAdmin() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const location = useLocation();

  if (!token) {
    const returnTo = location.pathname + location.search;
    return <Navigate to={buildAuthUrl("login", returnTo)} replace />;
  }

  if (role !== 1) {
    // user عادي حاول يدخل admin
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function RequireUser() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const location = useLocation();

  if (!token) {
    const returnTo = location.pathname + location.search;
    return <Navigate to={buildAuthUrl("login", returnTo)} replace />;
  }

  // admin مايدخلش user area
  if (role === 1) return <Navigate to="/admin" replace />;

  return <Outlet />;
}