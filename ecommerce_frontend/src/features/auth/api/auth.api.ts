import { http } from "../../../api/axios";

export type LoginPayload = { email: string; password: string };

export type LoginResponse = {
  message: string;
  token: string;
  role: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    role: number;
  };
};

export async function login(payload: LoginPayload) {
  const { data } = await http.post<LoginResponse>("/login", payload);
  return data;
}