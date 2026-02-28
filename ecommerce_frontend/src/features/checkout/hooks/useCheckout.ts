import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { checkout, type CheckoutPayload } from "../api/checkout.api";
import { getApiErrorMessage } from "../../../shared/utils/error";
import { cartKeys } from "../../cart/api/cart.keys";

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => checkout(payload),
    onSuccess: async () => {
      // بعد نجاح checkout الكارت لازم يتصفّر
      await qc.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("تم إنشاء الطلب بنجاح");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
}