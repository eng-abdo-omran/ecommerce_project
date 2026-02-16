/* eslint-disable @typescript-eslint/no-explicit-any */
export const storesKeys = {
  all: ["stores"] as const,
  list: (params: any) => ["stores", "list", params] as const,
};
