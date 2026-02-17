import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../api/account.api";
import { accountKeys } from "../api/account.keys";

export function useAddresses(enabled: boolean) {
  return useQuery({
    queryKey: accountKeys.addresses,
    queryFn: () => getAddresses(),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}