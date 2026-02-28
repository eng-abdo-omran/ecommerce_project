import { useQuery } from "@tanstack/react-query";
import { getAdminOverview } from "../api/overview.api";

export const adminOverviewKey = ["admin", "overview"] as const;

export function useAdminOverview() {
  return useQuery({
    queryKey: adminOverviewKey,
    queryFn: getAdminOverview,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}