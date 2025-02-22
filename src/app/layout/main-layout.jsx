import React, { useContext, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart.jsx';
import { UserContext } from '../../context/userContext.jsx';
import EditModal from './models/edit-model.jsx';
import DeleteModal from './models/delete-model.jsx';
import ChangePasswordModal from './models/change-password-model.jsx';

const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const { cart } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const itemCount =
    cart && cart.items
      ? cart.items.reduce((total, item) => total + item.quantity, 0)
      : 0;

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
  };

  return (
    <>
      <nav className="bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/homepage" className="text-xl font-bold text-black">
                AILAV
              </Link>
              <div className="hidden md:flex space-x-6">
                <a href="#!" className="text-gray-700 hover:text-black">
                  Category
                </a>
                <a href="#!" className="text-gray-700 hover:text-black">
                  About us
                </a>
                <a href="#!" className="text-gray-700 hover:text-black">
                  Contact us
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <ShoppingBag className="w-6 h-6 text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="px-6 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800"
                  >
                    {user.name || user.username || "User"}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded">
                      <button
                        onClick={() => {
                          setShowEditModal(true);
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Edit Data
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Delete Account
                      </button>
                      <button
                        onClick={() => {
                          setShowChangePasswordModal(true);
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Change Password
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-full hover:bg-gray-50"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    className="px-6 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800"
                  >
                    Join now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showEditModal && <EditModal user={user} onClose={() => setShowEditModal(false)} />}
      {showDeleteModal && <DeleteModal onClose={() => setShowDeleteModal(false)} />}
      {showChangePasswordModal && <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />}
    </>
  );
};

const Footer = () => (
  <footer className="bg-white pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-4">Ailav.co</h3>
          <p className="text-gray-600 mb-4">
            Your ultimate liquor delivery website. Enjoy a wide range of wines,
            beers, and spirits delivered straight to your door.
          </p>
          <p className="text-gray-600">
            Location: 5-Sitapaila, KTM, Nepal
            <br />
            Phone: +977 9765346808
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">COMPANY</h4>
          {['About', 'Features', 'Works', 'Career'].map((item, idx) => (
            <ul key={idx} className="space-y-2 text-gray-600">
              <li>
                <a href="#!">{item}</a>
              </li>
            </ul>
          ))}
        </div>
        <div>
          <h4 className="font-semibold mb-4">HELP</h4>
          {[
            'Customer Support',
            'Delivery Details',
            'Terms & Conditions',
            'Privacy Policy',
          ].map((item, idx) => (
            <ul key={idx} className="space-y-2 text-gray-600">
              <li>
                <a href="#!">{item}</a>
              </li>
            </ul>
          ))}
        </div>
        <div>
          <h4 className="font-semibold mb-4">RESOURCES</h4>
          {[
            'Cocktail Recipes',
            'Wine Pairing Guide',
            'Event Updates',
            'Industry Insights',
          ].map((item, idx) => (
            <ul key={idx} className="space-y-2 text-gray-600">
              <li>
                <a href="#!">{item}</a>
              </li>
            </ul>
          ))}
        </div>
      </div>
      <div className="border-t pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">
            Ailav.co © 2000-2023, All Rights Reserved
          </p>
          <div className="flex items-center space-x-4">
            <img
              src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/visa.svg"
              alt="Visa"
              className="h-6"
            />
            <img
              src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mastercard.svg"
              alt="Mastercard"
              className="h-6"
            />
            <img
              src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/paypal.svg"
              alt="PayPal"
              className="h-6"
            />
            <img
              src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/applepay.svg"
              alt="Apple Pay"
              className="h-6"
            />
            <img
              src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/googlepay.svg"
              alt="Google Pay"
              className="h-6"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
