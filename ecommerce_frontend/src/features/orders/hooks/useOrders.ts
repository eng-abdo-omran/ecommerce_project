import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getOrders } from "../api/orders.api";
import type { OrdersQuery } from "../api/orders.api";
import { ordersKeys } from "../api/orders.keys";

export function useOrders(params: OrdersQuery) {
  return useQuery({
    queryKey: ordersKeys.list(params),
    queryFn: () => getOrders(params),
    placeholderData: keepPreviousData,
  });
}