/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../../shared/components/ui/EmptyState";
import { Loader } from "../../shared/components/ui/Loader";
import { Pagination } from "../../shared/components/ui/Pagination";

import { useAuthStore } from "../../store/auth.store";
import { useMyFavorites } from "../../features/favorites/hooks/useMyFavorites";
import { normalizeFavoriteProducts } from "../../features/favorites/lib/normalize";
import { ProductCard } from "../../features/storefront/components/ProductCard";

export default function Favorites() {
  const { t } = useTranslation();
  const token = useAuthStore((s) => s.token);

  const [page, setPage] = useState(1);
  const perPage = 12;

  const { data, isLoading, isFetching } = useMyFavorites({ page, perPage }, Boolean(token));

  const pagination = data?.data;
  const raw = pagination?.data ?? [];
  const products = normalizeFavoriteProducts(raw);

  if (isLoading) return <Loader label={t("common.loading", { defaultValue: "جاري التحميل..." })} />;

  if (!products.length) {
    return (
      <div className="py-10">
        <EmptyState
          title={t("favorites.empty", { defaultValue: "لا توجد منتجات في المفضلة" })}
          description={t("favorites.emptyDesc", { defaultValue: "ابدأ بإضافة منتجات للمفضلة من المتجر." })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("favorites.title", { defaultValue: "المفضلة" })}</h1>
          <p className="text-sm text-gray-500">
            {t("favorites.count", { defaultValue: "عدد المنتجات:" })}{" "}
            <span className="font-semibold">{pagination?.total ?? products.length}</span>
            {isFetching ? " — ..." : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <Pagination
        page={pagination?.current_page ?? page}
        lastPage={pagination?.last_page ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}