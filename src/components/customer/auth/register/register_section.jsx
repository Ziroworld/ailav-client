import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthServer } from '../../../../server/authserver.js';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    validateName(newErrors);
    validateUsername(newErrors);
    validateEmail(newErrors);
    validatePhone(newErrors);
    validateAge(newErrors);
    validatePassword(newErrors);
    validateConfirmPassword(newErrors);

    return newErrors;
  };

  const validateName = (newErrors) => {
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
  };

  const validateUsername = (newErrors) => {
    if (!formData.username.trim()) newErrors.username = 'Username is required';
  };

  const validateEmail = (newErrors) => {
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
  };

  const validatePhone = (newErrors) => {
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
  };

  const validateAge = (newErrors) => {
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 0) {
      newErrors.age = 'Age cannot be negative';
    }
  };

  const validatePassword = (newErrors) => {
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
  };

  const validateConfirmPassword = (newErrors) => {
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
  
      const response = await AuthServer.register(formData);
  
      if (response.success) {
        // Store token in localStorage
        localStorage.setItem("authToken", response.token);
        console.log("JWT Token:", response.token);
  
        alert("Registration successful! Redirecting...");
        window.location.href = "/homepage"; 
      } else {
        console.log("Registration failed", response.error); 
        setErrors({ submit: response.error });
      }
    } else {
      console.log("Validation failed", newErrors);
      setErrors(newErrors);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-16 bg-white">
      <div className="card w-96 bg-white shadow-xl border border-black">
        <div className="card-body relative">
          <div className="absolute top-2 right-2">
            <div className="avatar placeholder">
              <div className="bg-black text-white rounded-full w-12">
                <span className="text-xl">👤</span>
              </div>
            </div>
          </div>
          
          <h2 className="card-title text-black mb-4">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input input-bordered bg-white text-black border-black"
              />
              {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe123"
                className="input input-bordered bg-white text-black border-black"
              />
              {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username}</span>}
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="input input-bordered bg-white text-black border-black"
              />
              {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Phone Number</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="input input-bordered bg-white text-black border-black"
              />
              {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Age</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
                min="0"
                className="input input-bordered bg-white text-black border-black"
              />
              {errors.age && <span className="text-red-500 text-sm mt-1">{errors.age}</span>}
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered bg-white text-black border-black"
              />
              {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered bg-white text-black border-black"
              />
              {errors.confirmPassword && <span className="text-red-500 text-sm mt-1">{errors.confirmPassword}</span>}
            </div>
            
            <div className="form-control mt-6">
              <button type="submit" className="btn bg-black text-white hover:bg-gray-800">
                Register
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <span>Already a user? </span>
            <Link to="/auth/login" className="text-black hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSection;