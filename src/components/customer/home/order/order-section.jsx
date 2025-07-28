import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../../hooks/useCart.jsx";
import { useOrder } from "../../../../context/orderContext.jsx";
import { UserContext } from "../../../../context/userContext.jsx";
import PaymentSelection from "./paymentSelection.jsx";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OrderSection = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { createOrder } = useOrder();
  const { user } = useContext(UserContext);

  const [showNotification, setShowNotification] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [paymentReady, setPaymentReady] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  });

  // Animate main card
  const cardVariant = {
    hidden: { opacity: 0, y: 50, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.6 } }
  };

  // Sum up cart
  const calculateTotal = () =>
    cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Payment handler (Khalti/COD success)
  const handlePaymentSuccess = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
    setPaymentReady(true);
  };

  // Final submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentReady || !selectedPayment) return alert("Complete payment selection first!");
    if (!formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      alert("Fill all address fields.");
      return;
    }
    if (!user || !user.id) {
      alert("You must be logged in.");
      return;
    }
    try {
      setProcessingOrder(true);
      const orderData = {
        userId: user.id,
        ...formData,
        payment: selectedPayment,
        cart: cart.items,
        totalAmount: calculateTotal()
      };
      await createOrder(orderData);
      await clearCart();
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate("/");
      }, 2500);
    } catch (error) {
      setProcessingOrder(false);
      alert(error?.response?.data?.message || "Order failed.");
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 flex flex-col items-center">
      <motion.div
        className="w-full max-w-2xl mx-auto shadow-2xl rounded-3xl p-0 overflow-hidden border border-black/10"
        variants={cardVariant}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
        <div className="px-10 py-7 border-b border-black/5 bg-white">
          <motion.h1
            className="text-3xl font-black tracking-tight mb-1"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.09, duration: 0.38 }}
          >
            Checkout
          </motion.h1>
          <span className="text-gray-500 font-medium text-md">Your Cart Summary & Delivery</span>
        </div>

        {/* ORDER SUMMARY */}
        <div className="px-10 py-7 bg-white">
          <h2 className="text-xl font-bold mb-6 tracking-tight">Order Summary</h2>
          <div className="flex flex-col gap-6">
            {cart.items.map((item, i) => (
              <motion.div
                key={item.productId + i}
                className="flex items-center gap-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-black/10 shadow">
                  <img
                    src={item.productImage || item.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate text-lg">{item.productName}</div>
                  <div className="text-xs text-gray-500 font-medium">
                    Qty: {item.quantity} × <span className="font-bold">Rs {item.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="font-bold text-lg text-black">
                  Rs {(item.price * item.quantity).toLocaleString()}
                </div>
              </motion.div>
            ))}
            <div className="flex justify-between items-center mt-5 pt-5 border-t border-black/10 font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-black text-2xl font-black tracking-widest">Rs {calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ADDRESS FORM */}
        <form onSubmit={handleSubmit} className="px-10 py-7 border-t border-black/10 bg-white space-y-7">
          <h2 className="text-xl font-bold tracking-tight mb-3">Delivery Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-sm mb-1">Address Line 1</label>
              <input
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                required
                placeholder="Street, Area"
                className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-sm mb-1">Address Line 2</label>
              <input
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                placeholder="Apartment, suite (optional)"
                className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-sm mb-1">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-sm mb-1">State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-sm mb-1">Postal Code</label>
              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-sm mb-1">Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:ring-2 focus:ring-black outline-none"
              />
            </div>
          </div>

          {/* Payment */}
          <div className="mt-2">
            <h2 className="text-xl font-bold tracking-tight mb-3">Payment Method</h2>
            <PaymentSelection
              totalAmount={calculateTotal()}
              onPaymentSuccess={handlePaymentSuccess}
              disabled={processingOrder}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
            />
          </div>

          {/* Place Order */}
          <div className="mt-8 flex items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={!paymentReady || processingOrder}
              className="w-full md:w-2/3 py-4 rounded-xl text-xl font-black bg-black text-white shadow-lg tracking-widest transition
                hover:bg-gray-900 focus:ring-4 focus:ring-black focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {processingOrder ? "Placing Order..." : "Place Order"}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Success Floating Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed bottom-8 right-8 z-50 px-7 py-4 bg-black text-white rounded-2xl flex items-center shadow-2xl"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", duration: 0.44 }}
          >
            <Check className="w-6 h-6 mr-3" /> Order placed successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderSection;
