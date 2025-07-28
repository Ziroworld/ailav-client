import React, { createContext, useState, useEffect } from "react";
import { authFetch } from "../server/authFetch";
import { AuthServer } from "../server/authserver";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }
      try {
        const response = await authFetch("https://localhost:8080/api/V3/auth/currentuser", {
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

  // LOGOUT: clear everything
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    AuthServer.clearCsrfToken();
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
