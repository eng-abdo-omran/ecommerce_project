/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const location = useLocation();
  const returnTo = (location.state as any)?.returnTo || "/";
  const sp = new URLSearchParams();
  sp.set("mode", "login");
  sp.set("returnTo", returnTo);
  return <Navigate to={`/auth?${sp.toString()}`} replace />;
}