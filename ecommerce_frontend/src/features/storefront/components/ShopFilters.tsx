import { useMemo } from "react";
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
          <div className="font-extrabold text-gray-900">الفلاتر</div>
          <Button variant="ghost" size="sm" onClick={onResetAll} disabled={!hasAny}>
            مسح الكل
          </Button>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">بحث</div>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => onChange({ ...value, search: "" })}
              disabled={!value.search.trim()}
            >
              مسح
            </button>
          </div>

          <Input
            placeholder="ابحث عن منتج..."
            value={value.search}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
          />
        </div>

        {/* Category */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">التصنيف</div>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => onChange({ ...value, category: null })}
              disabled={!value.category}
            >
              مسح
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
            <option value="">كل التصنيفات</option>
            {categories.map((c) => {
              const cnt = categoryCounts?.[c.id];
              const label = typeof cnt === "number" ? `${c.name} (${cnt})` : c.name;
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
            <div className="text-sm font-semibold text-gray-900">السعر</div>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => onChange({ ...value, min: "", max: "" })}
              disabled={!value.min.trim() && !value.max.trim()}
            >
              مسح
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              inputMode="numeric"
              placeholder="أقل سعر"
              value={value.min}
              onChange={(e) => onChange({ ...value, min: e.target.value })}
            />
            <Input
              inputMode="numeric"
              placeholder="أعلى سعر"
              value={value.max}
              onChange={(e) => onChange({ ...value, max: e.target.value })}
            />
          </div>
        </div>

        {/* Sort */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">الترتيب</div>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => onChange({ ...value, sort: "latest" })}
              disabled={value.sort === "latest"}
            >
              مسح
            </button>
          </div>

          <Select
            value={value.sort}
            onChange={(e) =>
              onChange({ ...value, sort: e.target.value as ShopFilterState["sort"] })
            }
          >
            <option value="latest">الأحدث</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
            <option value="name_asc">الاسم: أ-ي</option>
            <option value="name_desc">الاسم: ي-أ</option>
          </Select>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-4 shadow-sm text-xs text-gray-600">
        💡 تقدر تشارك لينك المتجر وهو نفس الفلاتر شغالة (Query String).
      </div>
    </div>
  );
}