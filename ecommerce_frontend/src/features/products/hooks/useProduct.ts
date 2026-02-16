import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../api/products.api";

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["products", "details", id],
    queryFn: () => getProductById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}