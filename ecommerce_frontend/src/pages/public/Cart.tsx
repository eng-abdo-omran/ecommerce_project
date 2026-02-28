/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
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
import { getApiErrorMessage } from "../../shared/utils/error";

type CartOption =
  | { variant_id: number; value_id: number }
  | {
      variant_id: number;
      value_id: number;
      variant_name?: string;
      value?: string;
      value_name?: string;
    };

type CartItemUI = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price?: number;
  subtotal?: number;
  options?: CartOption[] | null;
  product?: any;
};

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

function renderOptions(opts?: CartOption[] | null) {
  if (!opts || !Array.isArray(opts) || opts.length === 0) return null;

  const chips = opts.map((o, idx) => {
    const vName = (o as any).variant_name;
    const valName = (o as any).value_name ?? (o as any).value;

    const label =
      vName && valName
        ? `${vName}: ${valName}`
        : `V#${(o as any).variant_id} → ${`ID#${(o as any).value_id}`}`;

    return (
      <span
        key={`${(o as any).variant_id}-${(o as any).value_id}-${idx}`}
        className="
          inline-flex items-center rounded-full
          border border-gray-200 bg-gray-50
          px-2.5 py-1 text-xs text-gray-700
          shadow-sm
        "
      >
        {label}
      </span>
    );
  });

  return <div className="mt-2 flex flex-wrap gap-2">{chips}</div>;
}

export default function Cart() {
  const nav = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "ar-EG";

  const token = useAuthStore((s) => s.token);
  const cartQ = useMyCart(Boolean(token));

  const updateMut = useUpdateCartItem();
  const removeMut = useRemoveCartItem();
  const clearMut = useClearCart();

  const items: CartItemUI[] = (cartQ.data?.data?.items ?? []) as any;
  const total = Number(cartQ.data?.data?.total ?? 0);

  // ⚠️ لو عندك Free shipping فوق 2000، لازم الباك يطبق نفس القاعدة في checkout
  const shipping = useMemo(() => (total >= 2000 ? 0 : total > 0 ? 50 : 0), [total]);
  const grandTotal = total + shipping;

  const isBusy = updateMut.isPending || removeMut.isPending || clearMut.isPending;

  if (cartQ.isLoading) {
    return <Loader label={t("common.loading", { defaultValue: "جاري التحميل..." })} />;
  }

  if (cartQ.isError) {
    return (
      <div className="py-10">
        <EmptyState
          title="حدث خطأ أثناء تحميل السلة"
          description={getApiErrorMessage(cartQ.error)}
          actionLabel="إعادة المحاولة"
          onAction={() => cartQ.refetch()}
        />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="py-10">
        <EmptyState
          title={t("cart.empty", { defaultValue: "سلتك فارغة" })}
          description={t("cart.emptyDesc", {
            defaultValue: "ابدأ بإضافة منتجات من المتجر، وستظهر هنا.",
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
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {t("cart.title", { defaultValue: "سلة التسوق" })}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("cart.itemsCount", { defaultValue: "عدد العناصر:" })}{" "}
            <span className="font-semibold text-gray-800">{items.length}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            isLoading={clearMut.isPending}
            onClick={() => clearMut.mutate()}
            disabled={isBusy}
          >
            {t("cart.clear", { defaultValue: "تفريغ السلة" })}
          </Button>

          <Button variant="primary" onClick={() => nav("/checkout")} disabled={isBusy}>
            إتمام الشراء
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((it) => {
            const p = it.product ?? {};
            const price = Number(it.unit_price ?? p.price ?? 0);
            const qty = Number(it.quantity ?? 1);
            const lineTotal = Number(it.subtotal ?? price * qty);

            const imgSrc = resolvePublicImage(p?.main_image ?? p?.images ?? null);

            return (
              <div
                key={it.id}
                className="
                  rounded-3xl border bg-white p-4 shadow-sm
                  transition
                  hover:shadow-md hover:border-gray-300
                "
              >
                <div className="flex gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border bg-gray-50">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={p?.name ?? ""}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
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

                        {/* Variants options */}
                        {renderOptions(it.options)}

                        <div className="mt-2 text-sm text-gray-600">
                          {formatMoney(price, locale)}
                        </div>
                      </div>

                      {/*  Remove button (Stylish) */}
                      <button
                        onClick={() => removeMut.mutate(it.id)}
                        disabled={isBusy}
                        type="button"
                        className="
                          inline-flex items-center gap-2
                          rounded-2xl border border-red-200
                          bg-red-50/40 px-3 py-2
                          text-sm font-semibold text-red-700
                          transition-all duration-200
                          hover:bg-red-50 hover:border-red-300 hover:shadow-sm
                          active:scale-[0.98]
                          focus:outline-none focus:ring-2 focus:ring-red-500/20
                          disabled:opacity-60 disabled:cursor-not-allowed
                        "
                        title={t("actions.remove", { defaultValue: "حذف" })}
                      >
                        {/* icon */}
                        <span>{t("actions.remove", { defaultValue: "حذف" })}</span>
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      {/* Qty Control (Premium hover) */}
                      <div
                        className="
                          inline-flex items-center rounded-2xl border bg-white
                          shadow-sm
                          overflow-hidden
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateMut.mutate({
                              itemId: it.id,
                              quantity: Math.max(1, qty - 1),
                            })
                          }
                          disabled={isBusy || qty <= 1}
                          className="
                            h-10 w-10 grid place-items-center
                            text-gray-700
                            transition-all duration-200
                            hover:bg-gray-50 hover:text-gray-900
                            active:bg-gray-100 active:scale-[0.96]
                            focus:outline-none focus:ring-2 focus:ring-black/10
                            disabled:opacity-50 disabled:cursor-not-allowed
                          "
                          aria-label="Decrease quantity"
                          title="تقليل الكمية"
                        >
                          <span className="text-lg font-bold">−</span>
                        </button>

                        <div className="h-10 min-w-12 px-3 grid place-items-center text-sm font-extrabold text-gray-900">
                          {qty}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            updateMut.mutate({
                              itemId: it.id,
                              quantity: qty + 1,
                            })
                          }
                          disabled={isBusy}
                          className="
                            h-10 w-10 grid place-items-center
                            text-gray-700
                            transition-all duration-200
                            hover:bg-gray-50 hover:text-gray-900
                            active:bg-gray-100 active:scale-[0.96]
                            focus:outline-none focus:ring-2 focus:ring-black/10
                            disabled:opacity-50 disabled:cursor-not-allowed
                          "
                          aria-label="Increase quantity"
                          title="زيادة الكمية"
                        >
                          <span className="text-lg font-bold">+</span>
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-sm text-gray-700">
                        {t("cart.lineTotal", { defaultValue: "الإجمالي:" })}{" "}
                        <span className="font-semibold text-gray-900">
                          {formatMoney(lineTotal, locale)}
                        </span>
                      </div>
                    </div>

                    {/* Optional: view product */}
                    {p?.id ? (
                      <div className="mt-3">
                        <button
                          onClick={() => nav(`/products/${p.id}`)}
                          className="
                            text-xs text-gray-500
                            hover:text-gray-900
                            transition
                          "
                          type="button"
                        >
                          عرض المنتج
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="rounded-3xl border bg-white p-5 shadow-sm h-fit space-y-4">
          <h2 className="text-lg font-extrabold text-gray-900">
            {t("cart.summary", { defaultValue: "ملخص الطلب" })}
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-700">
              <span>{t("cart.subtotal", { defaultValue: "الإجمالي الفرعي" })}</span>
              <span className="font-semibold text-gray-900">{formatMoney(total, locale)}</span>
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
              <span className="font-semibold">{t("cart.total", { defaultValue: "الإجمالي" })}</span>
              <span className="text-base font-extrabold">{formatMoney(grandTotal, locale)}</span>
            </div>

            <p className="text-xs text-gray-500">
              * الخصم (إن وجد) يتم حسابه في صفحة الدفع على السيرفر لضمان الدقة.
            </p>
          </div>

          <div className="space-y-2">
            <Button className="w-full" onClick={() => nav("/checkout")} disabled={isBusy}>
              إتمام الشراء
            </Button>

            <Link to="/shop" className="block">
              <Button variant="secondary" className="w-full" disabled={isBusy}>
                {t("cart.continue", { defaultValue: "متابعة التسوق" })}
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-500">
            {t("cart.note", { defaultValue: "ملاحظة: سيتم تأكيد السعر النهائي بعد التحقق من المخزون." })}
          </p>
        </aside>
      </div>

      {/* Mobile Sticky Summary */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="border-t bg-white/90 backdrop-blur p-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500">الإجمالي</div>
              <div className="text-base font-extrabold text-gray-900 truncate">
                {formatMoney(grandTotal, locale)}
              </div>
            </div>
            <Button
              className="h-11 px-4 rounded-2xl"
              onClick={() => nav("/checkout")}
              disabled={isBusy}
            >
              إتمام الشراء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
