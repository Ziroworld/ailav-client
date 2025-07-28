// paymentSelection.jsx
import React, { useState, useEffect } from "react";
import { FaMoneyBill, FaMobileAlt, FaQrcode } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// For Khalti/esewa integration: import their SDK if needed

const paymentMethods = [
  { id: "cash", name: "Cash on Delivery", description: "Pay when you receive your order", icon: <FaMoneyBill className="text-green-700" /> },
  { id: "qr", name: "QR Payment", description: "Scan a QR code to pay with your mobile wallet", icon: <FaQrcode className="text-blue-700" /> },
  // Extend with wallet logic if needed
];

const PaymentSelection = ({
  totalAmount,
  onPaymentSuccess,
  disabled,
  selectedPayment,
  setSelectedPayment,
}) => {
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  // For future: useEffect to setup KhaltiCheckout or QR SDK as needed

  // Handles the "Pay"/"Continue" button click, calls the parent with payment result
  const handlePayment = async () => {
    setProcessing(true);
    setPaymentStatus("");
    try {
      if (selectedPayment === "cash") {
        setTimeout(() => {
          setProcessing(false);
          setPaymentStatus("success");
          onPaymentSuccess("cash"); // Pass payment method back
        }, 800);
      }
      else if (selectedPayment === "qr") {
        // Here, show QR code (or do real wallet integration)
        // Demo: just wait & succeed
        setTimeout(() => {
          setProcessing(false);
          setPaymentStatus("success");
          onPaymentSuccess("qr"); // You can pass payment token/id if needed
        }, 1800);
      }
      // You can add logic for Khalti, eSewa, Fonepay, etc. here
    } catch (err) {
      setProcessing(false);
      setPaymentStatus("error");
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap gap-3 mb-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border shadow text-sm font-semibold
              ${selectedPayment === method.id ? "bg-black text-white border-black" : "bg-white text-black border-gray-200 opacity-80"}
            `}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedPayment === method.id}
              onChange={() => setSelectedPayment(method.id)}
              className="hidden"
            />
            {method.icon}
            <span>
              <span className="font-bold">{method.name}</span>
              <span className="block text-xs text-gray-500">{method.description}</span>
            </span>
          </label>
        ))}
      </div>
      <button
        type="button"
        className={`w-full mt-2 py-2 rounded-md text-lg font-bold transition
          ${selectedPayment ? "bg-black text-white hover:bg-gray-900" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
        `}
        onClick={handlePayment}
        disabled={!selectedPayment || processing || disabled}
      >
        {processing
          ? "Processing..."
          : selectedPayment === "cash"
          ? "Place Order (Cash on Delivery)"
          : selectedPayment === "qr"
          ? "Continue to QR Payment"
          : "Select Payment"
        }
      </button>

      {/* Payment status feedback */}
      <AnimatePresence>
        {paymentStatus === "success" && (
          <motion.div
            className="text-green-700 mt-3 text-sm text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            Payment method selected!
          </motion.div>
        )}
        {paymentStatus === "error" && (
          <motion.div
            className="text-red-600 mt-3 text-sm text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            Payment failed. Try again.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentSelection;
