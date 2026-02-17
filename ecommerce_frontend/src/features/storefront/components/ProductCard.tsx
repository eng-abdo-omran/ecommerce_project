import { useMemo } from "react";
import { Button } from "../../../shared/components/ui/Button";
import { resolvePublicImage } from "../../../shared/utils/assets";
import type { InterfaceProduct } from "../types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useAuthGate } from "../../auth/hooks/useAuthGate";
import { useAddToCart } from "../../cart/hooks/useCartMutations";
import { useToggleFavorite } from "../../favorites/hooks/useToggleFavorite";

export function ProductCard({ product }: { product: InterfaceProduct }) {
  const { t } = useTranslation();
  const requireAuth = useAuthGate();

  const addToCartMut = useAddToCart();
  const toggleFavMut = useToggleFavorite();

  const imgSrc = useMemo(() => {
    return resolvePublicImage(product.main_image) || resolvePublicImage(product.images);
  }, [product.main_image, product.images]);

  return (
    <div className="group rounded-3xl border bg-white p-3 shadow-sm hover:shadow-md transition">
      <div className="relative overflow-hidden rounded-2xl border bg-gray-50">
        <Link to={`/products/${product.id}`} className="block">
          <div className="aspect-square">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={product.name}
                className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-300"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            ) : (
              <div className="h-full w-full grid place-items-center text-xs text-gray-400">
                لا توجد صورة
              </div>
            )}
          </div>
        </Link>

        {/* Favorite badge */}
        <button
          onClick={() =>
            requireAuth(() => toggleFavMut.mutate(product.id))
          }
          className="absolute top-3 h-10 w-10 rounded-2xl grid place-items-center border bg-white/90 backdrop-blur hover:bg-white transition"
          style={{ insetInlineStart: "0.75rem" }}
          aria-label="toggle favorite"
          title="تبديل المفضلة"
        >
          <span className="text-gray-700">♥</span>
        </button>
      </div>

      <div className="p-2">
        <div className="mt-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/products/${product.id}`} className="block">
              <div className="font-semibold text-gray-900 line-clamp-1">{product.name}</div>
            </Link>
            <div className="mt-1 text-sm text-gray-600">{product.price}</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant="primary"
            size="sm"
            isLoading={addToCartMut.isPending}
            onClick={() =>
              requireAuth(() => addToCartMut.mutate({ product_id: product.id, quantity: 1 }))
            }
          >
            {t("actions.addToCart", { defaultValue: "أضف للسلة" })}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            isLoading={toggleFavMut.isPending}
            onClick={() => requireAuth(() => toggleFavMut.mutate(product.id))}
          >
            {t("actions.addFav", { defaultValue: "مفضلة" })}
          </Button>
        </div>
      </div>
    </div>
  );
}