import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // If token exists, read additional properties from localStorage (including userId)
  const [user, setUser] = useState(() => {
    return localStorage.getItem("authToken")
      ? { 
          id: localStorage.getItem("userId"),
          role: localStorage.getItem("userRole"),
          name: localStorage.getItem("userName") || null
        }
      : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

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
          // Save the user id as well as the name/role
          setUser(userData);
          if (userData.username) {
            localStorage.setItem("userName", userData.username);
          } else if (userData.name) {
            localStorage.setItem("userName", userData.name);
          }
          localStorage.setItem("userId", userData.id);
          localStorage.setItem("userRole", userData.role);
        } else {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userName");
          localStorage.removeItem("userId");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
