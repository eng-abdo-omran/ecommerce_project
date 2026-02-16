/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createSupplier, updateSupplier, deleteSupplier } from "../api/suppliers.api";
import { suppliersKeys } from "../api/suppliers.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إضافة المورد بنجاح");
      qc.invalidateQueries({ queryKey: suppliersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateSupplier(id, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تحديث بيانات المورد");
      qc.invalidateQueries({ queryKey: suppliersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف المورد");
      qc.invalidateQueries({ queryKey: suppliersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}