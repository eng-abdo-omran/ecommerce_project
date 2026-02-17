import { useQueryClient } from "@tanstack/react-query";
import { cartKeys, favKeys } from "../../cart/api/cart.keys";
import { getMyCart } from "../../cart/api/cart.api";
import { getMyFavorites } from "../../favorites/api/favorites.api";
import { getMe } from "../../user/api/user.api";

export function useBootstrapSession() {
  const qc = useQueryClient();

  return async function bootstrap() {
    // parallel prefetch
    await Promise.allSettled([
      qc.prefetchQuery({ queryKey: ["me"], queryFn: () => getMe() }),
      qc.prefetchQuery({ queryKey: cartKeys.all, queryFn: () => getMyCart() }),
      qc.prefetchQuery({ queryKey: favKeys.all, queryFn: () => getMyFavorites({ page: 1, perPage: 10 }) }),
    ]);
  };
}