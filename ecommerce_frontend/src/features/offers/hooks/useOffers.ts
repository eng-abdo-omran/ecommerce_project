import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getOffers } from "../api/offers.api";
import type { OffersQuery } from "../api/offers.api";
import { offersKeys } from "../api/offers.keys";

export function useOffers(params: OffersQuery) {
  return useQuery({
    queryKey: offersKeys.list(params),
    queryFn: () => getOffers(params),
    placeholderData: keepPreviousData,
  });
}