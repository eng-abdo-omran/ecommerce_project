import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getSuppliers } from "../api/suppliers.api";
import type { SuppliersQuery } from "../api/suppliers.api";
import { suppliersKeys } from "../api/suppliers.keys";

export function useSuppliers(params: SuppliersQuery) {
  return useQuery({
    queryKey: suppliersKeys.list(params),
    queryFn: () => getSuppliers(params),
    placeholderData: keepPreviousData,
  });
}