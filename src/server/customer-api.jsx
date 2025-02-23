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

//--------------------ORDER API --------------------//

const ORDER_API_BASE_URL = 'http://localhost:8080/api/V3/order';

export const createOrderApi = async (orderData) => {
  try {
    const response = await axios.post(`${ORDER_API_BASE_URL}/create`, orderData);
    return response.data.order;
  } catch (error) {
    console.error("Error in createOrderApi:", error);
    throw error;
  }
};

export const getAllOrdersApi = async () => {
  try {
    const response = await axios.get(`${ORDER_API_BASE_URL}/`);
    return response.data.orders;
  } catch (error) {
    console.error("Error in getAllOrdersApi:", error);
    throw error;
  }
};

export const getUserOrdersApi = async (userId) => {
  try {
    const response = await axios.get(`${ORDER_API_BASE_URL}/user/${userId}`);
    return response.data.orders;
  } catch (error) {
    console.error("Error in getUserOrdersApi:", error);
    throw error;
  }
};

export const updateOrderStatusApi = async (orderId, status) => {
  try {
    const response = await axios.put(`${ORDER_API_BASE_URL}/update/${orderId}`, { status });
    return response.data.order;
  } catch (error) {
    console.error("Error in updateOrderStatusApi:", error);
    throw error;
  }
};

export const deleteOrderApi = async (orderId) => {
  try {
    const response = await axios.delete(`${ORDER_API_BASE_URL}/delete/${orderId}`);
    return response.data.message;
  } catch (error) {
    console.error("Error in deleteOrderApi:", error);
    throw error;
  }
};
