import { http } from "../../../api/axios";
import type { UsersListResponse, User } from "../types";

export type UsersQuery = {
  page?: number;
  search?: string; // لو الباك داعم search
};

export async function getUsers(params: UsersQuery) {
  const { data } = await http.get<UsersListResponse>("/dashboard/users", { params });
  return data;
}

export async function createUser(payload: Partial<User> & { password?: string }) {
  const { data } = await http.post("/dashboard/users", payload);
  return data;
}

export async function updateUser(id: number, payload: Partial<User>) {
  const { data } = await http.put(`/dashboard/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: number) {
  const { data } = await http.delete(`/dashboard/users/${id}`);
  return data;
}