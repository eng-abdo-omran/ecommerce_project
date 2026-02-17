import { useQuery } from "@tanstack/react-query";
import { getInterfaceCategories } from "../api/interface.api";

export function useInterfaceCategories() {
  return useQuery({
    queryKey: ["interface", "categories"],
    queryFn: () => getInterfaceCategories(),
  });
}