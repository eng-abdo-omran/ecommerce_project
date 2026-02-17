import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import { useAuthStore } from "../store/auth.store";

const DashboardLayout: React.FC<{ title?: string }> = ({
  title = "Admin Dashboard",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const nav = useNavigate();

  const navItems = [
    { to: "/admin", label: "Overview", icon: <FaChartPie /> },
    { to: "/admin/users", label: "Users", icon: <FaUser /> },
    { to: "/admin/orders", label: "Orders", icon: <FaShoppingBag /> },
    { to: "/admin/categories", label: "Categories", icon: <FaTags /> },
    { to: "/admin/brands", label: "Brands", icon: <FaTrademark /> },
    { to: "/admin/suppliers", label: "Suppliers", icon: <FaTruck /> },
    { to: "/admin/products", label: "Products", icon: <FaBoxOpen /> },
    { to: "/admin/offers", label: "Offers", icon: <FaTag /> },
    { to: "/admin/coupons", label: "Coupons", icon: <FaTicketAlt /> },
    { to: "/admin/customers", label: "Customers", icon: <FaUsers /> },
    { to: "/admin/stores", label: "Stores", icon: <FaStore  /> },
    { to: '/admin/reviews', label: 'Reviews', icon: <FaStar /> },
    { to: "/admin/settings", label: "Settings", icon: <FaCog /> },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-2 rounded-lg transition-colors duration-150 text-sm md:text-base ${
      isActive
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-slate-200 hover:bg-white/10"
    }`;

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
      // focus the close button for basic focus behavior on mobile
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    }
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Navbar (mobile + desktop) - MATCH SIDEBAR THEME */}
      {/* Floating Top Navbar (mobile + desktop) */}
      <div
        className={`sticky top-4 px-4 ${sidebarOpen ? "z-20" : "z-50"} md:z-50`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-800 text-slate-100 border border-slate-700 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between px-4 py-3 md:px-5 md:py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen((s) => !s)}
                  className="p-2 rounded-lg hover:bg-white/10 transition md:hidden"
                  aria-label="Toggle menu"
                >
                  {sidebarOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className="font-semibold text-slate-100">{title}</div>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <p className="text-sm text-slate-300">
                  Welcome back — manage your store
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar (floating on md+, drawer on mobile) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300
            md:static md:translate-x-0 md:sticky md:top-6 md:h-[calc(100vh-4rem)]
            md:rounded-xl md:shadow-2xl md:border md:border-slate-700
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
            bg-slate-800 text-slate-100`}
          aria-hidden={!sidebarOpen ? true : undefined}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-700 md:rounded-t-xl">
              <div>
                <div className="text-lg font-extrabold">Ecommerce</div>
                <div className="text-sm text-slate-300">Admin Panel</div>
              </div>

              <button
                ref={closeBtnRef}
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-white/10 transition md:hidden"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>

            <nav className="p-4 space-y-1 overflow-auto">
              {navItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.to === "/admin"} // Fix: Overview active only on exact /admin
                  className={linkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg opacity-90">{it.icon}</span>
                  <span>{it.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-700 mt-auto md:rounded-b-xl">
              <button
                onClick={() => {
                  logout();
                  nav("/login", { replace: true });
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg text-red-300 hover:bg-red-500/10 transition"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        {/* Main content area - Floating Card */}
        <div
          className="flex-1 min-h-[70vh]"
          aria-hidden={sidebarOpen ? true : undefined}
        >
          <main className="p-4 md:p-6 overflow-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
              <div className="p-4 md:p-6">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
