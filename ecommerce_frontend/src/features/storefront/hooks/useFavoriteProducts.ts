/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueries } from "@tanstack/react-query";
import { getInterfaceProductById } from "../api/interface.api";

export function useFavoriteProducts(ids: number[]) {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["interface", "product", id],
    //   queryFn: () => getInterfaceProductById(id),
      enabled: id > 0,
      staleTime: 30_000,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isFetching = queries.some((q) => q.isFetching);
  const isError = queries.some((q) => q.isError);

  // كل query بيرجع {status,message,data:product}
  const products = queries
    .map((q) => (q.data ? (q.data as any).data : null))
    .filter(Boolean);

  return { products, isLoading, isFetching, isError };
}