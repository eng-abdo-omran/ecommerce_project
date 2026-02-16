/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCoupon, updateCoupon, deleteCoupon } from "../api/coupons.api";
import { couponsKeys } from "../api/coupons.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCoupon,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إنشاء الكوبون بنجاح");
      qc.invalidateQueries({ queryKey: couponsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateCoupon(id, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تحديث الكوبون بنجاح");
      qc.invalidateQueries({ queryKey: couponsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف الكوبون بنجاح");
      qc.invalidateQueries({ queryKey: couponsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}