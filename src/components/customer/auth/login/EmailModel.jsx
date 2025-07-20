// src/components/customer/auth/login/EmailModel.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, Repeat } from "lucide-react";
import { AuthServer } from "../../../../server/authserver.js";
import { toast } from "sonner";

const Stepper = ({ step }) => (
  <div className="flex justify-between items-center mb-8 px-2">
    <div className="flex-1 flex flex-col items-center relative">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1.2, backgroundColor: "#0284c7" }}
        className="rounded-full flex items-center justify-center shadow-lg mb-2"
        style={{ width: 44, height: 44, background: "#0284c7" }}>
        <Mail className="text-white" />
      </motion.div>
      <span className="text-xs font-semibold text-blue-600">Email</span>
    </div>
  </div>
);

const MAX_ATTEMPTS = 3;
const COOLDOWN_SECONDS = 30;

const EmailModal = ({
  onSuccess,
  onClose,
  attemptCount = 0,
  maxAttempts = MAX_ATTEMPTS,
  cooldown = 0,
  resendDisabled = false,
  onResend,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [localAttempts, setLocalAttempts] = useState(0);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  // Cooldown timer
  React.useEffect(() => {
    if (cooldownLeft <= 0) return;
    const timer = setTimeout(() => setCooldownLeft(cooldownLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldownLeft]);

  const handleResend = async () => {
    setCooldownLeft(COOLDOWN_SECONDS);
    await handleSubmit(null, true);
  };

  const handleSubmit = async (e, isResend = false) => {
    if (e) e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await AuthServer.requestOtp(email);
      if (res.success) {
        toast.success("OTP sent to your email.");
        setLocalAttempts(0);
        if (onSuccess) onSuccess(email);
      } else {
        setLocalAttempts((prev) => prev + 1);
        toast.error(res.error || "Failed to send OTP.");
      }
    } catch (error) {
      setLocalAttempts((prev) => prev + 1);
      toast.error("An error occurred. Try again.");
    }
    setLoading(false);
  };

  const attempts = attemptCount + localAttempts;

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="bg-base-100 p-6 rounded-2xl shadow-2xl w-96 border-2 border-blue-300"
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}>
        <Stepper step={0} />
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-blue-600">
          <Mail className="text-blue-500" size={22} /> Forgot Password?
        </h2>
        <p className="mb-3 text-gray-700 text-sm">
          Please enter your registered email address.
          <span className="block mt-2 text-[13px]">
            <b>Attempts:</b>{" "}
            <span className={attempts >= maxAttempts ? "text-error" : "text-green-600"}>
              {attempts}/{maxAttempts}
            </span>
          </span>
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2"
        >
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input input-bordered w-full"
            required
            disabled={attempts >= maxAttempts || loading}
          />
          <div className="flex justify-between items-center mt-2">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-info btn-sm" disabled={loading || attempts >= maxAttempts}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Send OTP"}
            </button>
          </div>
        </form>
        <div className="mt-2 flex flex-col items-center">
          <button
            className="btn btn-link text-blue-700"
            disabled={cooldownLeft > 0}
            onClick={handleResend}
          >
            <Repeat className="inline-block mr-2" size={16} />
            {cooldownLeft > 0 ? `Resend available in ${cooldownLeft}s` : "Send another OTP?"}
          </button>
        </div>
        {attempts >= maxAttempts && (
          <div className="text-error text-center mt-3">Too many attempts! Try again after cooldown.</div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EmailModal;
