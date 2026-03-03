/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import {
  FaChartPie,
  FaUser,
  FaShoppingBag,
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaTags,
  FaBoxOpen,
  FaTrademark,
  FaTruck,
  FaTag,
  FaTicketAlt,
  FaUsers,
  FaStore,
  FaStar,
  FaHome,
  FaShoppingCart,
  FaExternalLinkAlt,
} from "react-icons/fa";
import clsx from "clsx";
import { useAuthStore } from "../store/auth.store";
import { useLocaleStore } from "../store/locale.store";

const DashboardLayout: React.FC<{ title?: string }> = ({
  title = "Admin Dashboard",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const nav = useNavigate();

  const locale = useLocaleStore((s) => s.locale);
  const toggleLocale = useLocaleStore((s) => s.toggleLocale);

  const { t } = useTranslation();

  const navItems: Array<{
    to: string;
    key: string;
    defaultLabel: string;
    icon: React.ReactNode;
  }> = [
    { to: "/admin", key: "admin.nav.overview", defaultLabel: "Overview", icon: <FaChartPie /> },
    { to: "/admin/users", key: "admin.nav.users", defaultLabel: "Users", icon: <FaUser /> },
    { to: "/admin/orders", key: "admin.nav.orders", defaultLabel: "Orders", icon: <FaShoppingBag /> },
    { to: "/admin/categories", key: "admin.nav.categories", defaultLabel: "Categories", icon: <FaTags /> },
    { to: "/admin/brands", key: "admin.nav.brands", defaultLabel: "Brands", icon: <FaTrademark /> },
    { to: "/admin/suppliers", key: "admin.nav.suppliers", defaultLabel: "Suppliers", icon: <FaTruck /> },
    { to: "/admin/products", key: "admin.nav.products", defaultLabel: "Products", icon: <FaBoxOpen /> },
    { to: "/admin/offers", key: "admin.nav.offers", defaultLabel: "Offers", icon: <FaTag /> },
    { to: "/admin/coupons", key: "admin.nav.coupons", defaultLabel: "Coupons", icon: <FaTicketAlt /> },
    { to: "/admin/customers", key: "admin.nav.customers", defaultLabel: "Customers", icon: <FaUsers /> },
    { to: "/admin/stores", key: "admin.nav.stores", defaultLabel: "Stores", icon: <FaStore /> },
    { to: "/admin/reviews", key: "admin.nav.reviews", defaultLabel: "Reviews", icon: <FaStar /> },
    { to: "/admin/settings", key: "admin.nav.settings", defaultLabel: "Settings", icon: <FaCog /> },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition",
      "focus:outline-none focus:ring-2 focus:ring-white/15",
      isActive
        ? "bg-white/10 text-white shadow-sm"
        : "text-slate-200/80 hover:bg-white/7 hover:text-white",
    );

  // Close on Escape + lock scroll on mobile drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };

    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [sidebarOpen]);

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (sidebarOpen) {
      
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    }
  }, [sidebarOpen]);

  const initials = useRef((user?.name?.trim()?.[0] ?? "A").toUpperCase()).current;

  return (
    <div dir="ltr" className="min-h-screen bg-[#0b1220]">
      {/* background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_circle_at_20%_10%,rgba(99,102,241,.15),transparent_55%),radial-gradient(700px_circle_at_90%_30%,rgba(16,185,129,.12),transparent_55%)]" />

      {/* Top Navbar */}
      <div className={`sticky top-3 px-3 md:px-5 ${sidebarOpen ? "z-20" : "z-50"}`}>
        <div className="max-w-[1400px] mx-auto">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 md:px-5 md:py-4">
              {/* Left: toggle + title */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setSidebarOpen((s) => !s)}
                  className="
                    md:hidden p-2 rounded-xl
                    hover:bg-white/10 transition
                    focus:outline-none focus:ring-2 focus:ring-white/15
                  "
                  aria-label={t("common.toggleMenu", { defaultValue: "Toggle menu" })}
                  type="button"
                >
                  {sidebarOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Title block */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 grid place-items-center font-extrabold text-white">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-extrabold text-white truncate">
                          {t("admin.top.title", { defaultValue: title })}
                        </div>

                        {/* Mobile language toggle */}
                        <button
                          onClick={toggleLocale}
                          className="
                            md:hidden
                            h-9 w-9 rounded-xl
                            border border-slate-600/60 bg-white/5 text-slate-100
                            hover:bg-white/10 hover:border-slate-500 transition
                            focus:outline-none focus:ring-2 focus:ring-white/15
                            active:scale-[0.98]
                            grid place-items-center
                          "
                          title={
                            locale === "ar"
                              ? t("admin.top.switchToEnglish", { defaultValue: "Switch to English" })
                              : t("admin.top.switchToArabic", { defaultValue: "Switch to Arabic" })
                          }
                          aria-label={t("common.toggleLanguage", { defaultValue: "Toggle language" })}
                          type="button"
                        >
                          {locale === "ar"
                            ? t("lang.en", { defaultValue: "EN" })
                            : t("lang.ar", { defaultValue: "AR" })}
                        </button>
                      </div>

                      {/* Welcome + desktop language */}
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-slate-300 truncate">
                          {t("admin.top.welcome", {
                            defaultValue: "Welcome back{{name}} — manage your store",
                            name: user?.name ? `, ${user.name}` : "",
                          })}
                        </p>


                        <button
                          onClick={toggleLocale}
                          className="
                            hidden md:inline-flex items-center gap-2
                            rounded-xl px-3 py-2 text-sm font-bold
                            border border-slate-600/60 bg-white/5 text-slate-100
                            hover:bg-white/10 hover:border-slate-500 transition
                            focus:outline-none focus:ring-2 focus:ring-white/15
                            active:scale-[0.98]
                          "
                          title={
                            locale === "ar"
                              ? t("admin.top.switchToEnglish", { defaultValue: "Switch to English" })
                              : t("admin.top.switchToArabic", { defaultValue: "Switch to Arabic" })
                          }
                          aria-label={t("common.toggleLanguage", { defaultValue: "Toggle language" })}
                          type="button"
                        >
                          <span className="opacity-80">🌐</span>
                          <span>
                            {locale === "ar"
                              ? t("lang.en", { defaultValue: "EN" })
                              : t("lang.ar", { defaultValue: "AR" })}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: quick links */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => nav("/")}
                  className="
                    inline-flex items-center gap-2
                    rounded-2xl px-3 py-2 text-sm font-semibold
                    bg-white/5 border border-white/10 text-white/90
                    hover:bg-white/10 transition
                  "
                  title={t("admin.top.homeTitle", { defaultValue: "Go to Home" })}
                  type="button"
                >
                  <FaHome className="opacity-90" />
                  {t("admin.top.home", { defaultValue: "Home" })}
                </button>

                <button
                  onClick={() => nav("/shop")}
                  className="
                    inline-flex items-center gap-2
                    rounded-2xl px-3 py-2 text-sm font-semibold
                    bg-white/5 border border-white/10 text-white/90
                    hover:bg-white/10 transition
                  "
                  title={t("admin.top.shopTitle", { defaultValue: "Go to Shop" })}
                  type="button"
                >
                  <FaStore className="opacity-90" />
                  {t("admin.top.shop", { defaultValue: "Shop" })}
                </button>

                <button
                  onClick={() => nav("/cart")}
                  className="
                    inline-flex items-center gap-2
                    rounded-2xl px-3 py-2 text-sm font-semibold
                    bg-white/5 border border-white/10 text-white/90
                    hover:bg-white/10 transition
                  "
                  title={t("admin.top.cartTitle", { defaultValue: "Go to Cart" })}
                  type="button"
                >
                  <FaShoppingCart className="opacity-90" />
                  {t("admin.top.cart", { defaultValue: "Cart" })}
                </button>

                <button
                  onClick={() => nav("/admin/settings")}
                  className="
                    inline-flex items-center gap-2
                    rounded-2xl px-3 py-2 text-sm font-semibold
                    bg-indigo-500/15 border border-indigo-400/25 text-indigo-100
                    hover:bg-indigo-500/25 transition
                  "
                  title={t("admin.top.settingsTitle", { defaultValue: "Admin Settings" })}
                  type="button"
                >
                  <FaCog className="opacity-90" />
                  {t("admin.top.settings", { defaultValue: "Settings" })}
                </button>

                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex items-center gap-2
                    rounded-2xl px-3 py-2 text-sm font-semibold
                    bg-emerald-500/12 border border-emerald-400/20 text-emerald-100
                    hover:bg-emerald-500/20 transition
                  "
                  title={t("admin.top.openStoreTitle", { defaultValue: "Open Store in new tab" })}
                >
                  <FaExternalLinkAlt className="opacity-90" />
                  {t("admin.top.openStore", { defaultValue: "Open Store" })}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout body */}
      <div className="max-w-[1400px] mx-auto px-3 md:px-5 py-6 flex gap-6">
        {/* Sidebar */}
        <aside
          className={clsx(
            "fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300",
            "md:static md:translate-x-0 md:sticky md:top-24 md:h-[calc(100vh-7rem)]",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "bg-[#0f172a]/95 text-white border-r border-white/10 backdrop-blur",
            "md:rounded-3xl md:border md:border-white/10 md:shadow-2xl",
          )}
          aria-hidden={!sidebarOpen ? true : undefined}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 md:rounded-t-3xl">
              <div>
                <div className="text-lg font-extrabold">
                  {t("admin.top.brand", { defaultValue: "Ecommerce" })}
                </div>
                <div className="text-xs text-white/60">
                  {t("admin.top.adminPanel", { defaultValue: "Admin Panel" })}
                </div>
              </div>

              <button
                ref={closeBtnRef}
                onClick={() => setSidebarOpen(false)}
                className="
                  md:hidden p-2 rounded-xl
                  hover:bg-white/10 transition
                  focus:outline-none focus:ring-2 focus:ring-white/15
                "
                aria-label={t("common.closeMenu", { defaultValue: "Close menu" })}
                type="button"
              >
                <FaTimes />
              </button>
            </div>

            {/* Sidebar nav */}
            <nav className="p-3 space-y-1 overflow-auto">
              {navItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.to === "/admin"}
                  className={linkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  {({ isActive }) => (
                    <>

                      <span
                        className={clsx(
                          "absolute left-0 top-2 bottom-2 w-1 rounded-full transition",
                          isActive ? "bg-indigo-400" : "bg-transparent",
                        )}
                      />
                      <span className="text-lg opacity-90">{it.icon}</span>
                      <span className="truncate">
                        {t(it.key, { defaultValue: it.defaultLabel })}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Sidebar footer */}
            <div className="p-4 border-t border-white/10 mt-auto md:rounded-b-3xl">
              <button
                onClick={() => {
                  logout();
                  nav("/login", { replace: true });
                }}
                className="
                  w-full flex items-center justify-center gap-3
                  rounded-2xl px-3 py-2.5 text-sm font-extrabold
                  bg-red-500/12 border border-red-400/20 text-red-100
                  hover:bg-red-500/20 transition
                  focus:outline-none focus:ring-2 focus:ring-red-500/20
                "
                type="button"
              >
                <FaSignOutAlt />
                {t("admin.top.logout", { defaultValue: "Logout" })}
              </button>

              <div className="mt-3 text-xs text-white/50 text-center">
                v1.0 • {t("admin.top.adminUI", { defaultValue: "Admin UI" })}
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        {/* Main content */}
        <div className="flex-1 min-h-[70vh]" aria-hidden={sidebarOpen ? true : undefined}>
          <main className="p-0 md:p-0">
            <div className="rounded-3xl bg-[#f6f7fb] border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-4 md:p-6">
                <Outlet />
              </div>
            </div>
          </main>

          {/* Mobile quick links */}
          <div className="md:hidden mt-4 grid grid-cols-2 gap-2">
            <Link
              to="/"
              className="rounded-2xl bg-white/5 border border-white/10 text-white/90 px-3 py-2 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition"
            >
              <FaHome /> {t("admin.top.home", { defaultValue: "Home" })}
            </Link>
            <Link
              to="/shop"
              className="rounded-2xl bg-white/5 border border-white/10 text-white/90 px-3 py-2 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition"
            >
              <FaStore /> {t("admin.top.shop", { defaultValue: "Shop" })}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
