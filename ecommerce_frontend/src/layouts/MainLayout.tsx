/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

interface MainLayoutProps {
  children?: React.ReactNode;
  cartCount?: number;
}

export default function MainLayout({ children, cartCount = 0 }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 ${
      isActive ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md">
                E
              </div>
              <span className="font-semibold text-lg text-gray-900">Ecommerce</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/cart" className="relative flex items-center gap-2">
                <FontAwesomeIcon icon={faCartShopping} className="text-lg" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-4 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-red-600 text-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </nav>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white shadow-sm animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <NavLink to="/" className="block text-gray-700" onClick={() => setMobileOpen(false)}>Home</NavLink>
              <NavLink to="/shop" className="block text-gray-700" onClick={() => setMobileOpen(false)}>Shop</NavLink>
              <NavLink to="/dashboard" className="block text-gray-700" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
              <NavLink to="/cart" className="block flex items-center justify-between text-gray-700" onClick={() => setMobileOpen(false)}>
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white text-xs">{cartCount}</span>
                )}
              </NavLink>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Ecommerce — Built with ❤️ by Abdulrahman Omran
        </div>
      </footer>
    </div>
  );
}
