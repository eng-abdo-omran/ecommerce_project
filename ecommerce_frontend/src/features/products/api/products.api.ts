/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "../../../api/axios";
import type { ProductsListResponse } from "../types";

export type ProductsQuery = {
  page?: number;
  search?: string;
  perPage?: number;
};

export type ProductPayload = {
  sku?: string | null;
  name: string;
  slug?: string | null;

  description?: string | null;
  details?: string | null;
  features?: string | null;

  price: number | string;
  compare_price?: number | string | null;
  cost_price?: number | string | null;

  weight?: number | null;
  quantity?: number | null;
  dimensions?: string | null; //  Phase 1 string

  supplier_id?: number | null;
  category_id?: number | null;
  brand_id?: number | null;

  images?: File | null; //  main image file
};

function appendIf(fd: FormData, key: string, val: any) {
  if (val === undefined || val === null) return;
  if (typeof val === "string" && val.trim() === "") return;
  fd.append(key, String(val));
}

function toFormData(payload: ProductPayload) {
  const fd = new FormData();

  appendIf(fd, "name", payload.name);
  appendIf(fd, "price", payload.price);

  appendIf(fd, "sku", payload.sku);
  appendIf(fd, "slug", payload.slug);

  appendIf(fd, "description", payload.description ?? "");
  appendIf(fd, "details", payload.details ?? "");
  appendIf(fd, "features", payload.features ?? "");

  appendIf(fd, "compare_price", payload.compare_price ?? "");
  appendIf(fd, "cost_price", payload.cost_price ?? "");

  appendIf(fd, "weight", payload.weight);
  appendIf(fd, "quantity", payload.quantity);
  appendIf(fd, "dimensions", payload.dimensions ?? "");

  appendIf(fd, "supplier_id", payload.supplier_id);
  appendIf(fd, "category_id", payload.category_id);
  appendIf(fd, "brand_id", payload.brand_id);

  // Backend expects "images" for main image
  if (payload.images instanceof File) fd.append("images", payload.images);

  return fd;
}

export async function getProducts(params: ProductsQuery) {
  const { data } = await http.get<ProductsListResponse>("/dashboard/products", {
    params,
  });
  return data;
}

export async function getProductById(id: number) {
  const { data } = await http.get(`/dashboard/products/${id}`);
  // response: {status,message,data: product}
  return data;
}

export async function createProduct(payload: ProductPayload) {
  const fd = toFormData(payload);
  const { data } = await http.post("/dashboard/products", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateProduct(id: number, payload: ProductPayload) {
  const fd = toFormData(payload);
  fd.append("_method", "PUT");

  const { data } = await http.post(`/dashboard/products/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteProduct(id: number) {
  const { data } = await http.delete(`/dashboard/products/${id}`);
  return data;
}

// === Images ===
// For updating the entire gallery (including main image). For main image only, use updateProduct with images field.
export type GalleryItemPayload =
  | { url: string; alt_text?: string | null; sort_order?: number } // existing
  | { file: File; alt_text?: string | null; sort_order?: number }; // new

export async function updateProductImages(
  productId: number,
  base: { name: string; price: string | number },
  items: GalleryItemPayload[],
) {
  const fd = new FormData();
  fd.append("_method", "PUT");

  // required by ProductRequest
  fd.append("name", base.name);
  fd.append("price", String(base.price));

  items.forEach((it, i) => {
    if ("file" in it) {
      fd.append(`product_images[${i}][url]`, it.file);
    } else {
      fd.append(`product_images[${i}][url]`, it.url);
    }
    fd.append(`product_images[${i}][alt_text]`, it.alt_text ?? "");
    fd.append(`product_images[${i}][sort_order]`, String(it.sort_order ?? i));
  });

  const { data } = await http.post(`/dashboard/products/${productId}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

export type VariantValuePayload = {
  value: string;
  color_name?: string | null;
  image_name?: string | null;
};

export type VariantPayload = {
  name: string;
  type: number; // 0 fixed / 1 percentage
  values?: VariantValuePayload[];
};

export async function updateProductVariants(
  productId: number,
  base: { name: string; price: string | number },
  variants: VariantPayload[],
) {
  const fd = new FormData();
  fd.append("_method", "PUT");

  //  required by ProductRequest (عشان مايرجعش name/price required)
  fd.append("name", base.name);
  fd.append("price", String(base.price));

  variants.forEach((v, i) => {
    fd.append(`variants[${i}][name]`, v.name);
    fd.append(`variants[${i}][type]`, String(v.type));

    if (Array.isArray(v.values) && v.values.length > 0) {
      v.values.forEach((val, j) => {
        fd.append(`variants[${i}][values][${j}][value]`, val.value);
        fd.append(
          `variants[${i}][values][${j}][color_name]`,
          val.color_name ?? "",
        );
        fd.append(
          `variants[${i}][values][${j}][image_name]`,
          val.image_name ?? "",
        );
      });
    }
  });

  const { data } = await http.post(`/dashboard/products/${productId}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data; // {status,message,data}
}
