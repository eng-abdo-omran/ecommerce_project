/* eslint-disable @typescript-eslint/no-explicit-any */
export const couponsKeys = {
  all: ["coupons"] as const,
  list: (params: any) => ["coupons", "list", params] as const,
};