import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addCartItem, updateCartItem, removeCartItem, clearCart } from "../api/cart.api";
import { cartKeys } from "../api/cart.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("تمت الإضافة إلى السلة");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartItem(itemId, { quantity }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.all }),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => removeCartItem(itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.all }),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.all }),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
}