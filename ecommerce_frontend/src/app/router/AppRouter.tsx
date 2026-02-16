import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import DashboardLayout from "../../layouts/DashboardLayout";
import { RequireAuth, RequireAdmin } from "./guards";

import LoginPage from "../../features/auth/pages/LoginPage";
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
import FavoritesPage from "../../features/favorites/pages/FavoritesPage";

function Home() {
  return <div className="p-6">Home</div>;
}
function Shop() {
  return <div className="p-6">Shop</div>;
}
function Cart() {
  return <div className="p-6">Cart</div>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Protected */}
        <Route element={<RequireAuth />}>
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
              <Route path="/admin/favorites" element={<FavoritesPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
