import { http } from "../../../api/axios";

// LOGIN
export type LoginPayload = { email: string; password: string };

export type LoginResponse = {
  message: string;
  token: string;
  role: number | null;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    role: number | null;
  };
};

export async function login(payload: LoginPayload) {
  const { data } = await http.post<LoginResponse>("/login", payload);
  return data;
}

// REGISTER (حسب AuthController بتاعك)
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string; // required بسبب confirmed
  phone?: string | null;
  address?: string | null;
};

// register response عندك: message + user فقط (بدون token/role)
export type RegisterResponse = {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    role?: number | null;
  };
};

export async function register(payload: RegisterPayload) {
  const { data } = await http.post<RegisterResponse>("/register", payload);
  return data;
}