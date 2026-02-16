import { http } from "../../../api/axios";
import type { ReviewsListResponse } from "../types";

export type ReviewsQuery = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type ReviewPayload = {
  product_id: number;
  customer_id: number;
  rating: number;
  comment?: string | null;
};

export async function getReviews(params: ReviewsQuery) {
  const { data } = await http.get<ReviewsListResponse>("/dashboard/reviews", { params });
  return data;
}

export async function createReview(payload: ReviewPayload) {
  const { data } = await http.post("/dashboard/reviews", payload);
  return data;
}

export async function updateReview(id: number, payload: ReviewPayload) {
  const { data } = await http.put(`/dashboard/reviews/${id}`, payload);
  return data;
}

export async function deleteReview(id: number) {
  const { data } = await http.delete(`/dashboard/reviews/${id}`);
  return data;
}
