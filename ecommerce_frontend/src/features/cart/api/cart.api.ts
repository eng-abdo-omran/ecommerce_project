/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "../../../api/axios";

export type CartItemDTO = {
  id: number;                
  product_id: number;
  quantity: number;
  options?: Array<{ variant_id: number; value_id: number }>;
  unit_price?: number;
  subtotal?: number;
  product?: any;
};

export type MyCartResponse = {
  status: boolean;
  message?: string;
  data: {
    items: CartItemDTO[];
    total: number;
  };
};

export async function getMyCart() {
  const { data } = await http.get<MyCartResponse>("/my/cart");
  return data;
}

export async function addCartItem(payload: {
  product_id: number;
  quantity?: number;
  options?: Array<{ variant_id: number; value_id: number }>;
}) {
  const { data } = await http.post("/my/cart/items", payload);
  return data;
}

export async function updateCartItem(itemId: number, payload: { quantity: number }) {
  const { data } = await http.patch(`/my/cart/items/${itemId}`, payload);
  return data;
}

export async function removeCartItem(itemId: number) {
  const { data } = await http.delete(`/my/cart/items/${itemId}`);
  return data;
}

export async function clearCart() {
  const { data } = await http.post("/my/cart/clear");
  return data;
}

