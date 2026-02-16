import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getStores } from "../api/stores.api";
import type { StoresQuery } from "../api/stores.api";
import { storesKeys } from "../api/stores.keys";

export function useStores(params: StoresQuery) {
  return useQuery({
    queryKey: storesKeys.list(params),
    queryFn: () => getStores(params),
    placeholderData: keepPreviousData,
  });
}
