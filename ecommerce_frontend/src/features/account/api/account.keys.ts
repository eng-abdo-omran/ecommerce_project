/* eslint-disable @typescript-eslint/no-explicit-any */
export const accountKeys = {
  me: ["me"] as const,
  addresses: ["addresses"] as const,
  orders: ["my", "orders"] as const,
  ordersList: (params: any) => ["my", "orders", "list", params] as const,
  orderDetails: (id: number) => ["my", "orders", "details", id] as const,
};