import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LockKeyhole } from "lucide-react";
import { AuthServer } from "../../../../server/authserver.js";
import { toast } from "sonner";

const Stepper = () => (
  <div className="flex flex-col items-center mb-6">
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1.2, backgroundColor: "#0284c7" }}
      className="rounded-full flex items-center justify-center shadow-lg mb-2"
      style={{ width: 44, height: 44, background: "#0284c7" }}>
      <LockKeyhole className="text-white" />
    </motion.div>
    <span className="text-xs font-semibold text-blue-600">New Password</span>
  </div>
);

const NewPasswordModal = ({
  email, onClose, attemptCount = 0, maxAttempts = 3,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState("");
  const zxcvbn = window.zxcvbn;

  const getStrength = (pwd) => {
    if (!zxcvbn) return "";
    const score = zxcvbn(pwd).score;
    if (score < 2) return "Weak";
    if (score < 3) return "Moderate";
    return "Strong";
  };

  const handlePwdChange = (e) => {
    setNewPassword(e.target.value);
    setStrength(getStrength(e.target.value));
  };

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="bg-base-100 p-6 rounded-2xl shadow-2xl w-96 border-2 border-blue-300"
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}>
        <Stepper />
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-blue-600">
          <LockKeyhole className="text-blue-500" size={22} /> Set New Password
        </h2>
        <p className="mb-3 text-gray-700 text-sm">
          Your new password must be strong and unique.
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
            if (newPassword !== confirmPassword) {
              toast.error("Passwords do not match.");
              return;
            }
            if (strength === "Weak") {
              toast.error("Password is too weak.");
              return;
            }
            setLoading(true);
            const userId = localStorage.getItem("resetUserId");
            const res = await AuthServer.resetPassword(userId, newPassword, email);
            setLoading(false);
            if (res.success) {
              toast.success("Password reset! Please login.");
              localStorage.removeItem("resetUserId");
              onClose();
            } else {
              toast.error(res.error || "Password reset failed.");
            }
          }}
          className="flex flex-col gap-2"
        >
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={handlePwdChange}
            className="input input-bordered w-full"
            required
            minLength={8}
            disabled={attemptCount >= maxAttempts || loading}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="input input-bordered w-full"
            required
            disabled={attemptCount >= maxAttempts || loading}
          />
          <div className="mb-2">
            {strength && (
              <span className={`text-xs font-semibold ${strength === "Strong" ? "text-green-600" : strength === "Moderate" ? "text-yellow-500" : "text-red-500"}`}>
                Password strength: {strength}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-success btn-sm" disabled={loading || attemptCount >= maxAttempts}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Reset Password"}
            </button>
          </div>
        </form>
        {attemptCount >= maxAttempts && (
          <div className="text-error text-center mt-3">Too many attempts! Try again after cooldown.</div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default NewPasswordModal;
