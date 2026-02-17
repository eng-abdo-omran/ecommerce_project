/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "../../../api/axios";

// ===== ME =====
export type MeResponse = { status: boolean; message?: string; data: any };
export async function getMe() {
  const { data } = await http.get<MeResponse>("/me");
  return data;
}

export type UpdateMePayload = { name?: string; phone?: string | null; address?: string | null };
export async function updateMe(payload: UpdateMePayload) {
  const { data } = await http.patch<MeResponse>("/me", payload);
  return data;
}

// ===== ADDRESSES =====
export type Address = { id: number; label: string; city: string; street: string; notes?: string | null };
export async function getAddresses() {
  const { data } = await http.get<Address[]>("/addresses");
  return data;
}
export async function createAddress(payload: Omit<Address, "id">) {
  const { data } = await http.post("/addresses", payload);
  return data;
}
export async function updateAddress(id: number, payload: Partial<Omit<Address, "id">>) {
  const { data } = await http.patch(`/addresses/${id}`, payload);
  return data;
}
export async function deleteAddress(id: number) {
  const { data } = await http.delete(`/addresses/${id}`);
  return data;
}

// ===== MY ORDERS (Pagination) =====
export async function getMyOrders(params: { page?: number; perPage?: number } = {}) {
  const { data } = await http.get("/my/orders", { params });
  return data; // {status,message,data: paginator}
}
export async function getMyOrderById(id: number) {
  const { data } = await http.get(`/my/orders/${id}`);
  return data;
}