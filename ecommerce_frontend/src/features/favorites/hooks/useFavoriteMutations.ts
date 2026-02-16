/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createFavorite, updateFavorite, deleteFavorite } from "../api/favorites.api";
import { favoritesKeys } from "../api/favorites.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useCreateFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createFavorite,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إضافة للمفضلات");
      qc.invalidateQueries({ queryKey: favoritesKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateFavorite(id, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تحديث المفضلة");
      qc.invalidateQueries({ queryKey: favoritesKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف المفضلة");
      qc.invalidateQueries({ queryKey: favoritesKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
 