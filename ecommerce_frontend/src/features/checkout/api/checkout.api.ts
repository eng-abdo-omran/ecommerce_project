import { http } from "../../../api/axios";

export type CheckoutPayload = {
  address_id: number;
  payment_method: "cod" | "online";
  coupon_code?: string | null;
  notes?: string | null;
};

export async function checkout(payload: CheckoutPayload) {
  const { data } = await http.post("/my/checkout", payload);
  return data;
}