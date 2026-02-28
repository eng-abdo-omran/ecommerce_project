/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "../../../api/axios";

export type FavoritesListResponse = {
  status: boolean;
  message?: string;
  data: {
    current_page: number;
    data: any[];
    last_page: number;
    per_page: number;
    total: number;
  };
};

export async function getMyFavorites(params: { page?: number; perPage?: number } = {}) {
  const { data } = await http.get<FavoritesListResponse>("/my/favorites", { params });
  return data;
}

export async function toggleFavorite(productId: number) {
  const { data } = await http.post(`/my/favorites/${productId}/toggle`);
  return data; // {status,message,data:{is_favorite:true/false}}
}


export async function getMyFavoriteIds() {
  const { data } = await http.get<{ status: boolean; data: number[] }>("/my/favorites/ids");
  return data;
}
