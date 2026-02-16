/* eslint-disable @typescript-eslint/no-explicit-any */
export const ordersKeys = {
  all: ["orders"] as const,
  list: (params: any) => ["orders", "list", params] as const,
  details: (id: number) => ["orders", "details", id] as const,
};