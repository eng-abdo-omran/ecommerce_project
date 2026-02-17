/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "../../../api/axios";

export type CartItemDTO = {
  product_id: number;
  quantity: number;
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

export async function addCartItem(payload: { product_id: number; quantity?: number }) {
  const { data } = await http.post("/my/cart/items", payload);
  return data;
}

export async function updateCartItem(productId: number, payload: { quantity: number }) {
  const { data } = await http.patch(`/my/cart/items/${productId}`, payload);
  return data;
}

export async function removeCartItem(productId: number) {
  const { data } = await http.delete(`/my/cart/items/${productId}`);
  return data;
}

export async function clearCart() {
  const { data } = await http.post("/my/cart/clear");
  return data;
}

export async function mergeCart(payload: { items: { product_id: number; quantity: number }[] }) {
  const { data } = await http.post("/my/cart/merge", payload);
  return data;
}