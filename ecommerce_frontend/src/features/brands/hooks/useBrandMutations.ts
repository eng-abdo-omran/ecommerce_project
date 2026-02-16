/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBrand, updateBrand, deleteBrand } from "../api/brands.api";
import { brandsKeys } from "../api/brands.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBrand,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إضافة البراند");
      qc.invalidateQueries({ queryKey: brandsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateBrand(id, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تحديث البراند");
      qc.invalidateQueries({ queryKey: brandsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف البراند");
      qc.invalidateQueries({ queryKey: brandsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}