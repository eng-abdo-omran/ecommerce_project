import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getInterfaceProducts } from "../api/interface.api";
import type { InterfaceProductsQuery } from "../api/interface.api";

export function useInterfaceProducts(params: InterfaceProductsQuery) {
  return useQuery({
    queryKey: ["interface", "products", params],
    queryFn: () => getInterfaceProducts(params),
    placeholderData: keepPreviousData,
  });
}