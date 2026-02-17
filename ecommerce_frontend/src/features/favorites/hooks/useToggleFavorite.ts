import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { toggleFavorite } from "../api/favorites.api";
import { favoritesKeys } from "../api/favorites.keys";

export function useToggleFavorite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => toggleFavorite(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: favoritesKeys.all });
      toast.success("تم تحديث المفضلة ✅");
    },
    onError: () => toast.error("تعذر تحديث المفضلة"),
  });
}