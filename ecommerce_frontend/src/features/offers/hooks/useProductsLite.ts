import { useQuery } from "@tanstack/react-query";
import { http } from "../../../api/axios";
import type { ProductLite } from "../types";

export function useProductsLite() {
  return useQuery({
    queryKey: ["products", "lite", "offers"],
    queryFn: async () => {
      const { data } = await http.get("/dashboard/products", {
        params: { page: 1, perPage: 200 },
      });
      // products response عندك: {status,message,data:{data:[...]}} في العادة
      return (data?.data?.data ?? []) as ProductLite[];
    },
  });
}