import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProducts } from "../api/products.api";
import type { ProductsQuery } from "../api/products.api";
import { productsKeys } from "../api/products.keys";

export function useProducts(params: ProductsQuery) {
  return useQuery({
    queryKey: productsKeys.list(params),
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  });
}