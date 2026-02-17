/* eslint-disable @typescript-eslint/no-explicit-any */
export const cartKeys = {
  all: ["my", "cart"] as const,
};

export const favKeys = {
  all: ["my", "favorites"] as const,
  list: (params: any) => ["my", "favorites", params] as const,
};