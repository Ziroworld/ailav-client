import axios from 'axios';


//-------------API FOR USERS DASHBOARD----------------//
const USER_API_BASE_URL = 'http://localhost:8080/api/V3/users';


export const getUsers = async () => {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}/user`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.delete(`${USER_API_BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
//------------------API FOR CATEGORY----------------//
const CATEGORY_API_BASE_URL = 'http://localhost:8080/api/V3/category';

export const createCategory = async (payload) => {
  try {
    const response = await axios.post(`${CATEGORY_API_BASE_URL}/save`, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${CATEGORY_API_BASE_URL}/findAll`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
//-----------------------API FOR PRODUCT DASHBOARD--------------------//

const PRODUCT_API_BASE_URL = 'http://localhost:8080/api/V3/product';

export const createProduct = async (payload) => {
  try {
    console.log("Sending payload to create product:", payload);
    const response = await axios.post(`${PRODUCT_API_BASE_URL}/save`, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get(`${PRODUCT_API_BASE_URL}/findall`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${PRODUCT_API_BASE_URL}/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${PRODUCT_API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};
