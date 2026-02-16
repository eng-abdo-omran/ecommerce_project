import { http } from "../../../api/axios";
import type { FavoritesListResponse } from "../types";

export type FavoritesQuery = {
  page?: number;
  search?: string;
  per_page?: number;
};

export type FavoritePayload = {
  user_id: number;
  product_id: number;
};

export async function getFavorites(params: FavoritesQuery) {
  const { data } = await http.get<FavoritesListResponse>("/dashboard/favorites", { params });
  return data;
}

export async function createFavorite(payload: FavoritePayload) {
  const { data } = await http.post("/dashboard/favorites", payload);
  return data;
}

export async function updateFavorite(id: number, payload: FavoritePayload) {
  const { data } = await http.put(`/dashboard/favorites/${id}`, payload);
  return data;
}

export async function deleteFavorite(id: number) {
  const { data } = await http.delete(`/dashboard/favorites/${id}`);
  return data;
}
 