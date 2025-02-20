import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Check for authToken, and try to also read the userName from localStorage
  const [user, setUser] = useState(() => {
    return localStorage.getItem("authToken")
      ? { 
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
          // Make sure your API returns a 'name' (or 'username') property.
          setUser(userData);
          if (userData.name) {
            localStorage.setItem("userName", userData.name);
          }
        } else {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userName");
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
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
