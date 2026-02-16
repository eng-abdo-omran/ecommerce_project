import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCustomers } from "../api/customers.api";
import type { CustomersQuery } from "../api/customers.api";
import { customersKeys } from "../api/customers.keys";

export function useCustomers(params: CustomersQuery) {
  return useQuery({
    queryKey: customersKeys.list(params),
    queryFn: () => getCustomers(params),
    placeholderData: keepPreviousData,
  });
}