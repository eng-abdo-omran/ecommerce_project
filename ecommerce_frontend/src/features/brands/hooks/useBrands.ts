import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getBrands } from "../api/brands.api";
import type { BrandsQuery } from "../api/brands.api";
import { brandsKeys } from "../api/brands.keys";

export function useBrands(params: BrandsQuery) {
  return useQuery({
    queryKey: brandsKeys.list(params),
    queryFn: () => getBrands(params),
    placeholderData: keepPreviousData,
  });
}