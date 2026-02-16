import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCategories } from "../api/categories.api";
import type { CategoriesQuery } from "../api/categories.api";
import { categoriesKeys } from "../api/categories.keys";

export function useCategories(params: CategoriesQuery) {
  return useQuery({
    queryKey: categoriesKeys.list(params),
    queryFn: () => getCategories(params),
    placeholderData: keepPreviousData, // يحافظ على الداتا وقت البحث/الصفحات
  });
}