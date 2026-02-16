/* eslint-disable @typescript-eslint/no-explicit-any */
export const suppliersKeys = {
  all: ["suppliers"] as const,
  list: (params: any) => ["suppliers", "list", params] as const,
};