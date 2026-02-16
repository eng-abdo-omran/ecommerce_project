/* eslint-disable @typescript-eslint/no-explicit-any */
export const offersKeys = {
  all: ["offers"] as const,
  list: (params: any) => ["offers", "list", params] as const,
};