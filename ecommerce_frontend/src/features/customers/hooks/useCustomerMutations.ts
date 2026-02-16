/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCustomer, updateCustomer, deleteCustomer } from "../api/customers.api";
import { customersKeys } from "../api/customers.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إنشاء العميل بنجاح");
      qc.invalidateQueries({ queryKey: customersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateCustomer(id, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تحديث العميل بنجاح");
      qc.invalidateQueries({ queryKey: customersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف العميل بنجاح");
      qc.invalidateQueries({ queryKey: customersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}