/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "../../../api/axios";

export type InterfaceProductsQuery = {
  page?: number;
  perPage?: number;
  search?: string;

  // Filters
  category?: number;     // هنبعتها كـ category أو category_id حسب الباك
  min?: number;          // min price
  max?: number;          // max price

  // Sorting
  sort?: "latest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
};

export async function getInterfaceProducts(params: InterfaceProductsQuery) {
  // هنحوّل params للباك بشكل مرن
  const apiParams: Record<string, any> = {
    page: params.page,
    perPage: params.perPage,
    search: params.search,
  };

  // فلاتر
  if (params.category) {
    // جرّب شكلين مشهورين (الـbackend قد يقبل واحد منهم)
    apiParams.category = params.category;
    apiParams.category_id = params.category;
  }
  if (typeof params.min === "number") apiParams.min = params.min;
  if (typeof params.max === "number") apiParams.max = params.max;

  // ترتيب
  if (params.sort) apiParams.sort = params.sort;

  const { data } = await http.get("/interface/products", { params: apiParams });
  return data;
}

export async function getInterfaceProductById(id: number) {
  const { data } = await http.get(`/interface/products/${id}`);
  return data; // غالباً {status,message,data: product}
}

export async function getInterfaceCategories() {
  const { data } = await http.get("/interface/categories");
  return data;
}