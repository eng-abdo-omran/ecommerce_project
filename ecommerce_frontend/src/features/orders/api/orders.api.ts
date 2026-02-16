import { http } from "../../../api/axios";
import type { OrdersListResponse, OrderDetailsResponse } from "../types";
import type { OrderStatus } from "../types";

export type OrdersQuery = {
  page?: number;
  perPage?: number;

  search?: string;
  status?: string;

  date_from?: string; // YYYY-MM-DD
  date_to?: string;

  min_total?: number | string;
  max_total?: number | string;

  sortBy?: "id" | "order_number" | "total_amount" | "status" | "created_at";
  sortDir?: "asc" | "desc";
};

export async function getOrders(params: OrdersQuery) {
  const { data } = await http.get<OrdersListResponse>("/dashboard/orders", {
    params,
  });
  return data;
}

export async function getOrderById(id: number) {
  const { data } = await http.get<OrderDetailsResponse>(
    `/dashboard/orders/${id}`,
  );
  return data;
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  const { data } = await http.patch(`/dashboard/orders/${id}/status`, {
    status,
  });
  return data; // {status,message,data}
}
