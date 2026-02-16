/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createOffer, updateOffer, deleteOffer } from "../api/offers.api";
import { offersKeys } from "../api/offers.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOffer,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إنشاء العرض بنجاح");
      qc.invalidateQueries({ queryKey: offersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateOffer(id, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تحديث العرض بنجاح");
      qc.invalidateQueries({ queryKey: offersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteOffer,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف العرض بنجاح");
      qc.invalidateQueries({ queryKey: offersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}