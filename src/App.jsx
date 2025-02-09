import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./app/auth/register/register_page";
import LoginPage from "./app/auth/login/login_page";
import HomePage from "./app/customer/home/home-page.jsx";
import { UserProvider } from "./context/context.api.jsx";
import AdminDashboard from "./app/admin/dashboard/dashboard-page.jsx";


function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Basic Routes (Login & Register) */}
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />

        {/* ✅ Customer Routes - Wrapped in UserProvider */}
        <Route
          path="/homepage"
          element={
            <UserProvider>
              <HomePage />
            </UserProvider>
          }
        />

        {/* ✅ Future Admin Routes - Wrapped in UserProvider */}
        <Route
          path="/admin/dashboard"
          element={
            <UserProvider>
              <AdminDashboard /> 
            </UserProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
