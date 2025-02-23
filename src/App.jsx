import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import RegisterPage from "./app/auth/register/register_page";
import LoginPage from "./app/auth/login/login_page";
import HomePage from "./app/customer/home-page";
import MainLayout from "./app/layout/main-layout.jsx";
import AdminDashboardPage from "./app/admin/dashboard/dashboard-page";
import InventoryPage from "./app/admin/inventory/inventory.page";
import ProductPage from "./app/admin/product/product.page";
import OrderPage from "./app/admin/order/order.page";
import UserPage from "./app/admin/user/user.page";
import SingleProduct from "./app/admin/product/single-product.jsx"; 
import CartPage from "./app/customer/add-to-cart/add-to-cart-page.jsx";
import CustomerOrderPage from "./app/customer/order-page/order-page.jsx";
import CustomerSingleProductPage from "./app/customer/product-page/singleproduc.jsx";

import { UserProvider, UserContext } from "./context/userContext.jsx";
import { CartProvider } from "./context/cartContext.jsx";
import { OrderProvider } from "./context/orderContext.jsx";
import ErrorBoundary from "./error-handelling/error-boundary.jsx";

// ✅ Admin Private Route Wrapper
const AdminRoute = () => {
  const { user } = useContext(UserContext);
  const role = user?.role || localStorage.getItem("userRole");

  if (!role) {
    return <Navigate to="/auth/login" />;
  }

  return role === "admin" ? <Outlet /> : <Navigate to="/homepage" />;
};

function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <OrderProvider>
            <ErrorBoundary>
              <Routes>
                {/* Redirect / to homepage */}
                <Route path="/" element={<Navigate replace to="/homepage" />} />

                {/* Public Routes wrapped with MainLayout */}
                <Route element={<MainLayout />}>
                  <Route path="/homepage" element={<HomePage />} />
                  <Route path="/customer/product/:id" element={<CustomerSingleProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/customer/order" element={<CustomerOrderPage />} />
                </Route>

                {/* Public Routes */}
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/login" element={<LoginPage />} />

                {/* Admin Routes (Protected) */}
                <Route path="/admin" element={<AdminRoute />}>
                  <Route path="dashboard" element={<AdminDashboardPage />}>
                    <Route path="users" element={<UserPage />} />
                    <Route path="products" element={<ProductPage />} />
                    <Route path="orders" element={<OrderPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                  </Route>
                  <Route path="product/single-product/:id" element={<SingleProduct />} />
                </Route>
              </Routes>
            </ErrorBoundary>
          </OrderProvider>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
