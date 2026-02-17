import { useQueries, useQuery } from "@tanstack/react-query";
import { getInterfaceCategories, getInterfaceProducts } from "../api/interface.api";

export function useHomeData() {
  const categoriesQuery = useQuery({
    queryKey: ["interface", "categories"],
    queryFn: () => getInterfaceCategories(),
    staleTime: 60_000,
  });

  const productQueries = useQueries({
    queries: [
      {
        queryKey: ["home", "featured"],
        queryFn: () => getInterfaceProducts({ page: 1, perPage: 8, search: "" }),
        staleTime: 30_000,
      },
      {
        queryKey: ["home", "new_arrivals"],
        queryFn: () => getInterfaceProducts({ page: 1, perPage: 8, search: "" }),
        staleTime: 30_000,
      },
      {
        queryKey: ["home", "best_sellers"],
        queryFn: () => getInterfaceProducts({ page: 1, perPage: 8, search: "" }),
        staleTime: 30_000,
      },
    ],
  });

  const featured = productQueries[0];
  const newArrivals = productQueries[1];
  const bestSellers = productQueries[2];

  return {
    categoriesQuery,
    featured,
    newArrivals,
    bestSellers,
  };
}