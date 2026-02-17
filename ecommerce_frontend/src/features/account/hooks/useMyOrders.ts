import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMyOrders, getMyOrderById } from "../api/account.api";
import { accountKeys } from "../api/account.keys";

export function useMyOrders(params: { page: number; perPage: number }, enabled: boolean) {
  return useQuery({
    queryKey: accountKeys.ordersList(params),
    queryFn: () => getMyOrders(params),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
}

export function useMyOrder(id: number, enabled: boolean) {
  return useQuery({
    queryKey: accountKeys.orderDetails(id),
    queryFn: () => getMyOrderById(id),
    enabled: enabled && Number.isFinite(id) && id > 0,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
}