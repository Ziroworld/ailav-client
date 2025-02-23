import React, { useEffect, useState } from "react";
import { useOrder } from "../../../context/orderContext.jsx";
import { Trash } from "lucide-react";

const OrderSection = () => {
  const { fetchAllOrders, updateOrderStatus, deleteOrder } = useOrder();
  const [orderList, setOrderList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      const fetchedOrders = await fetchAllOrders();
      setOrderList(fetchedOrders);
    };
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrderList((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(orderId);
      setOrderList((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    }
  };

  // Filter orders based on search query
  const filteredOrders = orderList.filter((order) =>
    order._id.includes(searchQuery) ||
    order.cartItems.some((item) => item.productName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Order Management</h2>

      {/* Search Bar */}
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search by Order ID or Product Name..."
          className="input input-bordered w-full max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table Wrapper for Responsive Design */}
      <div className="overflow-x-auto rounded-lg border shadow-md">
        <table className="min-w-full bg-white rounded-lg border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Product Name</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id} className="border hover:bg-gray-50 transition">
                  <td className="p-3 border">{order._id}</td>
                  <td className="p-3 border">
                    {order.cartItems.map((item) => (
                      <div key={item.productId} className="text-sm">{item.productName}</div>
                    ))}
                  </td>
                  <td className="p-3 border text-sm">
                    {order.addressId?.addressLine1}, {order.addressId?.city}, {order.addressId?.state}, {order.addressId?.postalCode}, {order.addressId?.country}
                  </td>
                  <td className="p-3 border">{order.payment}</td>
                  <td className="p-3 border">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border p-1 rounded bg-white cursor-pointer"
                    >
                      {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderSection;
