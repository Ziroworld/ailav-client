import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  Box,
  ShoppingBag,
  Package,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import bgRemovedLogo from "../../../assets/bg_removed_logo.png";
import defautProfile from "../../../assets/Avatar.png";
import ThemeController from "../../../../theme/theme-controller";
import { UserContext } from "../../../context/userContext";

const menuItems = [
  { icon: <Home size={20} />, label: "Dashboard", route: "/admin/dashboard" },
  { icon: <Users size={20} />, label: "Users", route: "/admin/dashboard/users" },
  { icon: <Box size={20} />, label: "Product", route: "/admin/dashboard/products" },
  { icon: <ShoppingBag size={20} />, label: "Order", route: "/admin/dashboard/orders" },
  { icon: <Package size={20} />, label: "Inventory", route: "/admin/dashboard/inventory" },
];

const Header = ({ isSidebarOpen, toggleSidebar, toggleModal }) => {
  const { user, logout } = useContext(UserContext);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-base-100 shadow-xl transition-all duration-300 z-50 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <Link to="/admin/dashboard" className="flex items-center justify-center p-4">
          <div className="avatar">
            <div className="w-14 rounded-full">
              <img alt="Avatar" src={bgRemovedLogo} />
            </div>
          </div>
        </Link>
        <div className="px-4 mt-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.route}
              className="flex items-center gap-4 p-3 hover:bg-base-200 rounded-lg mb-2"
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
        <div className="absolute bottom-0 w-full p-4">
          <button
            className="flex items-center gap-4 p-3 hover:bg-base-200 rounded-lg w-full"
            onClick={logout} // ✅ Fixed Logout
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Top Navbar with margin-left based on sidebar width */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="navbar bg-base-100 shadow-md">
          <div className="flex-1">
            <button className="btn btn-ghost" onClick={toggleSidebar}>
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.username || "Admin"}</h1>
              <p className="text-sm opacity-70">
                Manage your admin panel efficiently
              </p>
            </div>
          </div>
          <ThemeController />
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img alt="Avatar" src={defautProfile} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <button onClick={() => toggleModal("update")}>Update Profile</button>
                </li>
                <li>
                  <button onClick={() => toggleModal("delete")}>Delete Account</button>
                </li>
                <li>
                  <button onClick={() => toggleModal("changePassword")}>Change Password</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
