import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
  
      console.log("Stored Token:", token); // ✅ Debugging
  
      if (token) {
        try {
          const response = await fetch("http://localhost:8080/api/V3/auth/currentuser", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
  
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            // console.log("Fetched User:", userData); // ✅ Debugging
  
            // ✅ Redirect admin users to the dashboard
            if (userData.role === "admin") {
              navigate("/admin/dashboard");
            }
          } else {
            const errorMessage = await response.json();
            console.error("Failed to fetch user:", errorMessage);
            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");
            navigate("/auth/login");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          navigate("/auth/login");
        }
      } else {
        navigate("/auth/login");
      }
      setLoading(false);
    };
  
    fetchUser();
  }, [navigate]);
  

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole"); // ✅ Remove role on logout
    setUser(null);
    navigate("/auth/login"); // Redirect to login after logout
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children} {/* Only render when loading is complete */}
    </UserContext.Provider>
  );
};



