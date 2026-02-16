/* eslint-disable @typescript-eslint/no-explicit-any */
export const customersKeys = {
  all: ["customers"] as const,
  list: (params: any) => ["customers", "list", params] as const,
};