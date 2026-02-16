/* eslint-disable @typescript-eslint/no-explicit-any */
export type OrderStatus = "pending" | "processing" | "shipped" | "completed" | "cancelled";

export type OrderUser = {
  id: number;
  name: string;
  email: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  user_id: number | null;
  quantity: number;
  unit_price: string;  // decimal غالبًا string
  subtotal: string;
  notes: string | null;

  product?: {
    id: number;
    name: string;
    sku: string | null;
    images?: string | null;
  };
};

export type Order = {
  id: number;
  order_number: string | null;
  user_id: number | null;

  total_amount: string; // decimal(12,2)
  status: OrderStatus;

  shipping_address: any; // cast array في Laravel
  billing_address: any | null;

  tracking_number: string | null;
  tracking_url: string | null;
  notes: string | null;

  created_at?: string;
  updated_at?: string;

  user?: OrderUser | null;
  items?: OrderItem[];
};

export type LaravelPagination<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  from: number | null;
  to: number | null;
};

export type OrdersListResponse = {
  status: boolean;
  message: string;
  data: LaravelPagination<Order>;
};

export type OrderDetailsResponse = {
  status: boolean;
  message: string;
  data: Order;
};