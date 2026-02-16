import { useQuery } from "@tanstack/react-query";
import { http } from "../../../api/axios";
import type { BrandLite } from "../types";

export function useBrandsLite() {
  return useQuery({
    queryKey: ["brands", "lite"],
    queryFn: async () => {
      const { data } = await http.get("/dashboard/brands", {
        params: { page: 1, perPage: 200 },
      });
      return (data?.data?.data ?? []) as BrandLite[];
    },
  });
}