/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createStore, updateStore, deleteStore } from "../api/stores.api";
import { storesKeys } from "../api/stores.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useCreateStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStore,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إنشاء المتجر بنجاح");
      qc.invalidateQueries({ queryKey: storesKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateStore(id, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تحديث المتجر بنجاح");
      qc.invalidateQueries({ queryKey: storesKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteStore,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف المتجر بنجاح");
      qc.invalidateQueries({ queryKey: storesKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
