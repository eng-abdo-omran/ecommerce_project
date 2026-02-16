import { useQuery } from "@tanstack/react-query";
import { http } from "../../../api/axios";
import type { CategoryLite } from "../types";

export function useCategoriesLite() {
  return useQuery({
    queryKey: ["categories", "lite"],
    queryFn: async () => {
      const { data } = await http.get("/dashboard/categories", {
        params: { page: 1, perPage: 200 },
      });
      return (data?.data?.data ?? []) as CategoryLite[];
    },
  });
}