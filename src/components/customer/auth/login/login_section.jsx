// import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { AuthServer } from '../../../../server/authserver.js';

// const LoginSection = () => {
//   const [credentials, setCredentials] = useState({
//     username: '', // for username/email
//     password: ''
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!credentials.username.trim()) {
//       newErrors.username = 'Username or email is required';
//     }
//     if (!credentials.password) {
//       newErrors.password = 'Password is required';
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = validateForm();

//     if (Object.keys(newErrors).length === 0) {
//       const response = await AuthServer.login(credentials);
//       if (response.success) {
//         console.log('Login successful');
//          // ✅ Redirect based on role
//          if (response.role === "admin") {
//           navigate("/admin/dashboard");
//         } else {
//           navigate("/homepage");
//         }
//       } else {
//         setErrors({ submit: response.error });
//       }
//     } else {
//       setErrors(newErrors);
//     }
//   };

//   return (
//     <div className="">
//       <div className="card w-96 bg-white shadow-xl border border-black">
//         <div className="card-body relative">
//           <div className="absolute top-2 right-2">
//             <div className="avatar placeholder">
//               <div className="bg-black text-white rounded-full w-12">
//                 <span className="text-xl">👤</span>
//               </div>
//             </div>
//           </div>

//           <h2 className="card-title text-black mb-4">Login</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-black">Username or Email</span>
//               </label>
//               <input
//                 type="text"
//                 name="username"
//                 value={credentials.username}
//                 onChange={handleChange}
//                 placeholder="username or email"
//                 className="input input-bordered bg-white text-black border-black"
//               />
//               {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username}</span>}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-black">Password</span>
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={credentials.password}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 className="input input-bordered bg-white text-black border-black"
//               />
//               {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
//             </div>

//             <div className="form-control mt-6">
//               <button type="submit" className="btn bg-black text-white hover:bg-gray-800">
//                 Login
//               </button>
//             </div>
//           </form>

//           <div className="text-center mt-4">
//             <text>Not a user? </text>
//             <Link to="/auth/register" className="text-black hover:underline">
//                Register
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginSection;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { AuthServer } from "../../../../server/authserver.js";

const LoginSection = () => {
  const [credentials, setCredentials] = useState({
    username: "", // ✅ Only using username (not email)
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // ✅ Define navigate

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
      newErrors.username = "Username is required"; // ✅ Updated validation message
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
        console.log("Login successful");

        // ✅ Redirect based on role
        if (response.role === "admin") {
          navigate("/admin/dashboard"); // ✅ Works now
        } else {
          navigate("/homepage"); // ✅ Works now
        }
      } else {
        setErrors({ submit: response.error });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="">
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
              {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username}</span>}
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
              {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn bg-black text-white hover:bg-gray-800">
                Login
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <text>Not a user? </text>
            <Link to="/auth/register" className="text-black hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;
