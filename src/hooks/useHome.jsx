import { useState, useEffect } from "react";
import { getProducts } from "../server/admin-api.jsx"; // Ensure the correct path

const useHome = () => {
  const [homeData, setHomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setHomeData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { homeData, loading, error };
};

export default useHome;
