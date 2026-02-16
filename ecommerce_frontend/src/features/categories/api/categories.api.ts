import { http } from "../../../api/axios";
import type { CategoriesListResponse } from "../types";

export type CategoriesQuery = {
  page?: number;
  search?: string;
};

export type CategoryPayload = {
  name: string;
  slug: string;
  note?: string | null;
  category_id?: number | null;
  image?: File | null;
};

function toFormData(payload: CategoryPayload) {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("slug", payload.slug);

  if (payload.note !== undefined) fd.append("note", payload.note ?? "");
  if (payload.category_id !== undefined && payload.category_id !== null) {
    fd.append("category_id", String(payload.category_id));
  }
  if (payload.image instanceof File) fd.append("image", payload.image); // ✅

  return fd;
}

export async function getCategories(params: CategoriesQuery) {
  const { data } = await http.get<CategoriesListResponse>("/dashboard/categories", { params });
  return data;
}

export async function createCategory(payload: CategoryPayload) {
  const fd = toFormData(payload);

  const { data } = await http.post("/dashboard/categories", fd, {
    headers: { "Content-Type": "multipart/form-data" }, // ✅ override JSON default
  });

  return data;
}

export async function updateCategory(id: number, payload: CategoryPayload) {
  // ✅ method override for multipart update
  const fd = toFormData(payload);
  fd.append("_method", "PUT");

  const { data } = await http.post(`/dashboard/categories/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

export async function deleteCategory(id: number) {
  const { data } = await http.delete(`/dashboard/categories/${id}`);
  return data;
}