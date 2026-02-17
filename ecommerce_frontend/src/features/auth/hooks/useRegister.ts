/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { register, login } from "../api/auth.api";
import type { RegisterPayload } from "../api/auth.api";
import { useAuthStore } from "../../../store/auth.store";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      // 1) Register (بيرجع user فقط)
      await register(payload);

      // 2) Auto-login علشان ناخد token/role/user
      const res = await login({ email: payload.email, password: payload.password });

      setAuth({ token: res.token, role: res.role ?? 0, user: res.user as any });
      return res;
    },
    onSuccess: (res) => toast.success(res.message || "تم إنشاء الحساب وتسجيل الدخول ✅"),
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}