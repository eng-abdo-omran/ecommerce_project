import { create } from "zustand";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: number; // عندك 1 = admin (حسب الباك)
};

type AuthState = {
  token: string | null;
  role: number | null;
  user: AuthUser | null;

  setAuth: (payload: { token: string; role: number; user: AuthUser }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role") ? Number(localStorage.getItem("role")) : null,
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,

  setAuth: ({ token, role, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", String(role));
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, role, user });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    set({ token: null, role: null, user: null });
  },
}));