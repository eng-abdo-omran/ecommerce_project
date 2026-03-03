import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../../../shared/components/ui/Input";
import { Select } from "../../../shared/components/ui/Select";
import { Button } from "../../../shared/components/ui/Button";

export type ShopFilterState = {
  search: string;
  category: number | null;
  min: string;
  max: string;
  sort: "latest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
};

export type CategoryOption = { id: number; name: string };

export function ShopFilters({
  value,
  categories,
  categoryCounts,
  onChange,
  onResetAll,
}: {
  value: ShopFilterState;
  categories: CategoryOption[];
  categoryCounts?: Record<number, number | undefined>;
  onChange: (next: ShopFilterState) => void;
  onResetAll: () => void;
}) {
  const { t } = useTranslation();

  const hasAny = useMemo(() => {
    return Boolean(
      value.search.trim() ||
        value.category ||
        value.min.trim() ||
        value.max.trim() ||
        value.sort !== "latest"
    );
  }, [value]);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="font-extrabold text-gray-900">
            {t("shop.filtersTitle", { defaultValue: "Filters" })}
          </div>
          <Button variant="ghost" size="sm" onClick={onResetAll} disabled={!hasAny}>
            {t("shop.clearAll", { defaultValue: "Clear all" })}
          </Button>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">
              {t("shop.filter.searchLabel", { defaultValue: "Search" })}
            </div>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => onChange({ ...value, search: "" })}
              disabled={!value.search.trim()}
              type="button"
            >
              {t("common.clear", { defaultValue: "Clear" })}
            </button>
          </div>

          <Input
            placeholder={t("common.search", { defaultValue: "Search products..." })}
            value={value.search}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
          />
        </div>

        {/* Category */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">
              {t("shop.filter.categoryLabel", { defaultValue: "Category" })}
            </div>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => onChange({ ...value, category: null })}
              disabled={!value.category}
              type="button"
            >
              {t("common.clear", { defaultValue: "Clear" })}
            </button>
          </div>

          <Select
            value={value.category ? String(value.category) : ""}
            onChange={(e) =>
              onChange({
                ...value,
                category: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">
              {t("shop.filter.allCategories", { defaultValue: "All categories" })}
            </option>
            {categories.map((c) => {
              const cnt = categoryCounts?.[c.id];
              const label =
                typeof cnt === "number"
                  ? t("shop.filter.categoryWithCount", {
                      defaultValue: "{{name}} ({{count}})",
                      name: c.name,
                      count: cnt,
                    })
                  : c.name;

              return (
                <option key={c.id} value={String(c.id)}>
                  {label}
                </option>
              );
            })}
          </Select>
        </div>

        {/* Price */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">
              {t("shop.filter.priceLabel", { defaultValue: "Price" })}
            </div>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => onChange({ ...value, min: "", max: "" })}
              disabled={!value.min.trim() && !value.max.trim()}
              type="button"
            >
              {t("common.clear", { defaultValue: "Clear" })}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              inputMode="numeric"
              placeholder={t("shop.filter.minPrice", { defaultValue: "Min price" })}
              value={value.min}
              onChange={(e) => onChange({ ...value, min: e.target.value })}
            />
            <Input
              inputMode="numeric"
              placeholder={t("shop.filter.maxPrice", { defaultValue: "Max price" })}
              value={value.max}
              onChange={(e) => onChange({ ...value, max: e.target.value })}
            />
          </div>
        </div>

        {/* Sort */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">
              {t("shop.filter.sortLabel", { defaultValue: "Sort" })}
            </div>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => onChange({ ...value, sort: "latest" })}
              disabled={value.sort === "latest"}
              type="button"
            >
              {t("common.clear", { defaultValue: "Clear" })}
            </button>
          </div>

          <Select
            value={value.sort}
            onChange={(e) =>
              onChange({ ...value, sort: e.target.value as ShopFilterState["sort"] })
            }
          >
            <option value="latest">
              {t("shop.sort.latest", { defaultValue: "Latest" })}
            </option>
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
      </div>

      <div className="rounded-3xl border bg-white p-4 shadow-sm text-xs text-gray-600">
        {t("shop.shareHint", {
          defaultValue: "💡 You can share the shop link and keep the same active filters (Query String).",
        })}
      </div>
    </div>
  );
}