import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCart } from '../../../../hooks/useCart.jsx';
import { useOrder } from '../../../../context/orderContext.jsx';
import { UserContext } from '../../../../context/userContext.jsx'; // <-- Added this line

const OrderSection = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart(); // <-- Get clearCart from useCart
  const { createOrder } = useOrder();
  const { user } = useContext(UserContext); // <-- Added this line
  const [showNotification, setShowNotification] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');

  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  // Payment methods – two options for now: "cash" and "qr"
  const paymentMethods = [
    { id: 'cash', name: 'Cash on Delivery', description: 'Pay when you receive your order' },
    { id: 'qr', name: 'QR Payment', description: 'Scan a QR code to pay' }
  ];

  const calculateTotal = () =>
    cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }
  
    // Check if address fields are filled properly
    if (!formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      alert("Please fill all required address fields.");
      return;
    }
  
    // Ensure user is logged in
    if (!user || !user.id) {
      alert("User is not logged in. Please log in before placing an order.");
      return;
    }
  
    try {
      console.log("Sending Order Data:", {
        userId: user.id,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        payment: selectedPayment
      });
  
      const orderData = {
        userId: user.id,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        payment: selectedPayment
      };
  
      await createOrder(orderData); // Call API to create order
      
      // Clear the cart after successful order
      await clearCart();
  
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error("Error creating order:", error);
  
      if (error.response) {
        console.error("Backend Error Response:", error.response.data);
        alert(`Order failed: ${error.response.data.message}`);
      } else {
        alert("Failed to create order. Please try again.");
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8 text-center">Complete Your Order</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={item.productImage || item.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.productName}</h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity} &times; ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  placeholder="Street address"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="flex flex-wrap gap-3">
              {paymentMethods.map(method => (
                <label
                  key={method.id}
                  className={`flex items-center p-2 border rounded-md cursor-pointer transition-colors 
                    ${selectedPayment === method.id ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="hidden"
                  />
                  <div className="ml-2">
                    <h3 className="text-sm font-medium">{method.name}</h3>
                    <p className="text-xs text-gray-500">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Place Order Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
            >
              Place Order
            </button>
          </div>
        </form>

        {/* Success Notification */}
        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <Check className="w-5 h-5 mr-2" />
            Your order has been placed successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSection;
