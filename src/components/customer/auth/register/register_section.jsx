import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthServer } from '../../../../server/authserver.js';
import { motion } from 'framer-motion';
import zxcvbn from 'zxcvbn';
import { Toaster, toast } from 'sonner';

const PASSWORD_RULES = [
  { regex: /.{8,32}/, message: '8-32 characters' },
  { regex: /[A-Z]/, message: '1 uppercase letter' },
  { regex: /[a-z]/, message: '1 lowercase letter' },
  { regex: /[0-9]/, message: '1 number' },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, message: '1 special character' },
];

const MIN_LENGTH = 8;
const MAX_LENGTH = 32;
const previousPasswords = ['Qwerty@2024', 'Test1234@', 'MyOldPass$1'];

const RegisterSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    age: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [rulesMet, setRulesMet] = useState({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const navigate = useNavigate();

  const isPasswordReused = (pwd) =>
    previousPasswords.some(
      (old) => old && pwd && pwd.trim().toLowerCase() === old.trim().toLowerCase()
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "password") {
      const result = zxcvbn(value);
      setPasswordScore(result.score);
      setPasswordFeedback(result.feedback.suggestions?.[0] || '');
      const newRules = {};
      for (const rule of PASSWORD_RULES) {
        newRules[rule.message] = rule.regex.test(value);
      }
      setRulesMet(newRules);
    }
    // Remove error as user edits
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.age) newErrors.age = 'Age is required';
    else if (parseInt(formData.age) < 0) newErrors.age = 'Age cannot be negative';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      if (formData.password.length < MIN_LENGTH || formData.password.length > MAX_LENGTH) {
        newErrors.password = `Password must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`;
      }
      for (const rule of PASSWORD_RULES) {
        if (!rule.regex.test(formData.password)) {
          newErrors.password = 'Password does not meet complexity requirements';
        }
      }
      if (isPasswordReused(formData.password)) {
        newErrors.password = 'Do not reuse your recent passwords';
      }
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWasSubmitted(true);
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      const response = await AuthServer.register(formData);
      if (response.success) {
        localStorage.setItem("authToken", response.token);
        toast.success("Registration successful! Redirecting...");
        setTimeout(() => navigate("/homepage"), 1600);
      } else {
        setErrors({ submit: response.error });
        toast.error(response.error || "Registration failed");
      }
    } else {
      setErrors(newErrors);
      toast.error("Please fix the highlighted errors.");
    }
  };

  const getStrengthColor = () => {
    switch (passwordScore) {
      case 0: return 'bg-gray-300';
      case 1: return 'bg-gray-400';
      case 2: return 'bg-gray-500';
      case 3: return 'bg-gray-700';
      case 4: return 'bg-black';
      default: return 'bg-gray-200';
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 80, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.9 } }
  };

  const inputClasses = (errorField, value) =>
    `w-full rounded-md bg-white text-black px-4 py-3 border 
    ${errors[errorField] && (wasSubmitted || value === "") ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-200'}
    focus:border-black focus:ring-2 focus:ring-black outline-none transition`;

  return (
    <div className="min-h-screen w-full bg-white flex flex-col pb-40">
      <Toaster position="top-center" richColors />
      <nav className="w-full flex px-8 py-6">
        <Link to="/homepage" className="text-2xl font-bold text-black underline">
          AILAV
        </Link>
      </nav>
      <motion.div
        className="flex-1 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={cardVariant}
      >
        <motion.div
          className="w-full max-w-md bg-white shadow-2xl rounded-2xl border border-gray-200 relative"
          whileHover={{ scale: 1.012 }}
        >
          <div className="px-7 py-12">
            <h2 className="text-center text-2xl font-black text-black mb-2 tracking-wider">
              Register
            </h2>
            <div className="text-center text-gray-500 mb-6 text-sm font-medium">
              Join <span className="font-bold text-black">AILAV</span> and unlock the power of AI-assisted productivity!
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block font-bold mb-1 text-black">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={inputClasses('name', formData.name)}
                  autoComplete="off"
                  required
                />
                {((errors.name && (wasSubmitted || formData.name === ""))) && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
              </div>
              {/* Username */}
              <div>
                <label className="block font-bold mb-1 text-black">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. johndoe123"
                  className={inputClasses('username', formData.username)}
                  autoComplete="off"
                  required
                />
                {((errors.username && (wasSubmitted || formData.username === ""))) && <span className="text-red-500 text-sm mt-1">{errors.username}</span>}
              </div>
              {/* Email */}
              <div>
                <label className="block font-bold mb-1 text-black">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. johndoe@email.com"
                  className={inputClasses('email', formData.email)}
                  autoComplete="off"
                  required
                />
                {((errors.email && (wasSubmitted || formData.email === ""))) && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
              </div>
              {/* Phone */}
              <div>
                <label className="block font-bold mb-1 text-black">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +977 9812345678"
                  className={inputClasses('phone', formData.phone)}
                  autoComplete="off"
                  required
                />
                {((errors.phone && (wasSubmitted || formData.phone === ""))) && <span className="text-red-500 text-sm mt-1">{errors.phone}</span>}
              </div>
              {/* Age */}
              <div>
                <label className="block font-bold mb-1 text-black">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 22"
                  className={inputClasses('age', formData.age)}
                  min="0"
                  autoComplete="off"
                  required
                />
                {((errors.age && (wasSubmitted || formData.age === ""))) && <span className="text-red-500 text-sm mt-1">{errors.age}</span>}
              </div>
              {/* Password */}
              <div>
                <label className="block font-bold mb-1 text-black">Password</label>
                <div className="flex justify-between items-center mb-1">
                  <span />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-xs text-gray-500 hover:underline focus:outline-none"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="e.g. Secure@2024"
                  className={inputClasses('password', formData.password)}
                  autoComplete="new-password"
                  required
                />
                {/* Strength meter */}
                <div className="mt-2">
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${getStrengthColor()}`}
                      style={{ width: `${(passwordScore + 1) * 20}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-gray-500">
                    <span>{["Too weak", "Weak", "Fair", "Good", "Strong"][passwordScore]}</span>
                    <span>{passwordFeedback}</span>
                  </div>
                  {/* Password rules */}
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {PASSWORD_RULES.map(rule => (
                      <span
                        key={rule.message}
                        className={`flex items-center gap-1 text-xs ${rulesMet[rule.message] ? 'text-black' : 'text-gray-400'}`}
                      >
                        <span>{rulesMet[rule.message] ? '✔️' : '❌'}</span>
                        {rule.message}
                      </span>
                    ))}
                  </div>
                  {isPasswordReused(formData.password) &&
                    <span className="text-red-500 text-xs flex items-center gap-1 mt-1">❌ Don’t reuse your last 3 passwords!</span>
                  }
                </div>
                {((errors.password && (wasSubmitted || formData.password === ""))) && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
              </div>
              {/* Confirm Password */}
              <div>
                <label className="block font-bold mb-1 text-black">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="retype your password"
                  className={inputClasses('confirmPassword', formData.confirmPassword)}
                  autoComplete="new-password"
                  required
                />
                {((errors.confirmPassword && (wasSubmitted || formData.confirmPassword === ""))) && <span className="text-red-500 text-sm mt-1">{errors.confirmPassword}</span>}
              </div>
              {/* Submit Button */}
              <div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full py-3 mt-2 bg-black text-white text-lg rounded-lg font-bold shadow-sm hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  Register
                </motion.button>
                {errors.submit && <span className="text-red-500 text-sm mt-2 block">{errors.submit}</span>}
              </div>
            </form>
            <div className="text-center mt-6">
              <span className="text-gray-500">Already a user? </span>
              <Link to="/auth/login" className="text-black hover:underline font-bold">Login</Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterSection;
