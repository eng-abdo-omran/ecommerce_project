/* eslint-disable react-hooks/use-memo */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Button } from "../../../shared/components/ui/Button";
import { resolvePublicImage } from "../../../shared/utils/assets";
import type { InterfaceProduct } from "../types";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuthGate } from "../../auth/hooks/useAuthGate";
import { useAddToCart } from "../../cart/hooks/useCartMutations";
import { useToggleFavorite } from "../../favorites/hooks/useToggleFavorite";
import { useFavoritesStore } from "../../../store/favorites.store";

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

/**
 *  Detect variants (احترافي + مرن)
 * - لو list endpoint بيرجع variants array
 * - أو variants_count / has_variants
 * - لو مش متاح: "unknown" ونخلي الزر يودّي للتفاصيل كحل آمن
 */
function productHasVariants(p: any): boolean | "unknown" {
  if (Array.isArray(p?.variants)) return p.variants.length > 0;
  if (typeof p?.variants_count === "number") return p.variants_count > 0;
  if (typeof p?.has_variants === "boolean") return p.has_variants;
  return "unknown";
}

export function ProductCard({ product }: { product: InterfaceProduct }) {
  const { t } = useTranslation();
  const requireAuth = useAuthGate();
  const nav = useNavigate();

  const addToCartMut = useAddToCart();
  const toggleFavMut = useToggleFavorite();

  //  source of truth للمفضلة من الستورد (بيفضل صح بعد refresh)
  const fav = useFavoritesStore((s) => s.has((product as any).id));
  const toggleLocal = useFavoritesStore((s) => s.toggle);

  const imgSrc = useMemo(() => {
    return resolvePublicImage((product as any).main_image) || resolvePublicImage((product as any).images);
  }, [(product as any).main_image, (product as any).images]);

  const hasVariants = productHasVariants(product);

  // Busy state
  const isBusy = addToCartMut.isPending || toggleFavMut.isPending;

  function onToggleFavorite() {
    requireAuth(() => {
      const id = (product as any).id;

      // optimistic: نبدّل فورًا في الستورد
      const next = !fav;
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

  function onAddToCart() {
    requireAuth(() => {
      const id = (product as any).id;

      //  لو له variants أو unknown => يروح للتفاصيل لاختيار الخيارات
      if (hasVariants === true || hasVariants === "unknown") {
        toast(t("cart.chooseOptionsHint", { defaultValue: "اختر الخيارات أولاً (لون/مقاس)..." }), {
          icon: "🧩",
        });
        nav(`/products/${id}`);
        return;
      }

      //  مفيش variants => add مباشرة
      addToCartMut.mutate(
        { product_id: id, quantity: 1 } as any,
        {
          onSuccess: () => toast.success(t("cart.added", { defaultValue: "تمت الإضافة إلى السلة" })),
          onError: () => toast.error(t("cart.addFailed", { defaultValue: "تعذر إضافة المنتج للسلة" })),
        }
      );
    });
  }

  return (
    <div
      className="
        group rounded-3xl border bg-white p-3 shadow-sm
        transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300
      "
    >
      <div className="relative overflow-hidden rounded-2xl border bg-gray-50">
        <Link to={`/products/${(product as any).id}`} className="block">
          <div className="aspect-square">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={(product as any).name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            ) : (
              <div className="h-full w-full grid place-items-center text-xs text-gray-400">
                {t("common.noImage", { defaultValue: "لا توجد صورة" })}
              </div>
            )}
          </div>
        </Link>

        {/*  Favorite badge (premium hover + ثابت للموبايل) */}
        <button
          onClick={onToggleFavorite}
          disabled={toggleFavMut.isPending}
          className="
            absolute top-3
            h-10 w-10 rounded-2xl
            grid place-items-center
            border bg-white/90 backdrop-blur
            transition-all duration-200
            hover:bg-white hover:shadow-sm hover:border-gray-300
            active:scale-[0.97]
            focus:outline-none focus:ring-2 focus:ring-black/10
            disabled:opacity-60 disabled:cursor-not-allowed
          "
          style={{ insetInlineStart: "0.75rem" }}
          aria-label="toggle favorite"
          title={fav ? t("favorites.remove", { defaultValue: "إزالة من المفضلة" }) : t("favorites.add", { defaultValue: "إضافة للمفضلة" })}
        >
          <HeartIcon
            filled={fav}
            className={`
              h-[18px] w-[18px]
              ${fav ? "text-red-600" : "text-gray-700"}
              transition-all duration-200
              ${fav ? "scale-105" : ""}
            `}
          />
        </button>

        {/*  Badge لمنتجات فيها variants */}
        {(hasVariants === true || hasVariants === "unknown") ? (
          <div className="absolute bottom-2 left-2 right-2 flex justify-center">
            <span
              className="
                inline-flex items-center gap-2
                rounded-full border bg-white/90 backdrop-blur
                px-3 py-1 text-xs text-gray-700
                shadow-sm
              "
              title={t("product.hasOptions", { defaultValue: "هذا المنتج له خيارات مثل اللون/المقاس" })}
            >
              <span className="h-2 w-2 rounded-full bg-gray-700" />
              {t("product.hasVariants", { defaultValue: "له خيارات" })}
            </span>
          </div>
        ) : null}
      </div>

      <div className="p-2">
        <div className="mt-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/products/${(product as any).id}`} className="block">
              <div className="font-semibold text-gray-900 line-clamp-1">{(product as any).name}</div>
            </Link>
            <div className="mt-1 text-sm text-gray-600">{(product as any).price}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant="primary"
            size="sm"
            isLoading={addToCartMut.isPending}
            onClick={onAddToCart}
            disabled={isBusy}
            className="transition-all duration-200 hover:shadow-sm active:scale-[0.99]"
            title={
              (hasVariants === true || hasVariants === "unknown")
                ? t("actions.chooseOptions", { defaultValue: "اختر الخيارات" })
                : t("actions.addToCart", { defaultValue: "أضف للسلة" })
            }
          >
            {(hasVariants === true || hasVariants === "unknown")
              ? t("actions.chooseOptions", { defaultValue: "اختر الخيارات" })
              : t("actions.addToCart", { defaultValue: "أضف للسلة" })}
          </Button>

          <Button
            variant={fav ? "danger" : "secondary"}
            size="sm"
            isLoading={toggleFavMut.isPending}
            onClick={onToggleFavorite}
            disabled={isBusy}
            className="transition-all duration-200 hover:shadow-sm active:scale-[0.99]"
          >
            {fav
              ? t("actions.removeFav", { defaultValue: "إزالة" })
              : t("actions.addFav", { defaultValue: "مفضلة" })}
          </Button>
        </div>
      </div>
    </div>
  );
}