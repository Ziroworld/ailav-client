import React, { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthServer } from "../../../../server/authserver.js";
import { UserContext } from "../../../../context/userContext.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import EmailModal from "./EmailModel.jsx";
import OtpModal from "./OtpModel.jsx";
import NewPasswordModal from "./NewPasswordModel.jsx";

// Use Vite's import.meta.env for client env vars
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const LoginSection = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [resetEmail, setResetEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [isHuman, setIsHuman] = useState(false);
  const recaptchaRef = useRef();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // --- Validation ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!credentials.username.trim()) newErrors.username = "Username is required";
    if (!credentials.password) newErrors.password = "Password is required";
    if (!captchaToken) newErrors.captcha = "Please complete the CAPTCHA";
    if (!isHuman) newErrors.isHuman = "Please check the box to verify you are not a robot";
    if (!SITE_KEY) newErrors.sitekey = "CAPTCHA site key missing. Check your .env file.";
    return newErrors;
  };

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
    setErrors(prev => ({ ...prev, submit: '' }));
  };

  // --- Login Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the highlighted errors.");
      return;
    }

    const payload = { ...credentials, recaptchaToken: captchaToken };
    const response = await AuthServer.login(payload);

    if (response.success) {
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setCaptchaToken("");
      setIsHuman(false);
      toast.success("Login successful! Redirecting...");

      localStorage.setItem("accessToken", response.accessToken);

      // Fetch user details
      const currentUserRes = await fetch("https://localhost:8080/api/V3/auth/currentuser", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (currentUserRes.ok) {
        const currentUser = await currentUserRes.json();
        setUser(currentUser);

        setTimeout(() => {
          if (currentUser.role === "admin") navigate("/admin/dashboard");
          else navigate("/homepage");
        }, 800);
      } else {
        toast.error("Failed to fetch user profile after login.");
      }
    } else {
      setErrors({ submit: response.error });
      toast.error(response.error || "Login failed.");
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setCaptchaToken("");
      setIsHuman(false);
    }
  };

  // --- Animations ---
  const inputVariants = {
    initial: { y: 30, opacity: 0 },
    animate: (i) => ({ y: 0, opacity: 1, transition: { delay: i * 0.1 } }),
    shake: { x: [0, -8, 8, -8, 8, 0], transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/homepage" className="text-2xl font-bold text-black tracking-tight hover:opacity-80">
            AILAV
          </Link>
        </div>
      </nav>
      <div className="flex flex-1 items-center justify-center py-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}>
          <div className="card bg-white rounded-2xl shadow-2xl border border-black/10">
            <div className="card-body p-8 flex flex-col gap-3">
              <motion.h2
                className="font-bold text-3xl text-black text-center mb-3"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}>
                Welcome Back
              </motion.h2>
              <motion.form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={inputVariants} initial="initial" animate="animate" custom={0}>
                  <label className="block mb-1 text-black font-medium">Username</label>
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className={`input input-bordered w-full ${errors.username ? "input-error" : ""}`}
                  />
                  {errors.username && (
                    <motion.span
                      className="text-red-500 text-xs mt-1"
                      initial="initial"
                      animate="shake"
                      variants={inputVariants}>
                      {errors.username}
                    </motion.span>
                  )}
                </motion.div>
                <motion.div variants={inputVariants} initial="initial" animate="animate" custom={1}>
                  <label className="block mb-1 text-black font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
                  />
                  {errors.password && (
                    <motion.span
                      className="text-red-500 text-xs mt-1"
                      initial="initial"
                      animate="shake"
                      variants={inputVariants}>
                      {errors.password}
                    </motion.span>
                  )}
                  <div className="text-right mt-2">
                    <button
                      type="button"
                      className="text-blue-600 hover:underline text-xs"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setForgotStep("email");
                      }}>
                      Forgot password?
                    </button>
                  </div>
                </motion.div>
                <AnimatePresence>
                  <motion.div
                    key="captcha"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="my-2 flex flex-col items-center">
                    {SITE_KEY ? (
                      <>
                        <ReCAPTCHA
                          sitekey={SITE_KEY}
                          ref={recaptchaRef}
                          onChange={handleCaptcha}
                          onExpired={() => setCaptchaToken("")}
                        />
                        <label className="flex items-center gap-2 mt-3 text-xs">
                          <input
                            type="checkbox"
                            checked={isHuman}
                            onChange={e => setIsHuman(e.target.checked)}
                          />
                          I am not a robot
                        </label>
                      </>
                    ) : (
                      <span className="text-red-500 text-xs mt-2">
                        CAPTCHA site key is missing! Set <b>VITE_RECAPTCHA_SITE_KEY</b> in your .env.
                      </span>
                    )}
                    {(errors.captcha || errors.isHuman || errors.sitekey) && (
                      <motion.span
                        className="text-xs text-red-500 mt-2"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}>
                        {errors.captcha || errors.isHuman || errors.sitekey}
                      </motion.span>
                    )}
                  </motion.div>
                </AnimatePresence>
                <motion.div className="pt-3" variants={inputVariants} initial="initial" animate="animate" custom={3}>
                  <button
                    type="submit"
                    className="btn btn-neutral w-full rounded-xl text-lg"
                    disabled={!captchaToken || !isHuman || !SITE_KEY}>
                    Login
                  </button>
                  {errors.submit && (
                    <motion.span
                      className="text-red-500 text-xs block text-center mt-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}>
                      {errors.submit}
                    </motion.span>
                  )}
                </motion.div>
              </motion.form>
              <div className="text-center mt-6">
                <span className="text-black">Not a user? </span>
                <Link to="/auth/register" className="text-blue-600 font-medium hover:underline">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Forgot Password Modals */}
      <AnimatePresence>
        {showForgotPassword && forgotStep === "email" && (
          <EmailModal
            onClose={() => setShowForgotPassword(false)}
            onSuccess={email => {
              setResetEmail(email);
              setForgotStep("otp");
            }}
          />
        )}
        {showForgotPassword && forgotStep === "otp" && (
          <OtpModal
            email={resetEmail}
            onClose={() => setShowForgotPassword(false)}
            onSuccess={() => setForgotStep("newPassword")}
          />
        )}
        {showForgotPassword && forgotStep === "newPassword" && (
          <NewPasswordModal
            email={resetEmail}
            onClose={() => {
              setShowForgotPassword(false);
              setForgotStep("email");
              setResetEmail("");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginSection;
