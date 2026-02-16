import { useQuery } from "@tanstack/react-query";
import { http } from "../../../api/axios";

export type SupplierLite = {
  id: number;
  full_name: string;
  phone?: string | null;
};

export function useSuppliersLite() {
  return useQuery({
    queryKey: ["suppliers", "lite"],
    queryFn: async () => {
      const { data } = await http.get("/dashboard/suppliers", {
        params: { page: 1, perPage: 200 },
      });

      // Laravel pagination shape: { status, message, data: { data: [...] } }
      return (data?.data?.data ?? []) as SupplierLite[];
    },
    staleTime: 5 * 60 * 1000, // ✅ اختياري: 5 دقائق
  });
}