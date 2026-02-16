import { useQuery } from "@tanstack/react-query";
import { http } from "../../../api/axios";
import type { CustomerLite } from "../types";

export function useCustomersLite() {
	return useQuery({
		queryKey: ["customers", "lite", "reviews"],
		queryFn: async () => {
			const { data } = await http.get("/dashboard/customers", {
				params: { page: 1, perPage: 200 },
			});
			return (data?.data?.data ?? []) as CustomerLite[];
		},
	});
}

