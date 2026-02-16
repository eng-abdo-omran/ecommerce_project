import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../api/orders.api";
import { ordersKeys } from "../api/orders.keys";

export function useOrder(id: number) {
  return useQuery({
    queryKey: ordersKeys.details(id),
    queryFn: () => getOrderById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}