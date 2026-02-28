/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { Button } from "../../shared/components/ui/Button";
import { Loader } from "../../shared/components/ui/Loader";
import { EmptyState } from "../../shared/components/ui/EmptyState";
import Modal from "../../shared/components/ui/Modal";

import { resolvePublicImage } from "../../shared/utils/assets";
import { useInterfaceProduct } from "../../features/storefront/hooks/useInterfaceProduct";
import { useInterfaceProducts } from "../../features/storefront/hooks/useInterfaceProducts";

import { useAuthGate } from "../../features/auth/hooks/useAuthGate";
import { useAddToCart } from "../../features/cart/hooks/useCartMutations";
import { useToggleFavorite } from "../../features/favorites/hooks/useToggleFavorite";
import { useFavoritesStore } from "../../store/favorites.store"; //  جديد

function toNumber(price: any) {
  const n = Number(price);
  return Number.isFinite(n) ? n : 0;
}

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

type VariantSelectionState = Record<number, number>; // variant_id => value_id

/**  Heart Icon SVG: ثابت المقاس (مش بيكبر في الموبايل) */
function HeartIcon({
  filled,
  className = "",
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M12 21s-7.2-4.35-9.6-8.55C.6 9 2.4 5.7 6 5.1c1.8-.3 3.6.6 4.8 2.1C12 5.7 13.8 4.8 15.6 5.1 19.2 5.7 21 9 21.6 12.45 19.2 16.65 12 21 12 21z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductDetails() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "ar-EG";

  const { id } = useParams();
  const productId = Number(id);

  const requireAuth = useAuthGate();
  const addToCartMut = useAddToCart();
  const toggleFavMut = useToggleFavorite();

  const [qty, setQty] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openSection, setOpenSection] = useState<"details" | "features" | null>(null);

  const { data, isLoading, isError } = useInterfaceProduct(productId);
  const product: any = data?.data;

  //  Favorites: source of truth من store (يظل صحيح بعد refresh)
  const fav = useFavoritesStore((s) => s.has(productId));
  const toggleLocal = useFavoritesStore((s) => s.toggle);

  // الصور
  const images: any[] = Array.isArray(product?.images) ? product.images : [];
  const mainImageSrc =
    resolvePublicImage(product?.main_image) ||
    resolvePublicImage(product?.images) ||
    resolvePublicImage(images);

  const activeImageSrc = useMemo(() => {
    if (images.length > 0) {
      const chosen = images[activeIndex] ?? images[0];
      return resolvePublicImage(chosen) || mainImageSrc;
    }
    return mainImageSrc;
  }, [images, activeIndex, mainImageSrc]);

  const categoryId = product?.category?.id ? Number(product.category.id) : undefined;
  const relatedQuery = useInterfaceProducts({ page: 1, perPage: 8, category: categoryId });
  const relatedProducts: any[] = (relatedQuery.data?.data?.data ?? []).filter((p: any) => p?.id !== productId);

  // variants
  const variants: any[] = Array.isArray(product?.variants) ? product.variants : [];

  // selection بالـ IDs
  const [variantSelection, setVariantSelection] = useState<VariantSelectionState>({});

  // هل اختار كل الـ variants؟
  const allVariantsSelected = useMemo(() => {
    if (!variants.length) return true;
    return variants.every((v: any) => {
      const vid = Number(v?.id);
      return vid && variantSelection[vid];
    });
  }, [variants, variantSelection]);

  if (isLoading) {
    return <Loader label={t("common.loading", { defaultValue: "جاري التحميل..." })} />;
  }

  if (isError || !product) {
    return (
      <EmptyState
        title={t("product.notFound", { defaultValue: "تعذر تحميل المنتج" })}
        description={t("product.notFoundDesc", { defaultValue: "حاول مرة أخرى أو ارجع للمتجر." })}
        actionLabel={t("nav.shop", { defaultValue: "الذهاب للمتجر" })}
        onAction={() => (window.location.href = "/shop")}
      />
    );
  }

  const price = toNumber(product.price);
  const compare = toNumber(product.compare_price);

  async function handleShare() {
    const url = window.location.href;
    const title = product?.name ?? "Product";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      /* empty */
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("تم نسخ الرابط ");
    } catch {
      window.prompt("انسخ الرابط:", url);
    }
  }

  function buildOptionsPayload() {
    // [{variant_id, value_id}]
    const entries = Object.entries(variantSelection);
    return entries.map(([variant_id, value_id]) => ({
      variant_id: Number(variant_id),
      value_id: Number(value_id),
    }));
  }

  function addToCart() {
    requireAuth(() => {
      if (qty < 1) {
        toast.error("الكمية غير صحيحة");
        return;
      }
      if (!allVariantsSelected) {
        toast.error("من فضلك اختر كل الخيارات المطلوبة (مثل اللون/المقاس)");
        return;
      }

      const options = buildOptionsPayload();

      addToCartMut.mutate(
        {
          product_id: product.id,
          quantity: qty,
          options,
        } as any,
        {
          onSuccess: () => toast.success("تمت الإضافة إلى السلة"),
          onError: () => toast.error("تعذر إضافة المنتج للسلة"),
        }
      );
    });
  }

  //  Toggle Favorite (optimistic + rollback) باستخدام store
  function toggleFav() {
    requireAuth(() => {
      const id = product.id;
      const next = !fav;

      // optimistic
      toggleLocal(id);

      toggleFavMut.mutate(id, {
        onError: () => {
          // rollback
          toggleLocal(id);
          toast.error("تعذر تحديث المفضلة");
        },
        onSuccess: () => {
          toast.success(next ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة");
        },
      });
    });
  }

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-800">
          {t("nav.home", { defaultValue: "الرئيسية" })}
        </Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-gray-800">
          {t("nav.shop", { defaultValue: "المتجر" })}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* Gallery */}
        <div className="space-y-3 min-w-0">
          <div className="rounded-3xl border bg-white p-3 shadow-sm">
            <div className="aspect-square rounded-2xl overflow-hidden border bg-gray-50">
              {activeImageSrc ? (
                <img
                  src={activeImageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-zoom-in"
                  loading="lazy"
                  onClick={() => setZoomOpen(true)}
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-xs text-gray-400">
                  {t("common.noImage", { defaultValue: "لا توجد صورة" })}
                </div>
              )}
            </div>
          </div>

          {images.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
              {images.map((img, idx) => {
                const thumb = resolvePublicImage(img);
                const active = idx === activeIndex;
                return (
                  <button
                    key={img?.id ?? idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border overflow-hidden bg-gray-50 transition ${
                      active ? "ring-2 ring-black/20 border-black/30" : "hover:border-gray-300"
                    }`}
                    type="button"
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Details */}
        <div className="space-y-4 min-w-0">
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 break-words">
                {product.name}
              </h1>

              {/*  Favorite icon button (SVG + stateful) */}
              <button
                onClick={toggleFav}
                disabled={toggleFavMut.isPending}
                className="
                  h-11 w-11 rounded-2xl border bg-white
                  grid place-items-center
                  transition-all duration-200
                  hover:bg-gray-50 hover:shadow-sm hover:border-gray-300
                  active:scale-[0.98]
                  focus:outline-none focus:ring-2 focus:ring-black/10
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
                title={fav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                type="button"
              >
                <HeartIcon
                  filled={fav}
                  className={`h-[18px] w-[18px] ${fav ? "text-red-600" : "text-gray-700"} transition`}
                />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <div className="text-2xl font-extrabold text-gray-900">
                {formatMoney(price, locale)}
              </div>
              {compare > 0 && compare > price ? (
                <div className="text-sm text-gray-500 line-through">{formatMoney(compare, locale)}</div>
              ) : null}
              <div className="ms-auto">
                <Button variant="secondary" size="sm" onClick={handleShare}>
                  مشاركة / نسخ الرابط
                </Button>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600 space-y-1">
              {product.sku ? (
                <div>
                  SKU: <span className="text-gray-800 font-medium">{product.sku}</span>
                </div>
              ) : null}
              {product.category?.name ? (
                <div>
                  {t("product.category", { defaultValue: "التصنيف:" })}{" "}
                  <span className="text-gray-800 font-medium">{product.category.name}</span>
                </div>
              ) : null}
            </div>

            {product.description ? (
              <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>
            ) : null}

            {/* Variants */}
            {variants.length > 0 ? (
              <div className="mt-5 space-y-3">
                <div className="font-semibold text-gray-900">الخيارات</div>

                {variants.map((v: any, i: number) => {
                  const variantId = Number(v?.id);
                  const name = v?.name ?? `Option ${i + 1}`;
                  const values: any[] = Array.isArray(v?.values) ? v.values : [];

                  return (
                    <div key={variantId || name} className="space-y-2">
                      <div className="text-sm font-medium text-gray-800">{name}</div>

                      <div className="flex flex-wrap gap-2">
                        {values.map((val: any, j: number) => {
                          const valueId = Number(val?.id);
                          const label = val?.value ?? val?.name ?? `Value ${j + 1}`;
                          const selected = variantId && valueId && variantSelection[variantId] === valueId;

                          return (
                            <button
                              key={`${variantId}-${valueId || j}`}
                              onClick={() => {
                                if (!variantId || !valueId) return;
                                setVariantSelection((s) => ({ ...s, [variantId]: valueId }));
                              }}
                              className={`px-3 h-9 rounded-full border text-sm transition ${
                                selected
                                  ? "bg-black text-white border-black"
                                  : "bg-white hover:bg-gray-50 hover:border-gray-300"
                              }`}
                              type="button"
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {!allVariantsSelected ? (
                  <div className="text-xs text-red-600">
                    اختر كل الخيارات المطلوبة قبل الإضافة للسلة.
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Qty */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-gray-900">الكمية</div>

              <div className="inline-flex items-center rounded-2xl border bg-white shadow-sm overflow-hidden">
                <button
                  className="
                    h-11 w-11 grid place-items-center
                    transition-all duration-200
                    hover:bg-gray-50 active:bg-gray-100 active:scale-[0.97]
                    disabled:opacity-50
                  "
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  type="button"
                  title="تقليل"
                >
                  <span className="text-lg font-bold">−</span>
                </button>

                <div className="h-11 min-w-14 px-3 grid place-items-center text-sm font-extrabold">
                  {qty}
                </div>

                <button
                  className="
                    h-11 w-11 grid place-items-center
                    transition-all duration-200
                    hover:bg-gray-50 active:bg-gray-100 active:scale-[0.97]
                  "
                  onClick={() => setQty((q) => q + 1)}
                  type="button"
                  title="زيادة"
                >
                  <span className="text-lg font-bold">+</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                variant="primary"
                isLoading={addToCartMut.isPending}
                onClick={addToCart}
                disabled={!allVariantsSelected}
              >
                {t("actions.addToCart", { defaultValue: "أضف للسلة" })}
              </Button>

              {/*  Favorite button reflects state */}
              <Button
                variant={fav ? "danger" : "secondary"}
                isLoading={toggleFavMut.isPending}
                onClick={toggleFav}
              >
                {fav
                  ? t("actions.removeFav", { defaultValue: "إزالة" })
                  : t("actions.addFav", { defaultValue: "مفضلة" })}
              </Button>
            </div>
          </div>

          {/* Accordions */}
          {product.details || product.features ? (
            <div className="rounded-3xl border bg-white p-5 shadow-sm space-y-3">
              {product.details ? (
                <div className="border rounded-2xl overflow-hidden">
                  <button
                    className="w-full px-4 py-3 flex items-center justify-between text-start font-semibold"
                    onClick={() => setOpenSection((s) => (s === "details" ? null : "details"))}
                    type="button"
                  >
                    <span>التفاصيل</span>
                    <span className="text-gray-400">{openSection === "details" ? "−" : "+"}</span>
                  </button>
                  {openSection === "details" ? (
                    <div className="px-4 pb-4 text-sm md:text-[15px] text-gray-700 whitespace-pre-line">
                      {product.details}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {product.features ? (
                <div className="border rounded-2xl overflow-hidden">
                  <button
                    className="w-full px-4 py-3 flex items-center justify-between text-start font-semibold"
                    onClick={() => setOpenSection((s) => (s === "features" ? null : "features"))}
                    type="button"
                  >
                    <span>المميزات</span>
                    <span className="text-gray-400">{openSection === "features" ? "−" : "+"}</span>
                  </button>
                  {openSection === "features" ? (
                    <div className="px-4 pb-4 text-sm md:text-[15px] text-gray-700 whitespace-pre-line">
                      {product.features}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Zoom Modal */}
      <Modal open={zoomOpen} title="معاينة الصورة" onClose={() => setZoomOpen(false)}>
        <div className="rounded-2xl border bg-gray-50 overflow-hidden">
          <img
            src={activeImageSrc}
            alt={product.name}
            className="w-full h-auto object-contain"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          />
        </div>
      </Modal>

      {/* Mobile Sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <div className="border-t bg-white/90 backdrop-blur p-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500">
                {t("cart.total", { defaultValue: "السعر" })}
              </div>
              <div className="text-base font-extrabold text-gray-900 truncate">
                {formatMoney(price, locale)}
              </div>
            </div>
            <Button
              className="h-11 px-4 rounded-2xl"
              isLoading={addToCartMut.isPending}
              onClick={addToCart}
              disabled={!allVariantsSelected}
            >
              {t("actions.addToCart", { defaultValue: "أضف للسلة" })}
            </Button>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-extrabold text-gray-900">منتجات مشابهة</h2>
          <Link to="/shop">
            <Button variant="secondary" size="sm">
              عرض المزيد
            </Button>
          </Link>
        </div>

        {relatedQuery.isLoading ? (
          <Loader label={t("common.loading", { defaultValue: "جاري التحميل..." })} />
        ) : relatedProducts.length === 0 ? (
          <EmptyState title="لا توجد منتجات مشابهة حالياً" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p: any) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="rounded-3xl border bg-white p-3 shadow-sm hover:shadow-md transition block"
              >
                <div className="aspect-square rounded-2xl border bg-gray-50 overflow-hidden">
                  <img
                    src={resolvePublicImage(p.main_image) || resolvePublicImage(p.images)}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                </div>
                <div className="mt-3 font-semibold text-gray-900 line-clamp-1">{p.name}</div>
                <div className="mt-1 text-sm text-gray-600">{p.price}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}