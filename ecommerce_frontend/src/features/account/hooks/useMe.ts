import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/account.api";
import { accountKeys } from "../api/account.keys";

export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: accountKeys.me,
    queryFn: () => getMe(),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}