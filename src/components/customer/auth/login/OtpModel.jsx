import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, KeyRound, Repeat } from "lucide-react";
import { AuthServer } from "../../../../server/authserver.js";
import { toast } from "sonner";

const Stepper = () => (
  <div className="flex flex-col items-center mb-6">
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1.2, backgroundColor: "#0284c7" }}
      className="rounded-full flex items-center justify-center shadow-lg mb-2"
      style={{ width: 44, height: 44, background: "#0284c7" }}>
      <KeyRound className="text-white" />
    </motion.div>
    <span className="text-xs font-semibold text-blue-600">OTP</span>
  </div>
);

const OtpModal = ({
  email, onSuccess, onClose,
  attemptCount = 0, maxAttempts = 5,
  cooldown = 0, resendDisabled = false, onResend,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="bg-base-100 p-6 rounded-2xl shadow-2xl w-96 border-2 border-blue-300"
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}>
        <Stepper />
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-blue-600">
          <KeyRound className="text-blue-500" size={22} /> Enter OTP
        </h2>
        <p className="mb-3 text-gray-700 text-sm">
          Enter the 6-digit OTP sent to <b>{email}</b>.
          <span className="block mt-2 text-[13px]">
            <b>Attempts:</b>{" "}
            <span className={attemptCount >= maxAttempts ? "text-error" : "text-green-600"}>
              {attemptCount}/{maxAttempts}
            </span>
          </span>
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const res = await AuthServer.verifyOtp(email, otp);
            setLoading(false);
            if (res.success) {
              toast.success("OTP verified!");
              localStorage.setItem("resetUserId", res.userId);
              onSuccess();
            } else {
              toast.error(res.error || "Invalid OTP.");
            }
          }}
          className="flex flex-col gap-2"
        >
          <input
            type="text"
            placeholder="OTP Code"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="input input-bordered w-full"
            required disabled={attemptCount >= maxAttempts || loading}
          />
          <div className="flex justify-between items-center mt-2">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading || attemptCount >= maxAttempts}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Verify OTP"}
            </button>
          </div>
        </form>
        <div className="mt-2 flex flex-col items-center">
          <button
            className="btn btn-link text-blue-700"
            disabled={resendDisabled}
            onClick={onResend}
          >
            <Repeat className="inline-block mr-2" size={16} />
            {resendDisabled ? `Resend available in ${cooldown}s` : "Send another OTP?"}
          </button>
        </div>
        {attemptCount >= maxAttempts && (
          <div className="text-error text-center mt-3">Too many attempts! Try again after cooldown.</div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OtpModal;
