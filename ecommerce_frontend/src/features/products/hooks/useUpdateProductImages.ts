/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProductImages, type GalleryItemPayload } from "../api/products.api";
import { getApiErrorMessage } from "../../../shared/utils/error";

type Payload = {
  base: { name: string; price: string | number };
  items: GalleryItemPayload[];
};

export function useUpdateProductImages(productId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ base, items }: Payload) => updateProductImages(productId, base, items),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حفظ صور المنتج بنجاح");
      qc.invalidateQueries({ queryKey: ["products", "details", productId] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}