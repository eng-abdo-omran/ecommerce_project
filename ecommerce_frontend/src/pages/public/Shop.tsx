/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Loader } from "../../shared/components/ui/Loader";
import { EmptyState } from "../../shared/components/ui/EmptyState";
import { Pagination } from "../../shared/components/ui/Pagination";
import Modal from "../../shared/components/ui/Modal";
import { Button } from "../../shared/components/ui/Button";

import { useDebounce } from "../../shared/hooks/useDebounce";
import { useInterfaceProducts } from "../../features/storefront/hooks/useInterfaceProducts";
import { useInterfaceCategories } from "../../features/storefront/hooks/useInterfaceCategories";

import { ProductCard } from "../../features/storefront/components/ProductCard";
import { ShopFilters, type ShopFilterState } from "../../features/storefront/components/ShopFilters";
import { ActiveFilterChips } from "../../features/storefront/components/ActiveFilterChips";
import { ShopResultsToolbar } from "../../features/storefront/components/ShopResultsToolbar";

import type { InterfaceProduct, InterfaceCategory } from "../../features/storefront/types";
import { useCategoryCounts } from "../../features/storefront/hooks/useCategoryCounts";

function parseNum(v: string | null) {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function Shop() {
  const [params, setParams] = useSearchParams();

  const initial: ShopFilterState = useMemo(
    () => ({
      search: params.get("search") ?? "",
      category: parseNum(params.get("category")) ?? null,
      min: params.get("min") ?? "",
      max: params.get("max") ?? "",
      sort: (params.get("sort") as any) ?? "latest",
    }),
    []
  );

  const [filters, setFilters] = useState<ShopFilterState>(initial);
  const debouncedSearch = useDebounce(filters.search, 400);

  const [page, setPage] = useState(() => parseNum(params.get("page")) ?? 1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Categories
  const { data: catRes, isLoading: catLoading } = useInterfaceCategories();
  const categories: InterfaceCategory[] = catRes?.data ?? [];
  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));

  const categoryName = useMemo(() => {
    if (!filters.category) return "";
    return categories.find((c) => c.id === filters.category)?.name ?? "";
  }, [categories, filters.category]);

  // Sync URL
  useEffect(() => {
    const next = new URLSearchParams(params);

    next.set("page", String(page));

    if (filters.search.trim()) next.set("search", filters.search.trim());
    else next.delete("search");

    if (filters.category) next.set("category", String(filters.category));
    else next.delete("category");

    if (filters.min.trim()) next.set("min", filters.min.trim());
    else next.delete("min");

    if (filters.max.trim()) next.set("max", filters.max.trim());
    else next.delete("max");

    if (filters.sort && filters.sort !== "latest") next.set("sort", filters.sort);
    else next.delete("sort");

    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const minNum = parseNum(filters.min);
  const maxNum = parseNum(filters.max);

  // Products
  const { data, isPending, isFetching } = useInterfaceProducts({
    page,
    perPage: 12,
    search: debouncedSearch,
    category: filters.category ?? undefined,
    min: minNum ?? undefined,
    max: maxNum ?? undefined,
    sort: filters.sort,
  });

  const pagination = data?.data;
  const rawProducts: InterfaceProduct[] = pagination?.data ?? [];

  // Client fallback
  const products = useMemo(() => {
    let list = [...rawProducts];

    if (filters.category) {
      list = list.filter((p: any) => Number(p?.category?.id) === Number(filters.category));
    }

    const toPrice = (x: any) => Number(x?.price) || 0;
    if (minNum !== null) list = list.filter((p: any) => toPrice(p) >= minNum);
    if (maxNum !== null) list = list.filter((p: any) => toPrice(p) <= maxNum);

    switch (filters.sort) {
      case "price_asc":
        list.sort((a: any, b: any) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "price_desc":
        list.sort((a: any, b: any) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "name_asc":
        list.sort((a: any, b: any) => String(a.name).localeCompare(String(b.name)));
        break;
      case "name_desc":
        list.sort((a: any, b: any) => String(b.name).localeCompare(String(a.name)));
        break;
      default:
        break;
    }

    return list;
  }, [rawProducts, filters.category, filters.sort, minNum, maxNum]);

  // Category counts (accurate) — limit 10 for speed
  const { counts: categoryCounts } = useCategoryCounts({
    categoryIds: categories.map((c) => c.id),
    search: debouncedSearch || undefined,
    min: minNum ?? undefined,
    max: maxNum ?? undefined,
    sort: filters.sort,
    limit: 10,
  });

  // Chips
  const chips = useMemo(() => {
    const arr: { key: string; label: string; onRemove: () => void }[] = [];

    if (filters.search.trim()) {
      arr.push({
        key: "search",
        label: `بحث: ${filters.search.trim()}`,
        onRemove: () => {
          setFilters((s) => ({ ...s, search: "" }));
          setPage(1);
        },
      });
    }

    if (filters.category) {
      arr.push({
        key: "category",
        label: `تصنيف: ${categoryName || filters.category}`,
        onRemove: () => {
          setFilters((s) => ({ ...s, category: null }));
          setPage(1);
        },
      });
    }

    if (filters.min.trim() || filters.max.trim()) {
      arr.push({
        key: "price",
        label: `سعر: ${filters.min.trim() || "0"} - ${filters.max.trim() || "∞"}`,
        onRemove: () => {
          setFilters((s) => ({ ...s, min: "", max: "" }));
          setPage(1);
        },
      });
    }

    if (filters.sort !== "latest") {
      const sortLabel =
        filters.sort === "price_asc"
          ? "السعر ↑"
          : filters.sort === "price_desc"
          ? "السعر ↓"
          : filters.sort === "name_asc"
          ? "الاسم أ-ي"
          : "الاسم ي-أ";

      arr.push({
        key: "sort",
        label: `ترتيب: ${sortLabel}`,
        onRemove: () => {
          setFilters((s) => ({ ...s, sort: "latest" }));
          setPage(1);
        },
      });
    }

    return arr;
  }, [filters, categoryName]);

  const hasActiveFilters = chips.length > 0;

  function clearAll() {
    setFilters({ search: "", category: null, min: "", max: "", sort: "latest" });
    setPage(1);
  }

  const total = pagination?.total as number | undefined;
  const currentPage = pagination?.current_page ?? 1;
  const lastPage = pagination?.last_page ?? 1;

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">المتجر</h1>
          <p className="text-sm text-gray-500">{isFetching ? "..." : ""}</p>
        </div>

        <div className="flex gap-2 md:hidden">
          <Button variant="secondary" onClick={() => setMobileFiltersOpen(true)}>
            فلاتر
          </Button>
          {hasActiveFilters ? (
            <Button variant="ghost" onClick={clearAll}>
              مسح الكل
            </Button>
          ) : null}
        </div>
      </div>

      {/* ✅ Sticky wrapper: toolbar + chips */}
      <div className="sticky top-20 z-30 space-y-3 bg-gray-50/85 backdrop-blur py-2">
        <ShopResultsToolbar
          total={total}
          page={currentPage}
          lastPage={lastPage}
          sort={filters.sort}
          onSortChange={(v) => {
            setFilters((s) => ({ ...s, sort: v }));
            setPage(1);
          }}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          onClearAll={clearAll}
          hasActiveFilters={hasActiveFilters}
        />

        <ActiveFilterChips chips={chips} onClearAll={clearAll} />
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* ✅ Sticky sidebar on desktop */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            {catLoading ? (
              <div className="rounded-3xl border bg-white p-4 shadow-sm">
                <Loader label="جاري التحميل..." />
              </div>
            ) : (
              <ShopFilters
                value={filters}
                categories={categoryOptions}
                categoryCounts={categoryCounts}
                onChange={(next) => {
                  setFilters(next);
                  setPage(1);
                }}
                onResetAll={clearAll}
              />
            )}
          </div>
        </aside>

        {/* Grid */}
        <main className="lg:col-span-9 space-y-4">
          {isPending && !data ? (
            <Loader label="جاري التحميل..." />
          ) : products.length === 0 ? (
            <EmptyState title="لا توجد منتجات" description="جرّب تغيير الفلاتر أو مسحها." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <Pagination page={currentPage} lastPage={lastPage} onPageChange={(p) => setPage(p)} />

          {hasActiveFilters ? (
            <p className="text-xs text-gray-500">
              تلميح: تقدر تمسح فلتر واحد من الـChips بالأعلى بدل مسح الكل.
            </p>
          ) : null}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      <Modal open={mobileFiltersOpen} title="الفلاتر" onClose={() => setMobileFiltersOpen(false)}>
        {catLoading ? (
          <Loader label="جاري التحميل..." />
        ) : (
          <ShopFilters
            value={filters}
            categories={categoryOptions}
            categoryCounts={categoryCounts}
            onChange={(next) => {
              setFilters(next);
              setPage(1);
            }}
            onResetAll={clearAll}
          />
        )}

        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
            تطبيق
          </Button>
          <Button variant="secondary" className="flex-1" onClick={clearAll}>
            مسح الكل
          </Button>
        </div>
      </Modal>
    </div>
  );
}