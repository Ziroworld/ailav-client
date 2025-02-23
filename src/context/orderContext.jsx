import React, { createContext, useContext, useState } from 'react';
import { createOrderApi, getAllOrdersApi, getUserOrdersApi, updateOrderStatusApi, deleteOrderApi } from '../server/customer-api.jsx';
import { UserContext } from './userContext.jsx';
import { CartContext } from './cartContext.jsx';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const { cart } = useContext(CartContext);
  const [orders, setOrders] = useState([]);

  const createOrder = async (orderData) => {
    if (!user || !user.id) {
      throw new Error('User is not logged in');
    }
    // Ensure that the userId is overridden from context
    orderData.userId = user.id;
    const order = await createOrderApi(orderData);
    return order;
  };  

  // Fetch orders for the logged-in user.
  const fetchUserOrders = async () => {
    if (!user || !user.id) {
      throw new Error('User is not logged in');
    }
    const userOrders = await getUserOrdersApi(user.id);
    setOrders(userOrders);
    return userOrders;
  };

  // Fetch all orders (for admin usage, for example)
  const fetchAllOrders = async () => {
    const allOrders = await getAllOrdersApi();
    setOrders(allOrders);
    return allOrders;
  };

  const updateOrderStatus = async (orderId, status) => {
    const updatedOrder = await updateOrderStatusApi(orderId, status);
    return updatedOrder;
  };

  const deleteOrder = async (orderId) => {
    await deleteOrderApi(orderId);
    // Optionally update local orders state here.
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, fetchUserOrders, fetchAllOrders, updateOrderStatus, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;
