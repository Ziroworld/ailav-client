import React, { useContext, useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ShoppingBag, User2, LogOut, History, Pencil, Trash, KeyRound } from "lucide-react";
import { useCart } from "../../hooks/useCart.jsx";
import { UserContext } from "../../context/userContext.jsx";
import EditModal from "./models/edit-model.jsx";
import DeleteModal from "./models/delete-model.jsx";
import ChangePasswordModal from "./models/change-password-model.jsx";
import ViewOrderModel from "./models/view-order-model.jsx";
import { motion, AnimatePresence } from "framer-motion";

const paymentIcons = [
  { src: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/visa.svg", alt: "Visa" },
  { src: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mastercard.svg", alt: "Mastercard" },
  { src: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/paypal.svg", alt: "PayPal" },
  { src: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/applepay.svg", alt: "Apple Pay" },
  { src: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/googlepay.svg", alt: "Google Pay" },
];

const footerLinks = [
  {
    heading: "COMPANY",
    items: ["About", "Features", "Works", "Career"],
  },
  {
    heading: "HELP",
    items: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
  },
  {
    heading: "RESOURCES",
    items: ["Cocktail Recipes", "Wine Pairing Guide", "Event Updates", "Industry Insights"],
  },
];

const navLinks = [
  { label: "Category", to: "/#category" },
  { label: "About us", to: "/#about" },
  { label: "Contact us", to: "/#contact" },
];

const menuItems = [
  { icon: <Pencil size={17} className="mr-2" />, label: "Edit Data", action: "edit" },
  { icon: <Trash size={17} className="mr-2" />, label: "Delete Account", action: "delete" },
  { icon: <KeyRound size={17} className="mr-2" />, label: "Change Password", action: "password" },
  { icon: <History size={17} className="mr-2" />, label: "View Order History", action: "order" },
  { icon: <LogOut size={17} className="mr-2" />, label: "Logout", action: "logout" },
];

const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const { cart } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showViewOrderModal, setShowViewOrderModal] = useState(false);

  const itemCount =
    cart && cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

  const menuRef = useRef();
  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showUserMenu]);

  const handleMenuAction = (action) => {
    if (action === "edit") setShowEditModal(true);
    if (action === "delete") setShowDeleteModal(true);
    if (action === "password") setShowChangePasswordModal(true);
    if (action === "order") setShowViewOrderModal(true);
    if (action === "logout") logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1, type: "spring" } }}
        className="fixed w-full top-0 left-0 z-50 bg-white/60 backdrop-blur-lg shadow-[0_6px_36px_0_rgba(0,0,0,0.04)] border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <Link to="/homepage" className="text-2xl font-extrabold tracking-tight text-black select-none">
              {/* Keep the AILAV as user likes! */}
              AILAV
            </Link>
            <div className="hidden md:flex space-x-7 text-black/80 text-base font-medium">
              {navLinks.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to}
                  className="relative group transition"
                >
                  <span className="hover:text-black">{item.label}</span>
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-[2.5px] bg-black rounded-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative group">
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.18, y: -2 }}
                  className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center shadow-lg">
                      {itemCount}
                    </span>
                  )}
                </motion.div>
              </Link>
              {user ? (
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.04, boxShadow: "0 6px 28px 0 rgba(0,0,0,0.08)" }}
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="flex items-center gap-2 px-6 py-2 text-base font-bold text-white bg-black rounded-full shadow-md hover:bg-gray-900 transition"
                  >
                    <User2 className="w-5 h-5" />
                    {user.name || user.username || "User"}
                  </motion.button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                        exit={{ opacity: 0, y: 16, transition: { duration: 0.18 } }}
                        className="absolute right-0 mt-2 w-52 bg-white/90 shadow-xl border border-gray-100 rounded-2xl py-1 overflow-hidden backdrop-blur-xl z-20"
                      >
                        {menuItems.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleMenuAction(item.action)}
                            className="w-full flex items-center px-5 py-3 text-gray-700 hover:bg-gray-100 text-left font-medium text-[15px] transition group"
                          >
                            <span className="group-hover:text-black transition">{item.icon}{item.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex gap-1">
                  <Link
                    to="/auth/login"
                    className="px-6 py-2 text-base font-bold text-black bg-white border border-gray-300 rounded-full hover:bg-gray-100 shadow"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    className="px-6 py-2 text-base font-bold text-white bg-black rounded-full shadow hover:bg-gray-900 transition"
                  >
                    Join now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
      <div className="h-[80px] w-full" /> {/* Spacer for sticky navbar */}
      {showEditModal && <EditModal user={user} onClose={() => setShowEditModal(false)} />}
      {showDeleteModal && <DeleteModal onClose={() => setShowDeleteModal(false)} />}
      {showChangePasswordModal && <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />}
      {showViewOrderModal && <ViewOrderModel onClose={() => setShowViewOrderModal(false)} />}
    </>
  );
};

// GODLY FOOTER WITH ANIMATION, LIGHT GRAY BG, MAP

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0, y: 64 }}
    whileInView={{ opacity: 1, y: 0, transition: { duration: 1.2, type: "spring" } }}
    viewport={{ once: true }}
    className="relative w-full z-10"
  >
    {/* Light grayish bg section */}
    <div className="bg-[#f6f6fa] py-16">
      <div className="max-w-7xl mx-auto px-8 flex flex-col gap-12">
        {/* ROW: Info - Map - Links horizontal */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-10 md:gap-0">
          {/* Info */}
          <div className="flex-1 min-w-[220px] w-full md:w-auto mb-8 md:mb-0 md:mr-10">
            <div className="font-extrabold text-2xl mb-2 text-black tracking-tight">AILAV</div>
            <p className="text-gray-500 text-sm mb-2">
              Your ultimate liquor delivery website. Enjoy a wide range of wines, beers, and spirits delivered straight to your door.
            </p>
            <div className="text-gray-400 text-xs mb-1">Location: Sitapaila, KTM, Nepal</div>
            <div className="text-gray-400 text-xs">Phone: +977 9765346808</div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            whileInView={{ opacity: 1, scale: 1, transition: { duration: 1.1, delay: 0.3 } }}
            className="flex-1 flex justify-center md:mx-8 w-full md:w-auto"
          >
            <div className="w-full max-w-xs md:max-w-sm h-52 rounded-2xl shadow-2xl bg-white/80 border border-gray-200 overflow-hidden relative">
              <iframe
                title="Sitapaila Temple, Kathmandu Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.412653356127!2d85.26715951506227!3d27.718470631076775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b59e8bfa11f%3A0xcabe10f3dc7b60b5!2sSitapaila%20Temple!5e0!3m2!1sen!2snp!4v1689791864018!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl h-full w-full"
              ></iframe>
              <span className="absolute left-3 bottom-2 bg-white/80 px-3 py-1 rounded-lg text-xs font-medium text-gray-600 shadow">
                Sitapaila Temple, Kathmandu
              </span>
            </div>
          </motion.div>

          {/* Links: All 3 sections side by side */}
          <div className="flex-[2] flex flex-col md:flex-row justify-end w-full md:w-auto gap-8 md:gap-12">
            {footerLinks.map((col, idx) => (
              <div key={idx} className="min-w-[140px]">
                <h4 className="font-semibold mb-2 text-gray-700 uppercase text-[15px]">{col.heading}</h4>
                <ul className="space-y-1 text-gray-500 text-sm">
                  {col.items.map((item, i) => (
                    <li key={i}>
                      <a href="#!" className="hover:text-black transition-all">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Icons Row */}
        <div className="flex justify-end items-center gap-3 mt-1">
          {paymentIcons.map((icon, idx) => (
            <img key={idx} src={icon.src} alt={icon.alt} className="h-7 w-7 rounded shadow bg-white p-1" />
          ))}
        </div>
      </div>
      {/* Lower Row: Copyright / Privacy / Terms */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-gray-100 pt-7 mt-12 px-8"
      >
        <div className="text-xs text-gray-400">&copy; AILAV 2000-2025, All Rights Reserved</div>
        <div className="flex gap-3 mt-3 md:mt-0 text-sm text-gray-400 font-medium tracking-tight">
          <span className="hover:text-black/70 cursor-pointer">Privacy</span>
          <span className="hover:text-black/70 cursor-pointer">Terms</span>
        </div>
      </motion.div>
    </div>
  </motion.footer>
);

const MainLayout = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
