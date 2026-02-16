import { useQuery } from "@tanstack/react-query";
import { http } from "../../../api/axios";
import type { ProductLite } from "../types";

export function useProductsLite() {
	return useQuery({
		queryKey: ["products", "lite", "favorites"],
		queryFn: async (): Promise<ProductLite[]> => {
			const { data } = await http.get("/dashboard/products", { params: { page: 1, perPage: 200 } });
			return (data?.data?.data ?? []) as ProductLite[];
		},
	});
}
