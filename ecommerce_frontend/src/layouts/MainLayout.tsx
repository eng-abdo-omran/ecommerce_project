/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBars,
  faXmark,
  faHeart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useLocaleStore } from "../store/locale.store";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useAuthStore } from "../store/auth.store";
import { useMyCart } from "../features/cart/hooks/useMyCart";
import { useMyFavorites } from "../features/favorites/hooks/useMyFavorites";

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleLocale, dir, locale } = useLocaleStore();
  const { t, i18n } = useTranslation();

  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 1;

  const isUser = Boolean(token) && role !== 1;

  // keep i18n language in sync
  if (i18n.language !== locale) i18n.changeLanguage(locale);

  // Server counts
  const cartQ = useMyCart(Boolean(token));
  const favQ = useMyFavorites({ page: 1, perPage: 1 }, Boolean(token)); // نقرأ total

  const cartCount = useMemo(() => {
    const items = cartQ.data?.data?.items ?? [];
    return items.reduce(
      (acc: number, it: any) => acc + (Number(it.quantity) || 0),
      0,
    );
  }, [cartQ.data]);

  const favCount = favQ.data?.data?.total ?? 0;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 ${
      isActive
        ? "text-indigo-600 font-medium"
        : "text-gray-600 hover:text-gray-900"
    }`;

  const badgeClass = clsx(
    "absolute -top-2 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-red-600 text-white",
    dir === "rtl" ? "-left-4" : "-right-4",
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md">
                E
              </div>
              <span className="font-semibold text-lg text-gray-900">
                Ecommerce
              </span>
            </Link>

            {/* Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink to="/" className={navLinkClass}>
                {t("nav.home")}
              </NavLink>
              <NavLink to="/shop" className={navLinkClass}>
                {t("nav.shop")}
              </NavLink>

              {isAdmin ? (
                <NavLink to="/admin" className={navLinkClass}>
                  {t("nav.admin")}
                </NavLink>
              ) : null}

              {isUser ? (
                <NavLink
                  to="/account/profile"
                  className="relative flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faUser} className="text-lg" />
                  <span>{t("nav.account", { defaultValue: "حسابي" })}</span>
                </NavLink>
              ) : null}

              <NavLink to="/cart" className="relative flex items-center gap-2">
                <FontAwesomeIcon icon={faCartShopping} className="text-lg" />
                <span>{t("nav.cart")}</span>
                {cartCount > 0 && (
                  <span className={badgeClass}>{cartCount}</span>
                )}
              </NavLink>

              <NavLink
                to="/favorites"
                className="relative flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faHeart} className="text-lg" />
                <span className="sr-only">المفضلة</span>
                {favCount > 0 && (
                  <span
                    className="absolute -top-2 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-pink-600 text-white"
                    style={{ insetInlineEnd: "-1rem" }}
                  >
                    {favCount}
                  </span>
                )}
              </NavLink>

              <button
                onClick={() => toggleLocale()}
                className="px-3 h-10 rounded-xl border bg-white hover:bg-gray-50 text-sm"
                aria-label="Toggle language"
              >
                {locale === "ar" ? t("lang.en") : t("lang.ar")}
              </button>
            </nav>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <FontAwesomeIcon
                icon={mobileOpen ? faXmark : faBars}
                className="text-xl"
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white shadow-sm animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <NavLink
                to="/"
                className="block text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.home")}
              </NavLink>

              <NavLink
                to="/shop"
                className="block text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.shop")}
              </NavLink>

              {isAdmin ? (
                <NavLink
                  to="/admin"
                  className="block text-gray-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("nav.admin")}
                </NavLink>
              ) : null}

              {isUser ? (
                <NavLink
                  to="/account/profile"
                  className="relative flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faUser} className="text-lg" />
                  <span>{t("nav.account", { defaultValue: "حسابي" })}</span>
                </NavLink>
              ) : null}

              <NavLink
                to="/cart"
                className="block flex items-center justify-between text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                <span>{t("nav.cart")}</span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white text-xs">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/favorites"
                className="block flex items-center justify-between text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faHeart} className="text-lg" />
                  <span className="sr-only">المفضلة</span>
                </div>
                {favCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-pink-600 text-white text-xs">
                    {favCount}
                  </span>
                )}
              </NavLink>

              <button
                onClick={() => {
                  toggleLocale();
                  setMobileOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl border hover:bg-gray-50 text-sm"
              >
                {locale === "ar" ? t("lang.en") : t("lang.ar")}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Ecommerce
        </div>
      </footer>
    </div>
  );
}
