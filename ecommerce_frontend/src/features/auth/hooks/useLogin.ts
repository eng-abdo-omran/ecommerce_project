import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { login } from "../api/auth.api";
import type { LoginPayload } from "../api/auth.api"; // ✅ مهم: type-only import
import { useAuthStore } from "../../../store/auth.store";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await login(payload);

      setAuth({
        token: res.token,
        role: res.role,
        user: res.user,
      });

      return res;
    },
    onSuccess: (res) => toast.success(res.message || "تم تسجيل الدخول بنجاح"),
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}