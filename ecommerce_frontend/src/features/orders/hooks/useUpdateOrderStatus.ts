/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateOrderStatus } from "../api/orders.api";
import type { OrderStatus } from "../types";
import { getApiErrorMessage } from "../../../shared/utils/error";

export function useUpdateOrderStatus(orderId?: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => updateOrderStatus(id, status),
    onSuccess: (res: any, vars) => {
      toast.success(res?.message || "تم تحديث حالة الطلب");

      // Refresh list
      qc.invalidateQueries({ queryKey: ["orders"] });

      // Refresh details لو احنا في صفحة تفاصيل
      if (orderId) {
        qc.invalidateQueries({ queryKey: ["orders", "details", orderId] });
      } else {
        qc.invalidateQueries({ queryKey: ["orders", "details", vars.id] });
      }
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}