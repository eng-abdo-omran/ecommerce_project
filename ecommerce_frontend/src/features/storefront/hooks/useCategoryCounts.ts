/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueries } from "@tanstack/react-query";
import { getInterfaceProducts } from "../api/interface.api";

export function useCategoryCounts(opts: {
  categoryIds: number[];
  search?: string;
  min?: number;
  max?: number;
  sort?: "latest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
  limit?: number;
}) {
  const ids = opts.categoryIds.slice(0, opts.limit ?? 10);

  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["interface", "categoryCount", { id, s: opts.search, min: opts.min, max: opts.max, sort: opts.sort }],
      queryFn: () =>
        getInterfaceProducts({
          page: 1,
          perPage: 1,
          search: opts.search,
          min: opts.min,
          max: opts.max,
          sort: opts.sort,
          category: id,
        }),
      staleTime: 60_000,
    })),
  });

  const counts: Record<number, number | undefined> = {};
  ids.forEach((id, idx) => {
    const d: any = queries[idx].data;
    // response shape: {status,message,data:{ total, ... }}
    const total = d?.data?.total;
    if (typeof total === "number") counts[id] = total;
  });

  return {
    counts,
    isLoading: queries.some((q) => q.isLoading),
  };
}
