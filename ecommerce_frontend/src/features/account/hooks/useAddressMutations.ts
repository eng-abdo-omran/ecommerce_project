/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createAddress, updateAddress, deleteAddress } from "../api/account.api";
import { accountKeys } from "../api/account.keys";

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.addresses });
      toast.success("تمت إضافة العنوان ✅");
    },
    onError: () => toast.error("تعذر إضافة العنوان"),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateAddress(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.addresses });
      toast.success("تم تحديث العنوان ✅");
    },
    onError: () => toast.error("تعذر تحديث العنوان"),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.addresses });
      toast.success("تم حذف العنوان ✅");
    },
    onError: () => toast.error("تعذر حذف العنوان"),
  });
}