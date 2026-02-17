import { useQuery } from "@tanstack/react-query";
import { getMyCart } from "../api/cart.api";
import { cartKeys } from "../api/cart.keys";

export function useMyCart(enabled: boolean) {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: () => getMyCart(),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}