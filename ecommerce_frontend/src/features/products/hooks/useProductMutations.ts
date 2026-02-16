/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createProduct, updateProduct, deleteProduct } from "../api/products.api";
import { productsKeys } from "../api/products.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إضافة المنتج");
      qc.invalidateQueries({ queryKey: productsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateProduct(id, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تحديث المنتج");
      qc.invalidateQueries({ queryKey: productsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف المنتج");
      qc.invalidateQueries({ queryKey: productsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}