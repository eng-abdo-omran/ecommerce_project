import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCoupons } from "../api/coupons.api";
import type { CouponsQuery } from "../api/coupons.api";
import { couponsKeys } from "../api/coupons.keys";

export function useCoupons(params: CouponsQuery) {
  return useQuery({
    queryKey: couponsKeys.list(params),
    queryFn: () => getCoupons(params),
    placeholderData: keepPreviousData,
  });
}