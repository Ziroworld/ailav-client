import { useState, useEffect } from 'react';
import { getCategories } from '../server/admin-api.jsx'; // Adjust path as needed

const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(false);
  const [errorCat, setErrorCat] = useState(null);

  useEffect(() => {
    setLoadingCat(true);
    getCategories()
      .then((data) => {
        // data is an object with a "categories" property that is the array we need.
        setCategories(Array.isArray(data.categories) ? data.categories : []);
        setLoadingCat(false);
      })
      .catch((err) => {
        setErrorCat(err);
        setLoadingCat(false);
      });
  }, []);

  return { categories, setCategories, loadingCat, errorCat };
};

export default useCategory;
