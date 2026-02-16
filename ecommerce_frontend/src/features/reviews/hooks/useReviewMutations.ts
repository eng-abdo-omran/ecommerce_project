/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createReview, updateReview, deleteReview } from "../api/reviews.api";
import { reviewsKeys } from "../api/reviews.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إنشاء التقييم بنجاح");
      qc.invalidateQueries({ queryKey: reviewsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateReview(id, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تحديث التقييم بنجاح");
      qc.invalidateQueries({ queryKey: reviewsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف التقييم بنجاح");
      qc.invalidateQueries({ queryKey: reviewsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
