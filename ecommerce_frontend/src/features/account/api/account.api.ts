import { http } from "../../../api/axios";

// ===== ME =====
export type MeResponse = {
  status: boolean;
  message?: string;
  data: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    role?: number | null;
  };
};

export async function getMe() {
  const { data } = await http.get<MeResponse>("/me");
  return data;
}

export type UpdateMePayload = {
  name?: string;
  phone?: string | null;
  address?: string | null;
};

export async function updateMe(payload: UpdateMePayload) {
  const { data } = await http.patch<MeResponse>("/me", payload);
  return data;
}

// ===== ADDRESSES =====
export type Address = {
  id: number;
  label: string;
  city: string;
  street: string;
  notes?: string | null;
};

export async function getAddresses() {
  const { data } = await http.get<Address[]>("/addresses");
  return data;
}

export async function createAddress(payload: Omit<Address, "id">) {
  const { data } = await http.post<Address>("/addresses", payload);
  return data;
}

export async function updateAddress(id: number, payload: Partial<Omit<Address, "id">>) {
  const { data } = await http.patch<Address>(`/addresses/${id}`, payload);
  return data;
}

export async function deleteAddress(id: number) {
  const { data } = await http.delete(`/addresses/${id}`);
  return data;
}

// ===== MY ORDERS (Pagination) =====
export type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number | string;
  subtotal: number | string;
  product?: { id: number; name: string; images?: string | null } | null;
};

export type Order = {
  id: number;
  order_number?: string | null;
  total_amount: string | number;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  created_at?: string;
  items?: OrderItem[];
};

export type LaravelPaginator<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
};

export type OrdersResponse = {
  status: boolean;
  message?: string;
  data: LaravelPaginator<Order>;
};

export async function getMyOrders(params: { page?: number; perPage?: number } = {}) {
  const { data } = await http.get<OrdersResponse>("/my/orders", { params });
  return data;
}

export type OrderDetailsResponse = {
  status: boolean;
  message?: string;
  data: Order;
};

export async function getMyOrderById(id: number) {
  const { data } = await http.get<OrderDetailsResponse>(`/my/orders/${id}`);
  return data;
}