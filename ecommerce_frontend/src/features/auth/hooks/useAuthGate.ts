import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/auth.store";

export function useAuthGate() {
  const nav = useNavigate();
  const location = useLocation();
  const token = useAuthStore((s) => s.token);

  return function requireAuth(action?: () => void) {
    if (token) return action?.();

    const returnTo = location.pathname + location.search;
    const sp = new URLSearchParams();
    sp.set("mode", "login");
    sp.set("returnTo", returnTo);
    nav(`/auth?${sp.toString()}`, { replace: true });
  };
}