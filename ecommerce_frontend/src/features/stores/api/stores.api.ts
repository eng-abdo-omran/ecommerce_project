import { http } from "../../../api/axios";
import type { StoresListResponse } from "../types";

export type StoresQuery = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type StorePayload = {
  name: string;
  domain: string;
  tech_stack?: string[] | null;
};

export async function getStores(params: StoresQuery) {
  const { data } = await http.get<StoresListResponse>("/dashboard/stores", { params });
  return data;
}

export async function createStore(payload: StorePayload) {
  const { data } = await http.post("/dashboard/stores", payload);
  return data;
}

export async function updateStore(id: number, payload: StorePayload) {
  const { data } = await http.put(`/dashboard/stores/${id}`, payload);
  return data;
}

export async function deleteStore(id: number) {
  const { data } = await http.delete(`/dashboard/stores/${id}`);
  return data;
}
