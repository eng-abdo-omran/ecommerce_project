/* eslint-disable @typescript-eslint/no-explicit-any */
export const productsKeys = {
  all: ["products"] as const,
  list: (params: any) => ["products", "list", params] as const,
};