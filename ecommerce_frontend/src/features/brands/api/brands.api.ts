import { http } from "../../../api/axios";
import type { BrandsListResponse } from "../types";

export type BrandsQuery = {
  page?: number;
  search?: string;
  perPage?: number;
};

export type BrandPayload = {
  name: string;
  slug: string;
  description?: string | null;
  logo?: File | null; // ✅ file upload
};

function toFormData(payload: BrandPayload) {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("slug", payload.slug);
  if (payload.description !== undefined) fd.append("description", payload.description ?? "");
  if (payload.logo instanceof File) fd.append("logo", payload.logo); // ✅ backend expects logo
  return fd;
}

export async function getBrands(params: BrandsQuery) {
  const { data } = await http.get<BrandsListResponse>("/dashboard/brands", { params });
  return data;
}

export async function createBrand(payload: BrandPayload) {
  const fd = toFormData(payload);
  const { data } = await http.post("/dashboard/brands", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateBrand(id: number, payload: BrandPayload) {
  const fd = toFormData(payload);
  fd.append("_method", "PUT"); // ✅ for multipart update

  const { data } = await http.post(`/dashboard/brands/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteBrand(id: number) {
  const { data } = await http.delete(`/dashboard/brands/${id}`);
  return data;
}