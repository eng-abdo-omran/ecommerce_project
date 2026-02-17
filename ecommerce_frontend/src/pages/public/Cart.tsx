/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../shared/components/ui/Button";
import { EmptyState } from "../../shared/components/ui/EmptyState";
import { Loader } from "../../shared/components/ui/Loader";

import { useAuthStore } from "../../store/auth.store";
import { useMyCart } from "../../features/cart/hooks/useMyCart";
import {
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "../../features/cart/hooks/useCartMutations";

import { resolvePublicImage } from "../../shared/utils/assets";

function formatMoney(value: number, locale = "ar-EG", currency = "EGP") {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export default function Cart() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "ar-EG";

  const token = useAuthStore((s) => s.token);
  const cartQ = useMyCart(Boolean(token));

  const updateMut = useUpdateCartItem();
  const removeMut = useRemoveCartItem();
  const clearMut = useClearCart();

  const items = cartQ.data?.data?.items ?? [];
  const total = cartQ.data?.data?.total ?? 0;

  const shipping = useMemo(
    () => (total >= 2000 ? 0 : total > 0 ? 50 : 0),
    [total],
  );
  const grandTotal = total + shipping;

  if (cartQ.isLoading)
    return (
      <Loader
        label={t("common.loading", { defaultValue: "جاري التحميل..." })}
      />
    );

  if (!items.length) {
    return (
      <div className="py-10">
        <EmptyState
          title={t("cart.empty", { defaultValue: "سلتك فارغة" })}
          description={t("cart.emptyDesc", {
            defaultValue: "ابدأ بإضافة منتجات من المتجر، وستظهر هنا.",
          })}
          actionLabel={t("nav.shop", { defaultValue: "المتجر" })}
          onAction={() => (window.location.href = "/shop")}
        />
        <div className="mt-4 flex justify-center">
          <Link to="/shop">
            <Button variant="secondary">
              {t("nav.shop", { defaultValue: "المتجر" })}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {t("cart.title", { defaultValue: "سلة التسوق" })}
          </h1>
          <p className="text-sm text-gray-500">
            {t("cart.itemsCount", { defaultValue: "عدد العناصر:" })}{" "}
            <span className="font-semibold text-gray-800">{items.length}</span>
          </p>
        </div>

        <Button
          variant="secondary"
          isLoading={clearMut.isPending}
          onClick={() => clearMut.mutate()}
        >
          {t("cart.clear", { defaultValue: "تفريغ السلة" })}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((it: any) => {
            const p = it.product ?? {};
            const price = Number(it.unit_price ?? p.price ?? 0);
            const qty = Number(it.quantity ?? 1);
            const lineTotal = Number(it.subtotal ?? price * qty);

            const imgSrc = resolvePublicImage(p?.main_image ?? p?.images ?? null);

            return (
              <div
                key={it.product_id}
                className="rounded-3xl border bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border bg-gray-50">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={p?.name ?? ""}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) =>
                          (e.currentTarget.src = "/placeholder.png")
                        }
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-xs text-gray-400">
                        {t("common.noImage", { defaultValue: "لا توجد صورة" })}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 line-clamp-1">
                          {p.name ?? `#${it.product_id}`}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {formatMoney(price, locale)}
                        </div>
                      </div>

                      <button
                        onClick={() => removeMut.mutate(it.product_id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        {t("actions.remove", { defaultValue: "حذف" })}
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-2xl border bg-white">
                        <button
                          className="h-10 w-10 grid place-items-center hover:bg-gray-50 rounded-s-2xl disabled:opacity-50"
                          onClick={() =>
                            updateMut.mutate({
                              productId: it.product_id,
                              quantity: Math.max(1, qty - 1),
                            })
                          }
                          disabled={updateMut.isPending || qty <= 1}
                        >
                          −
                        </button>
                        <div className="h-10 min-w-12 px-3 grid place-items-center text-sm font-semibold">
                          {qty}
                        </div>
                        <button
                          className="h-10 w-10 grid place-items-center hover:bg-gray-50 rounded-e-2xl"
                          onClick={() =>
                            updateMut.mutate({
                              productId: it.product_id,
                              quantity: qty + 1,
                            })
                          }
                          disabled={updateMut.isPending}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-sm text-gray-700">
                        {t("cart.lineTotal", { defaultValue: "الإجمالي:" })}{" "}
                        <span className="font-semibold text-gray-900">
                          {formatMoney(lineTotal, locale)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="rounded-3xl border bg-white p-5 shadow-sm h-fit">
          <h2 className="text-lg font-extrabold text-gray-900">
            {t("cart.summary", { defaultValue: "ملخص الطلب" })}
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-700">
              <span>
                {t("cart.subtotal", { defaultValue: "الإجمالي الفرعي" })}
              </span>
              <span className="font-semibold text-gray-900">
                {formatMoney(total, locale)}
              </span>
            </div>

            <div className="flex items-center justify-between text-gray-700">
              <span>{t("cart.shipping", { defaultValue: "الشحن" })}</span>
              <span className="font-semibold text-gray-900">
                {shipping === 0
                  ? t("cart.free", { defaultValue: "مجاني" })
                  : formatMoney(shipping, locale)}
              </span>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center justify-between text-gray-900">
              <span className="font-semibold">
                {t("cart.total", { defaultValue: "الإجمالي" })}
              </span>
              <span className="text-base font-extrabold">
                {formatMoney(grandTotal, locale)}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <Button
              className="w-full"
              onClick={() => alert("Checkout قريبًا 👌")}
            >
              {t("cart.checkout", { defaultValue: "إتمام الشراء" })}
            </Button>
            <Link to="/shop" className="block">
              <Button variant="secondary" className="w-full">
                {t("cart.continue", { defaultValue: "متابعة التسوق" })}
              </Button>
            </Link>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            {t("cart.note", {
              defaultValue: "ملاحظة: الدفع سيتم إضافته لاحقًا.",
            })}
          </p>
        </aside>
      </div>
    </div>
  );
}
