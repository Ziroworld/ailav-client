import axios from 'axios';

//--------------------CART API --------------------//
const CART_API_BASE_URL = 'http://localhost:8080/api/V3/cart';

export const addToCartApi = async (userId, productId, quantity) => {
  try {
    const response = await axios.post(`${CART_API_BASE_URL}/add`, { userId, productId, quantity });
    return response.data.cart;
  } catch (error) {
    console.error("Error in addToCartApi:", error);
    throw error;
  }
};

export const getCartApi = async (userId) => {
  try {
    const response = await axios.get(`${CART_API_BASE_URL}/${userId}`);
    return response.data.cart;
  } catch (error) {
    console.error("Error in getCartApi:", error);
    throw error;
  }
};

export const removeFromCartApi = async (userId, productId) => {
  try {
    const response = await axios.post(`${CART_API_BASE_URL}/remove`, { userId, productId });
    return response.data.cart;
  } catch (error) {
    console.error("Error in removeFromCartApi:", error);
    throw error;
  }
};

export const clearCartApi = async (userId) => {
  try {
    const response = await axios.post(`${CART_API_BASE_URL}/clear`, { userId });
    return response.data.cart;
  } catch (error) {
    console.error("Error in clearCartApi:", error);
    throw error;
  }
};