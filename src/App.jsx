import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import RegisterPage from "./app/auth/register/register_page";
import LoginPage from "./app/auth/login/login_page";
import HomePage from "./app/customer/home-page";
import AdminDashboardPage from "./app/admin/dashboard/dashboard-page";

import InventoryPage from "./app/admin/inventory/inventory.page";
import ProductPage from "./app/admin/product/product.page";
import OrderPage from "./app/admin/order/order.page";
import UserPage from "./app/admin/user/user.page";

import { UserProvider, UserContext } from "./context/userContext.jsx";

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
        <Routes>
          {/* ✅ Redirect / to homepage */}
          <Route path="/" element={<Navigate replace to="/homepage" />} />

          {/* ✅ Public Routes */}
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />

          {/* ✅ Homepage */}
          <Route path="/homepage" element={<HomePage />} />

          {/* ✅ Admin Routes (Protected) */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<AdminDashboardPage />}>
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="orders" element={<OrderPage />} />
              <Route path="users" element={<UserPage />} />
            </Route>
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
