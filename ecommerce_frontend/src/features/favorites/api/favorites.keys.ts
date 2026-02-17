/* eslint-disable @typescript-eslint/no-explicit-any */
export const favoritesKeys = {
  all: ["my", "favorites"] as const,
  list: (params: any) => ["my", "favorites", params] as const,
};