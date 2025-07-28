import React, { useEffect, useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoneyBill, FaMobileAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";

const KHALTI_PUBLIC_TEST_KEY = "test_public_key_402c2b0e98364222bb1c1ab02369cefd";

const paymentOptions = [
  {
    id: "cod",
    label: "Cash on Delivery",
    icon: <FaMoneyBill className="text-black text-xl" />,
    color: "border-black bg-white",
  },
  {
    id: "khalti",
    label: "Khalti Wallet",
    icon: <FaMobileAlt className="text-[#7757f7] text-xl" />,
    color: "border-[#7757f7] bg-white",
  },
];

export default function PaymentSelection({
  totalAmount,
  onPaymentSuccess,
  disabled,
  selectedPayment,
  setSelectedPayment,
}) {
  const [khaltiCheckout, setKhaltiCheckout] = useState(null);
  const [paying, setPaying] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setKhaltiCheckout(
      new KhaltiCheckout({
        publicKey: KHALTI_PUBLIC_TEST_KEY,
        productIdentity: "order1234",
        productName: "Order",
        productUrl: "http://localhost:5173/",
        eventHandler: {
          onSuccess: (payload) => {
            setStatus("Khalti payment successful!");
            setPaying(false);
            setSelectedPayment("khalti");
            onPaymentSuccess("khalti", payload.token);
          },
          onError: () => {
            setPaying(false);
            setStatus("Payment failed or cancelled.");
          },
          onClose: () => setPaying(false),
        },
        paymentPreference: ["KHALTI"],
      })
    );
  }, []);

  // Select handler
  const handleSelect = (id) => {
    if (disabled) return;
    setSelectedPayment(id);
    setStatus("");
    if (id === "cod") {
      // For COD, mark as paid (simulate success)
      onPaymentSuccess("cod");
    }
  };

  // Khalti handler
  const handleKhaltiPay = () => {
    setPaying(true);
    setStatus("");
    khaltiCheckout.show({ amount: totalAmount * 100 });
  };

  return (
    <motion.div
      className="w-full flex flex-col gap-6"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-4">
        {paymentOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`flex flex-col items-center border-2 px-6 py-4 rounded-2xl min-w-[140px] transition-all duration-150
              ${selectedPayment === opt.id
                ? "shadow-lg border-black bg-black text-white scale-105"
                : `${opt.color} text-black hover:bg-gray-100`}`}
            disabled={disabled || paying}
            onClick={() => handleSelect(opt.id)}
          >
            <span className="mb-2">{opt.icon}</span>
            <span className="font-semibold">{opt.label}</span>
            {opt.id === "khalti" && (
              <span className="text-xs text-[#7757f7] mt-1">Instant Payment</span>
            )}
          </button>
        ))}
      </div>

      {/* Khalti Pay Button */}
      {selectedPayment === "khalti" && (
        <motion.div
          className="w-full flex flex-col items-center mt-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
        >
          <button
            onClick={handleKhaltiPay}
            disabled={paying || disabled}
            className={`w-full md:w-1/2 py-3 rounded-xl font-bold text-white text-lg mt-2
              transition-all bg-gradient-to-r from-[#5636d4] to-[#8b53fc] hover:from-[#7757f7] hover:to-[#5636d4]
              ${paying ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {paying ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Processing...
              </span>
            ) : (
              <>
                Pay with Khalti <span className="ml-2">₨{totalAmount.toLocaleString()}</span>
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Status or Success message */}
      <AnimatePresence>
        {status && (
          <motion.div
            className={`flex items-center justify-center mt-3 text-lg gap-2 ${
              status.includes("successful") ? "text-green-700" : "text-red-500"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {status.includes("successful") && <FaCheckCircle />}
            {status}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
