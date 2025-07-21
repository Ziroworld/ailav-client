// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { authFetch } from "../server/authserver"; // no need to import AuthServer if not using backend logout

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // { id, role, name, ... }
  const [loading, setLoading] = useState(true);

  // Try to load user info from backend using token on startup
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }
      try {
        const response = await authFetch("http://localhost:8080/api/V3/auth/currentuser", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
          localStorage.removeItem("accessToken");
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("accessToken");
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // --- LOGOUT: just clear token & user context, no backend call needed ---
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
