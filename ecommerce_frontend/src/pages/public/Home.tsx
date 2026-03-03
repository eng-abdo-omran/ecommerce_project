import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { EmptyState } from "../../shared/components/ui/EmptyState";

import { ProductCard } from "../../features/storefront/components/ProductCard";
import { Reveal } from "../../features/storefront/components/Reveal";
import { CategorySkeleton, GridSkeleton } from "../../features/storefront/components/Skeletons";
import { useHomeData } from "../../features/storefront/hooks/useHomeData";
import { resolvePublicImage } from "../../shared/utils/assets";

import type { InterfaceCategory, InterfaceProduct } from "../../features/storefront/types";

function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionTo,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-gray-600">{subtitle}</p> : null}
      </div>
      {actionLabel && actionTo ? (
        <Link to={actionTo}>
          <Button variant="secondary" size="sm">
            {actionLabel}
          </Button>
        </Link>
      ) : null}
    </div>
  );
}

function CategoryCard({ c }: { c: InterfaceCategory }) {
  const { t } = useTranslation();
  const imgSrc = resolvePublicImage(c.image_url);

  return (
    <Link
      to={`/shop?category=${c.id}`}
      className="group rounded-3xl border bg-white p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl border bg-gray-50 overflow-hidden grid place-items-center">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={c.name}
              className="h-full w-full object-cover group-hover:scale-[1.04] transition duration-300"
              loading="lazy"
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />
          ) : (
            <span className="text-xs text-gray-400">
              {t("common.noImage", { defaultValue: "No image" })}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 line-clamp-1">{c.name}</div>
          <div className="text-xs text-gray-600 line-clamp-1">{c.slug}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { categoriesQuery, featured, newArrivals, bestSellers } = useHomeData();

  const categories: InterfaceCategory[] = categoriesQuery.data?.data ?? [];

  const featuredProducts: InterfaceProduct[] = featured.data?.data?.data ?? [];
  const newArrivalProducts: InterfaceProduct[] = newArrivals.data?.data?.data ?? [];
  const bestSellerProducts: InterfaceProduct[] = bestSellers.data?.data?.data ?? [];

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] border bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50" />
        <div className="relative p-6 md:p-10 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {t("home.badge", { defaultValue: "Faster, smarter shopping" })}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900">
                {t("home.heroTitle", {
                  defaultValue: "A modern store experience — curated products at the best value",
                })}
              </h1>

              <p className="text-gray-600 md:text-lg">
                {t("home.heroDesc", {
                  defaultValue: "Clear categories, high-quality products, and one-click add to cart/favorites.",
                })}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/shop">
                  <Button variant="primary" size="lg">
                    {t("home.ctaShop", { defaultValue: "Shop now" })}
                  </Button>
                </Link>
                <Link to="/favorites">
                  <Button variant="secondary" size="lg">
                    {t("home.ctaFav", { defaultValue: "View favorites" })}
                  </Button>
                </Link>
              </div>

              <div className="max-w-xl">
                <Input placeholder={t("common.search", { defaultValue: "Search products..." })} />
                <p className="mt-2 text-xs text-gray-500">
                  {t("home.searchHint", { defaultValue: "Search by name, type, or brand" })}
                </p>
              </div>

              {/* Trust strip */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="rounded-2xl border bg-white/70 p-3 text-center">
                  <div className="text-lg font-extrabold text-gray-900">
                    {t("home.trustSupportValue", { defaultValue: "24/7" })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {t("home.trustSupportLabel", { defaultValue: "Always support" })}
                  </div>
                </div>

                <div className="rounded-2xl border bg-white/70 p-3 text-center">
                  <div className="text-lg font-extrabold text-gray-900">
                    {t("home.trustFastValue", { defaultValue: "Fast" })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {t("home.trustFastLabel", { defaultValue: "Fast delivery" })}
                  </div>
                </div>

                <div className="rounded-2xl border bg-white/70 p-3 text-center">
                  <div className="text-lg font-extrabold text-gray-900">
                    {t("home.trustSecureValue", { defaultValue: "Secure" })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {t("home.trustSecureLabel", { defaultValue: "Secure experience" })}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-gradient-to-b from-gray-50 to-white border p-4">
                    <div className="text-sm text-gray-600">
                      {t("home.card1", { defaultValue: "Today's picks" })}
                    </div>
                    <div className="mt-2 text-2xl font-extrabold text-gray-900">
                      {t("home.card1b", { defaultValue: "Top Picks" })}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-b from-gray-50 to-white border p-4">
                    <div className="text-sm text-gray-600">
                      {t("home.card2", { defaultValue: "One-click add" })}
                    </div>
                    <div className="mt-2 text-2xl font-extrabold text-gray-900">
                      {t("home.card2b", { defaultValue: "Cart & Favorites" })}
                    </div>
                  </div>

                  <div className="col-span-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-5 text-white">
                    <div className="text-sm opacity-90">
                      {t("home.card3", { defaultValue: "Modern UI" })}
                    </div>
                    <div className="mt-1 text-2xl font-extrabold">
                      {t("home.card3b", { defaultValue: "And a great user experience" })}
                    </div>
                    <div className="mt-3">
                      <Link to="/shop" className="underline underline-offset-4">
                        {t("home.card3c", { defaultValue: "Browse products" })}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-indigo-200 blur-2xl opacity-60" />
              <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-pink-200 blur-2xl opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeader
            title={t("home.categoriesTitle", { defaultValue: "Browse by category" })}
            subtitle={t("home.categoriesSub", { defaultValue: "Pick a category and start shopping" })}
            actionLabel={t("home.viewAll", { defaultValue: "View all" })}
            actionTo="/shop"
          />

          {categoriesQuery.isLoading ? (
            <CategorySkeleton count={8} />
          ) : categories.length === 0 ? (
            <EmptyState title={t("home.noCategories", { defaultValue: "No categories yet" })} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.slice(0, 8).map((c) => (
                <CategoryCard key={c.id} c={c} />
              ))}
            </div>
          )}
        </section>
      </Reveal>

      {/* FEATURED */}
      <Reveal delayMs={80}>
        <section className="space-y-4">
          <SectionHeader
            title={t("home.featuredTitle", { defaultValue: "Featured products" })}
            subtitle={t("home.featuredSub", { defaultValue: "Top picks — cart + favorite buttons" })}
            actionLabel={t("home.viewShop", { defaultValue: "Go to shop" })}
            actionTo="/shop"
          />

          {featured.isLoading ? (
            <GridSkeleton count={8} />
          ) : featuredProducts.length === 0 ? (
            <EmptyState title={t("shop.empty", { defaultValue: "No products found" })} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </Reveal>

      {/* NEW ARRIVALS */}
      <Reveal delayMs={120}>
        <section className="space-y-4">
          <SectionHeader
            title={t("home.newArrivalsTitle", { defaultValue: "New arrivals" })}
            subtitle={t("home.newArrivalsSub", { defaultValue: "Latest additions to the shop" })}
            actionLabel={t("home.viewShop", { defaultValue: "View more" })}
            actionTo="/shop"
          />

          {newArrivals.isLoading ? (
            <GridSkeleton count={8} />
          ) : newArrivalProducts.length === 0 ? (
            <EmptyState title={t("shop.empty", { defaultValue: "No products found" })} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newArrivalProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </Reveal>

      {/* BEST SELLERS */}
      <Reveal delayMs={160}>
        <section className="space-y-4">
          <SectionHeader
            title={t("home.bestSellersTitle", { defaultValue: "Best sellers" })}
            subtitle={t("home.bestSellersSub", { defaultValue: "Products with high demand" })}
            actionLabel={t("home.viewShop", { defaultValue: "View more" })}
            actionTo="/shop"
          />

          {bestSellers.isLoading ? (
            <GridSkeleton count={8} />
          ) : bestSellerProducts.length === 0 ? (
            <EmptyState title={t("shop.empty", { defaultValue: "No products found" })} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bestSellerProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal delayMs={220}>
        <section className="rounded-[2rem] border bg-white p-6 md:p-10 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">
                {t("home.newsTitle", { defaultValue: "Subscribe for the latest deals" })}
              </h3>
              <p className="mt-2 text-gray-600">
                {t("home.newsDesc", { defaultValue: "Enter your email and get updates & exclusive discounts." })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input placeholder={t("home.email", { defaultValue: "Email" })} />
              </div>
              <Button variant="primary" size="lg">
                {t("home.subscribe", { defaultValue: "Subscribe" })}
              </Button>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}