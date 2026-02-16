import { useQuery } from "@tanstack/react-query";
import { http } from "../../../api/axios";
import type { UserLite } from "../types";

export function useUsersLite() {
	return useQuery({
		queryKey: ["users", "lite", "favorites"],
		queryFn: async (): Promise<UserLite[]> => {
			const { data } = await http.get("/dashboard/users", { params: { page: 1, perPage: 200 } });
			return (data?.data?.data ?? []) as UserLite[];
		},
	});
}
