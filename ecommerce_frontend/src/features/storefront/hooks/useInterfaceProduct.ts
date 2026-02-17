import { useQuery } from "@tanstack/react-query";
import { getInterfaceProductById } from "../api/interface.api";

export function useInterfaceProduct(id: number) {
  return useQuery({
    queryKey: ["interface", "product", id],
    queryFn: () => getInterfaceProductById(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  });
}