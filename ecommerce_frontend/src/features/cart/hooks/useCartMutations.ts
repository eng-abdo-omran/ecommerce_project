import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addCartItem, updateCartItem, removeCartItem, clearCart } from "../api/cart.api";
import { cartKeys } from "../api/cart.keys";

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("تمت الإضافة إلى السلة ✅");
    },
    onError: () => toast.error("تعذر إضافة المنتج للسلة"),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      updateCartItem(productId, { quantity }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.all }),
    onError: () => toast.error("تعذر تحديث الكمية"),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => removeCartItem(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.all }),
    onError: () => toast.error("تعذر حذف المنتج من السلة"),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.all }),
    onError: () => toast.error("تعذر تفريغ السلة"),
  });
}