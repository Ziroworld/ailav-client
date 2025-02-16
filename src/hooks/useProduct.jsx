import { useState, useEffect } from "react";
import { getProducts } from "../server/admin-api.jsx"; // Ensure correct path

const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => {
        // Ensure data is an array
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { products, setProducts, loading, error };
};

export default useProduct;
