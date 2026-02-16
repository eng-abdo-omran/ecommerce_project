import { http } from "../../../api/axios";
import type { CustomersListResponse } from "../types";

export type CustomersQuery = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type CustomerPayload = {
  full_name: string;
  phone: string;
  alternate_phone?: string | null;
  country: string;
  address: string;
  note?: string | null;
  user_id?: number | null; // optional
};

export async function getCustomers(params: CustomersQuery) {
  const { data } = await http.get<CustomersListResponse>("/dashboard/customers", { params });
  return data;
}

export async function createCustomer(payload: CustomerPayload) {
  const { data } = await http.post("/dashboard/customers", payload);
  return data;
}

export async function updateCustomer(id: number, payload: CustomerPayload) {
  const { data } = await http.put(`/dashboard/customers/${id}`, payload);
  return data;
}

export async function deleteCustomer(id: number) {
  const { data } = await http.delete(`/dashboard/customers/${id}`);
  return data;
}