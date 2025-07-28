// src/server/customer-api.jsx
import { authFetch } from './authFetch';


// USER
const USER_API_BASE_URL = 'https://localhost:8080/api/V3/users';
export const updateUser = async (id, data) => {
  const response = await authFetch(`${USER_API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

// CART
const CART_API_BASE_URL = 'https://localhost:8080/api/V3/cart';
export const addToCartApi = async (userId, productId, quantity) => {
  const response = await authFetch(`${CART_API_BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId, quantity }),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
export const getCartApi = async (userId) => {
  const response = await authFetch(`${CART_API_BASE_URL}/${userId}`);
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
export const removeFromCartApi = async (userId, productId) => {
  const response = await authFetch(`${CART_API_BASE_URL}/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId }),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
export const clearCartApi = async (userId) => {
  const response = await authFetch(`${CART_API_BASE_URL}/clear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

// ORDER
const ORDER_API_BASE_URL = 'https://localhost:8080/api/V3/order';
export const createOrderApi = async (orderData) => {
  const response = await authFetch(`${ORDER_API_BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
export const getAllOrdersApi = async () => {
  const response = await authFetch(`${ORDER_API_BASE_URL}/`);
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
export const getUserOrdersApi = async (userId) => {
  const response = await authFetch(`${ORDER_API_BASE_URL}/user/${userId}`);
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
export const updateOrderStatusApi = async (orderId, status) => {
  const response = await authFetch(`${ORDER_API_BASE_URL}/update/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
export const deleteOrderApi = async (orderId) => {
  const response = await authFetch(`${ORDER_API_BASE_URL}/delete/${orderId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
