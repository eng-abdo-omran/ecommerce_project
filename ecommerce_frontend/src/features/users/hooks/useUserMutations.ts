import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createUser, updateUser, deleteUser } from "../api/users.api";
import { usersKeys } from "../api/users.keys";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إنشاء المستخدم");
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateUser(id, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تحديث المستخدم");
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف المستخدم");
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}