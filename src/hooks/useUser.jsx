import { useState, useEffect } from 'react';
import { getUsers } from '../server/admin-api'; // Adjust the path as needed

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((data) => {
        console.log("Fetched data:", data);
        // Ensure the returned data is an array.
        const userArray = Array.isArray(data) ? data : [];
        setUsers(userArray);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { users, setUsers, loading, error };
};

export default useUsers;
