/* eslint-disable @typescript-eslint/no-explicit-any */
export const brandsKeys = {
  all: ["brands"] as const,
  list: (params: any) => ["brands", "list", params] as const,
};