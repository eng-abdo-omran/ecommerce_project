import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites.api";
import type { FavoritesQuery } from "../api/favorites.api";
import { favoritesKeys } from "../api/favorites.keys";

export function useFavorites(params: FavoritesQuery) {
  return useQuery({
    queryKey: favoritesKeys.list(params),
    queryFn: () => getFavorites(params),
    placeholderData: keepPreviousData,
  });
}
 