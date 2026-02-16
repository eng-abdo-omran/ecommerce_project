export const usersKeys = {
  all: ["users"] as const,
  list: (params: any) => ["users", "list", params] as const,
};