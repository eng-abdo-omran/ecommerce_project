import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import DashboardLayout from "../../layouts/DashboardLayout";
import { RequireAuth, RequireAdmin, RequireUser } from "./guards";

// Auth
import AuthPage from "../../features/auth/pages/AuthPage";
import LoginPage from "../../features/auth/pages/LoginPage";

// Public
import Home from "../../pages/public/Home";
import Shop from "../../pages/public/Shop";

// Protected public pages
import Cart from "../../pages/public/Cart";
import Favorites from "../../pages/public/Favorites";
import ProductDetails from "../../pages/public/ProductDetails";



// User Dashboard
import AccountLayout from "../../features/account/layouts/AccountLayout";
import ProfilePage from "../../features/account/pages/ProfilePage";
import MyOrdersPage from "../../features/account/pages/MyOrdersPage";
import MyOrderDetailsPage from "../../features/account/pages/MyOrderDetailsPage";
import AddressesPage from "../../features/account/pages/AddressesPage";
import SettingsPage from "../../features/account/pages/SettingsPage";

// Admin
import Dashboard from "../../pages/Dashboard";
import UsersPage from "../../features/users/pages/UsersPage";
import CategoriesPage from "../../features/categories/pages/CategoriesPage";
import ProductsPage from "../../features/products/pages/ProductsPage";
import ProductDetailsPage from "../../features/products/pages/ProductDetailsPage";
import BrandsPage from "../../features/brands/pages/BrandsPage";
import SuppliersPage from "../../features/suppliers/pages/SuppliersPage";
import OrdersPage from "../../features/orders/pages/OrdersPage";
import OrderDetailsPage from "../../features/orders/pages/OrderDetailsPage";
import OffersPage from "../../features/offers/pages/OffersPage";
import CouponsPage from "../../features/coupons/pages/CouponsPage";
import CustomersPage from "../../features/customers/pages/CustomersPage";
import StoresPage from "../../features/stores/pages/StoresPage";
import ReviewsPage from "../../features/reviews/pages/ReviewsPage";
import CheckoutPage from "../../features/checkout/pages/CheckoutPage";
import AdminSettingsPage from "../../features/admin/pages/AdminSettingsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />

          {/* Auth */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Backward compatibility: /login -> /auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected: requires auth */}
          <Route element={<RequireAuth />}>
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>

          {/* User Dashboard */}
          <Route element={<RequireUser />}>
            <Route path="/account" element={<AccountLayout />}>
              <Route
                index
                element={<Navigate to="/account/profile" replace />}
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<MyOrdersPage />} />
              <Route path="orders/:id" element={<MyOrderDetailsPage />} />
              <Route path="addresses" element={<AddressesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Admin Protected */}
        <Route element={<RequireAdmin />}>
          <Route element={<DashboardLayout title="Admin Dashboard" />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/categories" element={<CategoriesPage />} />
            <Route path="/admin/products" element={<ProductsPage />} />
            <Route
              path="/admin/products/:id"
              element={<ProductDetailsPage />}
            />
            <Route path="/admin/brands" element={<BrandsPage />} />
            <Route path="/admin/suppliers" element={<SuppliersPage />} />
            <Route path="/admin/orders" element={<OrdersPage />} />
            <Route path="/admin/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/admin/offers" element={<OffersPage />} />
            <Route path="/admin/coupons" element={<CouponsPage />} />
            <Route path="/admin/customers" element={<CustomersPage />} />
            <Route path="/admin/stores" element={<StoresPage />} />
            <Route path="/admin/reviews" element={<ReviewsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
