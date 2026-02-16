/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProductVariants, type VariantPayload } from "../api/products.api";
import { getApiErrorMessage } from "../../../shared/utils/error";

type Payload = {
  base: { name: string; price: string | number };
  variants: VariantPayload[];
};

export function useUpdateProductVariants(productId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ base, variants }: Payload) =>
      updateProductVariants(productId, base, variants),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حفظ الفاريانت بنجاح");
      qc.invalidateQueries({ queryKey: ["products", "details", productId] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}