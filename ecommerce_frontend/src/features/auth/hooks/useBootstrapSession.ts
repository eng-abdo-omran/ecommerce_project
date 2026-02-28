/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "../../cart/api/cart.keys";
// import { favoritesKeys } from "../../favorites/api/favorites.keys";
import { getMyCart } from "../../cart/api/cart.api";
import { favoriteIdsKey } from "../../favorites/hooks/useMyFavoriteIds";
import { getMyFavoriteIds } from "../../favorites/api/favorites.api";
import { useFavoritesStore } from "../../../store/favorites.store";
import { getMe } from "../../user/api/user.api";
import { accountKeys } from "../../account/api/account.keys";

export function useBootstrapSession() {
  const qc = useQueryClient();

  return async function bootstrap() {
    const setAllFav = useFavoritesStore.getState().setAll;

    await Promise.allSettled([
      qc.prefetchQuery({ queryKey: accountKeys.me, queryFn: () => getMe() }),
      qc.prefetchQuery({ queryKey: cartKeys.all, queryFn: () => getMyCart() }),
      qc.prefetchQuery({
        queryKey: favoriteIdsKey,
        queryFn: () => getMyFavoriteIds(),
      }),
    ]);

    // بعد prefetch هتقدر تقرأ من الكاش وتغذي الستورد
    const cached = qc.getQueryData<any>(favoriteIdsKey);
    if (cached?.status && Array.isArray(cached.data)) setAllFav(cached.data);
  };
}
