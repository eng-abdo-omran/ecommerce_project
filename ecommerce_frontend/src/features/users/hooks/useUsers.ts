import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users.api";
import type { UsersQuery } from "../api/users.api";
import { usersKeys } from "../api/users.keys";

export function useUsers(params: UsersQuery) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => getUsers(params),
    keepPreviousData: true,
  });
}