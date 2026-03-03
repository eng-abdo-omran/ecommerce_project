/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import { Button } from "../../../shared/components/ui/Button";
import { Select } from "../../../shared/components/ui/Select";

export function ShopResultsToolbar({
  total,
  page,
  lastPage,
  sort,
  onSortChange,
  onOpenMobileFilters,
  onClearAll,
  hasActiveFilters,
}: {
  total?: number;
  page: number;
  lastPage: number;
  sort: "latest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
  onSortChange: (v: any) => void;
  onOpenMobileFilters: () => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-3xl border bg-white p-4 shadow-sm">
      {/* Results */}
      <div className="text-sm text-gray-700">
        <span className="font-semibold text-gray-900">
          {t("shop.toolbar.resultsLabel", { defaultValue: "Results:" })}
        </span>{" "}
        {typeof total === "number" ? (
          <>
            <span className="font-semibold">{total}</span>{" "}
            <span className="text-gray-500">
              {t("shop.toolbar.productUnit", { defaultValue: "products" })}
            </span>
          </>
        ) : (
          <span className="text-gray-500">{t("common.na", { defaultValue: "—" })}</span>
        )}
        <span className="mx-2 text-gray-300">|</span>
        <span className="text-gray-500">
          {t("shop.toolbar.pageOf", {
            defaultValue: "Page {{page}} of {{last}}",
            page,
            last: lastPage,
          })}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Mobile filters */}
        <Button
          variant="secondary"
          size="sm"
          className="md:hidden"
          onClick={onOpenMobileFilters}
        >
          {t("shop.filters", { defaultValue: "Filters" })}
        </Button>

        {/* Sort */}
        <div className="min-w-[220px]">
          <Select value={sort} onChange={(e) => onSortChange(e.target.value)}>
            <option value="latest">{t("shop.sort.latest", { defaultValue: "Latest" })}</option>
            <option value="price_asc">
              {t("shop.sort.priceAscLong", { defaultValue: "Price: low to high" })}
            </option>
            <option value="price_desc">
              {t("shop.sort.priceDescLong", { defaultValue: "Price: high to low" })}
            </option>
            <option value="name_asc">
              {t("shop.sort.nameAscLong", { defaultValue: "Name: A–Z" })}
            </option>
            <option value="name_desc">
              {t("shop.sort.nameDescLong", { defaultValue: "Name: Z–A" })}
            </option>
          </Select>
        </div>

        {/* Clear all */}
        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            {t("shop.clearAll", { defaultValue: "Clear all" })}
          </Button>
        ) : null}
      </div>
    </div>
  );
}