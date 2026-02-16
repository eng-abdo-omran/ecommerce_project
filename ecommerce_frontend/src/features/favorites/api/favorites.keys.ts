/* eslint-disable @typescript-eslint/no-explicit-any */
export const favoritesKeys = {
  all: ["favorites"] as const,
  list: (params: any) => ["favorites", "list", params] as const,
};
 