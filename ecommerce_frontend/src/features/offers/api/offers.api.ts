import { http } from "../../../api/axios";
import type { OffersListResponse } from "../types";

export type OffersQuery = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type OfferPayload = {
  product_id?: number | null;
  title: string;
  description?: string | null;
  discount_type: "percent" | "fixed";
  value: number | string;
  start_at?: string | null; // "YYYY-MM-DDTHH:mm" أو "YYYY-MM-DD HH:mm:ss"
  end_at?: string | null;
};

export async function getOffers(params: OffersQuery) {
  const { data } = await http.get<OffersListResponse>("/dashboard/offers", { params });
  return data;
}

export async function createOffer(payload: OfferPayload) {
  const { data } = await http.post("/dashboard/offers", payload);
  return data;
}

export async function updateOffer(id: number, payload: OfferPayload) {
  const { data } = await http.put(`/dashboard/offers/${id}`, payload);
  return data;
}

export async function deleteOffer(id: number) {
  const { data } = await http.delete(`/dashboard/offers/${id}`);
  return data;
}