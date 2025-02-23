import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../../../../hooks/useCart.jsx';
import { useNavigate } from 'react-router-dom';

const CartSection = () => {
  const navigate = useNavigate();
  const { cart, updateItemQuantity, removeFromCart } = useCart();

  const calculateItemTotal = (price, quantity) => price * quantity;
  const calculateGrandTotal = () =>
    cart.items.reduce((total, item) => total + calculateItemTotal(item.price, item.quantity), 0);

  // Handler for Proceed to Order - navigate to your order page (e.g., '/order')
  const handleProceedToOrder = () => {
    // Optionally: You could call OrderContext.createOrder here instead.
    navigate('/customer/order');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-grow">
            {cart.items.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Header (visible on medium and larger screens) */}
                <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-100 text-sm font-semibold text-gray-700">
                  <div className="col-span-2">Product</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div>Total</div>
                  <div></div>
                </div>
                {/* Cart Items */}
                {cart.items.map((item) => (
                  <div key={item.productId} className="border-t">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 items-center">
                      {/* Image and Product Name */}
                      <div className="col-span-2 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.productImage || item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.productName}</h3>
                        </div>
                      </div>
                      {/* Price (hidden on small screens) */}
                      <div className="hidden md:block text-gray-900">${item.price.toFixed(2)}</div>
                      {/* Quantity */}
                      <div className="flex items-center">
                        <div className="flex border rounded-lg overflow-hidden">
                          <button
                            className="px-3 py-1 text-gray-700 hover:bg-gray-200"
                            onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="text"
                            className="w-12 text-center border-none"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="px-3 py-1 text-gray-700 hover:bg-gray-200"
                            onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      {/* Total */}
                      <div className="text-right text-gray-900">
                        ${calculateItemTotal(item.price, item.quantity).toFixed(2)}
                      </div>
                      {/* Remove Button */}
                      <div className="flex justify-end">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm text-gray-700">
                    <span>
                      {item.productName} (x{item.quantity})
                    </span>
                    <span>${calculateItemTotal(item.price, item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Grand Total</span>
                  <span>${calculateGrandTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleProceedToOrder}
                className="w-full mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Proceed to Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSection;
