import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthController } from '../../../../controller/authcontroller.js';

const RegisterSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
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

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 0) {
      newErrors.age = 'Age cannot be negative';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      const response = await AuthController.register(formData);
      if (response.success) {
        console.log('Registration successful');
        // TODO: Handle successful registration
      } else {
        setErrors({ submit: response.error });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-auto">
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
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="input input-bordered bg-white text-black border-black"
              />
              {errors.fullName && <span className="text-red-500 text-sm mt-1">{errors.fullName}</span>}
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
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="input input-bordered bg-white text-black border-black"
              />
              {errors.phoneNumber && <span className="text-red-500 text-sm mt-1">{errors.phoneNumber}</span>}
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
            <text>Already a user? </text>
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