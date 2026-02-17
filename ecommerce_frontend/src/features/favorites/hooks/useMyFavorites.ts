import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMyFavorites } from "../api/favorites.api";
import { favoritesKeys } from "../api/favorites.keys";

export function useMyFavorites(params: { page: number; perPage: number }, enabled: boolean) {
  return useQuery({
    queryKey: favoritesKeys.list(params),
    queryFn: () => getMyFavorites(params),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}