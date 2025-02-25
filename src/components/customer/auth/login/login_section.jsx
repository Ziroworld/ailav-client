import { Link } from "react-router-dom";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthServer } from "../../../../server/authserver.js";
import { UserContext } from "../../../../context/userContext.jsx";

// Step 1: Email Modal
const EmailModal = ({ onSuccess, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await AuthServer.requestOtp(email);
    setLoading(false);
    if (response.success) {
      alert("OTP has been sent to your email.");
      onSuccess(email);
    } else {
      alert(`Error: ${response.error}`);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <p className="mb-4">Enter your registered email address.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border mb-4"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-black text-white rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Step 2: OTP Modal
const OtpModal = ({ email, onSuccess, onClose }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await AuthServer.verifyOtp(email, otp);
    setLoading(false);
    if (response.success) {
      alert("OTP verified successfully.");
      // Save userId returned by API to localStorage
      localStorage.setItem("resetUserId", response.userId);
      onSuccess();
    } else {
      alert(`Error: ${response.error}`);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
        <p className="mb-4">Please enter the OTP sent to {email}.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border mb-4"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-black text-white rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Step 3: New Password Modal
const NewPasswordModal = ({ email, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setLoading(true);
    // Retrieve the userId saved from OTP verification
    const userId = localStorage.getItem("resetUserId");
    const response = await AuthServer.resetPassword(userId, newPassword, email);
    setLoading(false);
    if (response.success) {
      alert("Password reset successfully. Please login with your new password.");
      localStorage.removeItem("resetUserId");
      onClose();
    } else {
      alert(`Error: ${response.error}`);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Set New Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border mb-4"
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border mb-4"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-black text-white rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LoginSection = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // "email" | "otp" | "newPassword"
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!credentials.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!credentials.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      const response = await AuthServer.login(credentials);
      if (response.success) {
        console.log("Login successful", response);
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userRole", response.role);
        // Instead of setting user from login response, fetch current user details
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
        if (response.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/homepage");
        }
      } else {
        setErrors({ submit: response.error });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link to="/homepage" className="text-xl font-bold text-black md:ml-[-150px]">
            AILAV
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center py-16">
        <div className="card w-96 bg-white shadow-xl border border-black">
          <div className="card-body relative">
            <h2 className="card-title text-black mb-4">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="input input-bordered bg-white text-black border-black"
                />
                {errors.username && (
                  <span className="text-red-500 text-sm mt-1">{errors.username}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input input-bordered bg-white text-black border-black"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1">{errors.password}</span>
                )}
                <div className="text-right mt-2">
                  <button
                    type="button"
                    className="text-blue-500 hover:underline text-sm"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotStep("email");
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <div className="form-control mt-6">
                <button type="submit" className="btn bg-black text-white hover:bg-gray-800">
                  Login
                </button>
              </div>
              {errors.submit && (
                <span className="text-red-500 text-sm">{errors.submit}</span>
              )}
            </form>

            <div className="text-center mt-4">
              <span>Not a user? </span>
              <Link to="/auth/register" className="text-black hover:underline">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Flow Modals */}
      {showForgotPassword && forgotStep === "email" && (
        <EmailModal
          onClose={() => setShowForgotPassword(false)}
          onSuccess={(email) => {
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
    </div>
  );
};

export default LoginSection;
