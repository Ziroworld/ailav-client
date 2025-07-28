import { useState, useEffect } from "react";
import { authFetch } from "../server/authFetch";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    authFetch("https://localhost:8080/api/V3/users")
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { users, setUsers, loading, error };
};

export default useUsers;
