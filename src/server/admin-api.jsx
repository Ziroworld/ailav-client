// src/server/admin-api.js (or whatever your filename is)
import { authFetch } from './authFetch';
//-----------------API FOR USERS DASHBOARD----------------//
const USER_API_BASE_URL = 'https://localhost:8080/api/V3/users';

export const getUsers = async () => {
  const response = await authFetch(`${USER_API_BASE_URL}/user`);
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

export const deleteUser = async (userId) => {
  const response = await authFetch(`${USER_API_BASE_URL}/${userId}`, {
    method: 'DELETE'
    // authFetch adds Authorization header & CSRF for you
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

//------------------API FOR CATEGORY----------------//
const CATEGORY_API_BASE_URL = 'https://localhost:8080/api/V3/category';

export const createCategory = async (payload) => {
  const response = await authFetch(`${CATEGORY_API_BASE_URL}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

export const getCategories = async () => {
  const response = await authFetch(`${CATEGORY_API_BASE_URL}/findAll`);
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

//--------------------API FOR PRODUCT DASHBOARD-------------------//
const PRODUCT_API_BASE_URL = 'https://localhost:8080/api/V3/product';
// const PRODUCT_API_BASE_URL = '/api/V3/product/findAll';

export const createProduct = async (payload) => {
  const response = await authFetch(`${PRODUCT_API_BASE_URL}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

export const getProducts = async () => {
  const response = await authFetch(`${PRODUCT_API_BASE_URL}/findall`);
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

export const deleteProduct = async (productId) => {
  const response = await authFetch(`${PRODUCT_API_BASE_URL}/${productId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

export const getProductById = async (id) => {
  const response = await authFetch(`${PRODUCT_API_BASE_URL}/${id}`);
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
