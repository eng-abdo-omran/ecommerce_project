import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCategory, updateCategory, deleteCategory } from "../api/categories.api";
import { categoriesKeys } from "../api/categories.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إضافة القسم");
      qc.invalidateQueries({ queryKey: categoriesKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateCategory(id, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تحديث القسم");
      qc.invalidateQueries({ queryKey: categoriesKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف القسم");
      qc.invalidateQueries({ queryKey: categoriesKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}