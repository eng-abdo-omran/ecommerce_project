/* eslint-disable @typescript-eslint/no-explicit-any */
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
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-3xl border bg-white p-4 shadow-sm">
      {/* Results */}
      <div className="text-sm text-gray-700">
        <span className="font-semibold text-gray-900">النتائج:</span>{" "}
        {typeof total === "number" ? (
          <>
            <span className="font-semibold">{total}</span>{" "}
            <span className="text-gray-500">منتج</span>
          </>
        ) : (
          <span className="text-gray-500">—</span>
        )}
        <span className="mx-2 text-gray-300">|</span>
        <span className="text-gray-500">
          صفحة <span className="font-semibold text-gray-900">{page}</span> من{" "}
          <span className="font-semibold text-gray-900">{lastPage}</span>
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
          فلاتر
        </Button>

        {/* Sort */}
        <div className="min-w-[220px]">
          <Select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="latest">الأحدث</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
            <option value="name_asc">الاسم: أ-ي</option>
            <option value="name_desc">الاسم: ي-أ</option>
          </Select>
        </div>

        {/* Clear all */}
        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            مسح الكل
          </Button>
        ) : null}
      </div>
    </div>
  );
}