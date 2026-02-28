import { useQuery } from "@tanstack/react-query";
import { getMyFavoriteIds } from "../api/favorites.api";
import { useFavoritesStore } from "../../../store/favorites.store";

export const favoriteIdsKey = ["my", "favorites", "ids"] as const;

export function useMyFavoriteIds(enabled: boolean) {
  const setAll = useFavoritesStore((s) => s.setAll);

  const query = useQuery({
    queryKey: favoriteIdsKey,
    queryFn: getMyFavoriteIds,
    enabled,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  if (query.data?.status && Array.isArray(query.data.data)) {
    setAll(query.data.data);
  }

  return query;
}