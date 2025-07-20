import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext, useRef } from "react";
import { AuthServer } from "../../../../server/authserver.js"; // <-- FIXED
import { UserContext } from "../../../../context/userContext.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Modularized modals
import EmailModal from "./EmailModel.jsx";
import OtpModal from "./OtpModel.jsx";
import NewPasswordModal from "./NewPasswordModel.jsx";

const RECAPTCHA_SITE_KEY = "6LdVb4grAAAAAASHTnghKZ6WHMA9lMzZa5I8hcWk";

const LoginSection = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [resetEmail, setResetEmail] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [failCount, setFailCount] = useState(0);
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
    if (showCaptcha && !captchaToken) newErrors.captcha = "Please complete the CAPTCHA";
    return newErrors;
  };

  // --- Login Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (Object.keys(newErrors).includes("captcha")) {
        toast.error("Please complete the CAPTCHA.");
      }
      return;
    }

    const payload = showCaptcha ? { ...credentials, recaptchaToken: captchaToken } : credentials;
    const response = await AuthServer.login(payload);

    if (response.success) {
      setFailCount(0);
      setShowCaptcha(false);
      setCaptchaToken("");
      if (recaptchaRef.current) recaptchaRef.current.reset();
      toast.success("Login successful! Redirecting...");

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userRole", response.role);

      // fetch current user
      const currentUserRes = await fetch("http://localhost:8080/api/V3/auth/currentuser", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${response.token}`,
          "Content-Type": "application/json",
        },
      });
      if (currentUserRes.ok) {
        const currentUser = await currentUserRes.json();
        localStorage.setItem("userName", currentUser.username || currentUser.name);
        localStorage.setItem("userId", currentUser.id);
        setUser(currentUser);
      }
      setTimeout(() => {
        if (response.role === "admin") navigate("/admin/dashboard");
        else navigate("/homepage");
      }, 800);
    } else {
      setFailCount((prev) => {
        const newFail = prev + 1;
        if (newFail >= 3) setShowCaptcha(true);
        return newFail;
      });

      if (
        response.error &&
        (response.error.toLowerCase().includes("captcha") ||
         response.error.toLowerCase().includes("too many"))
      ) {
        setShowCaptcha(true);
        setErrors({
          submit: "Too many attempts. Please solve the CAPTCHA and retry.",
          captcha: "Please complete the CAPTCHA.",
        });
        toast.warning("Too many attempts. Please solve the CAPTCHA.");
      } else {
        setErrors({ submit: response.error });
        toast.error(response.error || "Login failed.");
      }
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setCaptchaToken("");
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
                  {showCaptcha && (
                    <motion.div
                      key="captcha"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      className="my-2 flex flex-col items-center">
                      <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        ref={recaptchaRef}
                        onChange={token => setCaptchaToken(token)}
                        onExpired={() => setCaptchaToken("")}
                      />
                      {errors.captcha && (
                        <motion.span
                          className="text-xs text-red-500 mt-2"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}>
                          {errors.captcha}
                        </motion.span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div className="pt-3" variants={inputVariants} initial="initial" animate="animate" custom={3}>
                  <button
                    type="submit"
                    className="btn btn-neutral w-full rounded-xl text-lg"
                    disabled={showCaptcha && !captchaToken}>
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
