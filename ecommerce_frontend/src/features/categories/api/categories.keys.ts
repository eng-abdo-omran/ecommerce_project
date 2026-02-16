export const categoriesKeys = {
  all: ["categories"] as const,
  list: (params: any) => ["categories", "list", params] as const,
};