import { http } from "../../../api/axios";
import type { CouponsListResponse } from "../types";

export type CouponsQuery = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type CouponPayload = {
  code: string;
  discount_value: number | string;
  discount_type: 0 | 1; // 0 fixed / 1 percentage [1](https://fcibuedu-my.sharepoint.com/personal/abdelrahmanmohammed_fci_bu_edu_eg/Documents/Microsoft%20Copilot%20Chat%20Files/new.txt)
  usage_limit: number | string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  description?: string | null;
};

export async function getCoupons(params: CouponsQuery) {
  const { data } = await http.get<CouponsListResponse>("/dashboard/coupons", { params });
  return data;
}

export async function createCoupon(payload: CouponPayload) {
  const { data } = await http.post("/dashboard/coupons", payload);
  return data;
}

export async function updateCoupon(id: number, payload: CouponPayload) {
  const { data } = await http.put(`/dashboard/coupons/${id}`, payload);
  return data;
}

export async function deleteCoupon(id: number) {
  const { data } = await http.delete(`/dashboard/coupons/${id}`);
  return data;
}