/* eslint-disable @typescript-eslint/no-explicit-any */
export const reviewsKeys = {
  all: ["reviews"] as const,
  list: (params: any) => ["reviews", "list", params] as const,
};
