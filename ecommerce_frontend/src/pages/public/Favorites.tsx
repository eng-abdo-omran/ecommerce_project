/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { EmptyState } from "../../shared/components/ui/EmptyState";
import { Loader } from "../../shared/components/ui/Loader";
import { Pagination } from "../../shared/components/ui/Pagination";
import { Button } from "../../shared/components/ui/Button";

import { useAuthStore } from "../../store/auth.store";
import { useMyFavorites } from "../../features/favorites/hooks/useMyFavorites";
import { normalizeFavoriteProducts } from "../../features/favorites/lib/normalize";
import { ProductCard } from "../../features/storefront/components/ProductCard";
import { getApiErrorMessage } from "../../shared/utils/error";

export default function Favorites() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const token = useAuthStore((s) => s.token);

  const [page, setPage] = useState(1);
  const perPage = 12;

  const { data, isLoading, isFetching, isError, error, refetch } = useMyFavorites(
    { page, perPage },
    Boolean(token),
  ); // hook موجود عندك [1](https://fcibuedu-my.sharepoint.com/personal/abdelrahmanmohammed_fci_bu_edu_eg/Documents/Microsoft%20Copilot%20Chat%20Files/%D9%85%D9%84%D9%81%D8%A7%D8%AA%20%D8%A7%D9%84%D9%80%20Frontend.txt)

  const pagination = data?.data;
  const raw = pagination?.data ?? [];

  // memo لتقليل re-render
  const products = useMemo(() => normalizeFavoriteProducts(raw), [raw]); // normalize موجود عندك [1](https://fcibuedu-my.sharepoint.com/personal/abdelrahmanmohammed_fci_bu_edu_eg/Documents/Microsoft%20Copilot%20Chat%20Files/%D9%85%D9%84%D9%81%D8%A7%D8%AA%20%D8%A7%D9%84%D9%80%20Frontend.txt)
  const totalCount = pagination?.total ?? products.length;

  // Loading أول مرة
  if (isLoading) {
    return <Loader label={t("common.loading", { defaultValue: "جاري التحميل..." })} />; // Loader موجود عندك [1](https://fcibuedu-my.sharepoint.com/personal/abdelrahmanmohammed_fci_bu_edu_eg/Documents/Microsoft%20Copilot%20Chat%20Files/%D9%85%D9%84%D9%81%D8%A7%D8%AA%20%D8%A7%D9%84%D9%80%20Frontend.txt)
  }

  // Error state احترافي
  if (isError) {
    return (
      <div className="py-10">
        <EmptyState
          title={t("common.error", { defaultValue: "حدث خطأ" })}
          description={getApiErrorMessage(error)}
          actionLabel={t("common.retry", { defaultValue: "إعادة المحاولة" })}
          onAction={() => refetch()}
        />
      </div>
    );
  }

  // Empty
  if (!products.length) {
    return (
      <div className="py-10">
        <EmptyState
          title={t("favorites.empty", { defaultValue: "لا توجد منتجات في المفضلة" })}
          description={t("favorites.emptyDesc", {
            defaultValue: "ابدأ بإضافة منتجات للمفضلة من المتجر.",
          })}
          actionLabel={t("nav.shop", { defaultValue: "المتجر" })}
          onAction={() => nav("/shop")}
        />
        <div className="mt-4 flex justify-center">
          <Link to="/shop">
            <Button variant="secondary">{t("nav.shop", { defaultValue: "المتجر" })}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      {/* Header / Summary */}
      <div
        className="
          rounded-3xl border bg-white p-5 shadow-sm
          flex flex-col gap-3 md:flex-row md:items-end md:justify-between
        "
      >
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {t("favorites.title", { defaultValue: "المفضلة" })}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {t("favorites.count", { defaultValue: "عدد المنتجات:" })}{" "}
            <span className="font-semibold text-gray-900">{totalCount}</span>
            {isFetching ? (
              <span className="ms-2 inline-flex items-center gap-2 text-xs text-gray-500">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                {t("common.updating", { defaultValue: "جارِ التحديث..." })}
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => nav("/shop")}>
            {t("nav.shop", { defaultValue: "المتجر" })}
          </Button>
          <Button onClick={() => nav("/cart")}>
            {t("nav.cart", { defaultValue: "السلة" })}
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div
        className="
          grid grid-cols-2 gap-4
          md:grid-cols-3 lg:grid-cols-4
        "
      >
        {products.map((p: any) => (
          <div
            key={p.id}
            className="
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-md
            "
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        page={pagination?.current_page ?? page}
        lastPage={pagination?.last_page ?? 1}
        onPageChange={(next) => {
          // UX: اسكرول لفوق خفيف لما يغير الصفحة
          setPage(next);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Mobile Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="border-t bg-white/90 backdrop-blur p-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500">
                {t("favorites.title", { defaultValue: "المفضلة" })}
              </div>
              <div className="text-base font-extrabold text-gray-900 truncate">
                {t("favorites.count", { defaultValue: "عدد المنتجات:" })} {totalCount}
              </div>
            </div>
            <Button className="h-11 px-4 rounded-2xl" onClick={() => nav("/shop")}>
              {t("nav.shop", { defaultValue: "المتجر" })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}