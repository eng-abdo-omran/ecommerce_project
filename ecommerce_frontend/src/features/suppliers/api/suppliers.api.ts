import { http } from "../../../api/axios";
import type { SuppliersListResponse, Supplier } from "../types";

export type SuppliersQuery = {
  page?: number;
  search?: string;
  perPage?: number;
};

export type SupplierPayload = Partial<Supplier> & {
  full_name: string;
};

export async function getSuppliers(params: SuppliersQuery) {
  const { data } = await http.get<SuppliersListResponse>("/dashboard/suppliers", { params });
  return data;
}

export async function createSupplier(payload: SupplierPayload) {
  const { data } = await http.post("/dashboard/suppliers", payload);
  return data;
}

export async function updateSupplier(id: number, payload: SupplierPayload) {
  const { data } = await http.put(`/dashboard/suppliers/${id}`, payload);
  return data;
}

export async function deleteSupplier(id: number) {
  const { data } = await http.delete(`/dashboard/suppliers/${id}`);
  return data;
}