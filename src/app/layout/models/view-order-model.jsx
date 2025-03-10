import React, { useEffect, useState } from "react";
import { useOrder } from "../../../context/orderContext.jsx";

const ViewOrderModel = ({ onClose }) => {
  const { fetchAllOrders } = useOrder();
  const [orderList, setOrderList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      const fetchedOrders = await fetchAllOrders();
      setOrderList(fetchedOrders);
    };
    loadOrders();
  }, []);

  // Filter orders based on search query
  const filteredOrders = orderList.filter((order) =>
    order._id.includes(searchQuery) ||
    order.cartItems.some((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Order History</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Order ID or Product Name..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto rounded-lg border shadow-md">
          <table className="min-w-full bg-white rounded-lg border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-left">
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">Product Name</th>
                <th className="p-3 border">Address</th>
                <th className="p-3 border">Payment</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border hover:bg-gray-50 transition">
                    <td className="p-3 border">{order._id}</td>
                    <td className="p-3 border">
                      {order.cartItems.map((item) => (
                        <div key={item.productId} className="text-sm">
                          {item.productName}
                        </div>
                      ))}
                    </td>
                    <td className="p-3 border text-sm">
                      {order.addressId?.addressLine1}, {order.addressId?.city},{" "}
                      {order.addressId?.state}, {order.addressId?.postalCode},{" "}
                      {order.addressId?.country}
                    </td>
                    <td className="p-3 border">{order.payment}</td>
                    <td className="p-3 border">{order.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderModel;
