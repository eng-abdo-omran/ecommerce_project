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

function toNumber(price: any) {
  const n = Number(price);
  return Number.isFinite(n) ? n : 0;
}
function formatMoney(value: number, locale = "ar-EG", currency = "EGP") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
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

  const images: any[] = Array.isArray(product?.images) ? product.images : [];
  const mainImageSrc = resolvePublicImage(product?.main_image) || resolvePublicImage(images);

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

  const variants: any[] = Array.isArray(product?.variants) ? product.variants : [];
  const [variantSelection, setVariantSelection] = useState<Record<string, string>>({});

  if (isLoading) return <Loader label={t("common.loading", { defaultValue: "جاري التحميل..." })} />;

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
    } catch { /* empty */ }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("تم نسخ الرابط ✅");
    } catch {
      window.prompt("انسخ الرابط:", url);
    }
  }

  function addToCart() {
    requireAuth(() =>
      addToCartMut.mutate({ product_id: product.id, quantity: qty })
    );
  }

  function toggleFav() {
    requireAuth(() => toggleFavMut.mutate(product.id));
  }

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-800">{t("nav.home", { defaultValue: "الرئيسية" })}</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-gray-800">{t("nav.shop", { defaultValue: "المتجر" })}</Link>
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

              <button
                onClick={toggleFav}
                className="h-11 w-11 rounded-2xl border bg-white hover:bg-gray-50 grid place-items-center"
                title="مفضلة"
              >
                <span className="text-gray-700">♥</span>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <div className="text-2xl font-extrabold text-gray-900">{formatMoney(price, locale)}</div>
              {compare > 0 && compare > price ? (
                <div className="text-sm text-gray-500 line-through">{formatMoney(compare, locale)}</div>
              ) : null}
              <div className="ms-auto">
                <Button variant="secondary" size="sm" onClick={handleShare}>مشاركة / نسخ الرابط</Button>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600 space-y-1">
              {product.sku ? (
                <div>SKU: <span className="text-gray-800 font-medium">{product.sku}</span></div>
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
                {variants.map((v, i) => {
                  const name = v?.name ?? `Option ${i + 1}`;
                  const values: any[] = Array.isArray(v?.values) ? v.values : [];
                  const key = String(name);

                  return (
                    <div key={key} className="space-y-2">
                      <div className="text-sm font-medium text-gray-800">{name}</div>
                      <div className="flex flex-wrap gap-2">
                        {values.map((val, j) => {
                          const label = val?.value ?? val?.name ?? `Value ${j + 1}`;
                          const selected = variantSelection[key] === String(label);
                          return (
                            <button
                              key={`${key}-${j}`}
                              onClick={() => setVariantSelection((s) => ({ ...s, [key]: String(label) }))}
                              className={`px-3 h-9 rounded-full border text-sm transition ${
                                selected ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Qty */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-gray-900">الكمية</div>
              <div className="inline-flex items-center rounded-2xl border bg-white">
                <button className="h-11 w-11 grid place-items-center hover:bg-gray-50 rounded-s-2xl disabled:opacity-50"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >−</button>
                <div className="h-11 min-w-14 px-3 grid place-items-center text-sm font-extrabold">{qty}</div>
                <button className="h-11 w-11 grid place-items-center hover:bg-gray-50 rounded-e-2xl"
                  onClick={() => setQty((q) => q + 1)}
                >+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button variant="primary" isLoading={addToCartMut.isPending} onClick={addToCart}>
                {t("actions.addToCart", { defaultValue: "أضف للسلة" })}
              </Button>
              <Button variant="secondary" isLoading={toggleFavMut.isPending} onClick={toggleFav}>
                {t("actions.addFav", { defaultValue: "مفضلة" })}
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
              <div className="text-xs text-gray-500">{t("cart.total", { defaultValue: "السعر" })}</div>
              <div className="text-base font-extrabold text-gray-900 truncate">{formatMoney(price, locale)}</div>
            </div>
            <Button className="h-11 px-4 rounded-2xl" isLoading={addToCartMut.isPending} onClick={addToCart}>
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
            <Button variant="secondary" size="sm">عرض المزيد</Button>
          </Link>
        </div>

        {relatedQuery.isLoading ? (
          <Loader label={t("common.loading", { defaultValue: "جاري التحميل..." })} />
        ) : relatedProducts.length === 0 ? (
          <EmptyState title="لا توجد منتجات مشابهة حالياً" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p: any) => (
              <Link key={p.id} to={`/products/${p.id}`} className="rounded-3xl border bg-white p-3 shadow-sm hover:shadow-md transition block">
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