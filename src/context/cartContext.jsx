import React, { createContext, useState, useEffect, useContext } from 'react';
import { addToCartApi, getCartApi, removeFromCartApi, clearCartApi } from '../server/customer-api.jsx';
import { UserContext } from './userContext.jsx';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState({ items: [] });

  // Helper: Get the user's unique identifier (supporting either id or userId)
  const getUserId = () => user && (user.id || user.userId);

  // Merge local cart into backend cart if user just logged in
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      const localCartStr = localStorage.getItem('cart');
      if (localCartStr) {
        const localCart = JSON.parse(localCartStr);
        if (localCart.items && localCart.items.length > 0) {
          Promise.all(
            localCart.items.map((item) =>
              addToCartApi(userId, item.productId, item.quantity)
            )
          )
            .then(() => {
              localStorage.removeItem('cart');
              return getCartApi(userId);
            })
            .then((data) => {
              setCart({ items: data.cart || data });
            })
            .catch((error) => console.error("Error merging cart items:", error));
          return;
        }
      }
      getCartApi(userId)
        .then((data) => setCart({ items: data.cart || data }))
        .catch((error) => console.error('Error fetching cart:', error));
    } else {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      }
    }
  }, [user]);

  // Persist cart in localStorage for unregistered users
  useEffect(() => {
    if (!getUserId()) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product, quantity = 1) => {
    const userId = getUserId();
    if (userId) {
      try {
        const updatedCart = await addToCartApi(userId, product._id, quantity);
        setCart({ items: updatedCart.cart || updatedCart });
      } catch (error) {
        console.error('Error adding product to cart:', error);
      }
    } else {
      const existingItem = cart.items.find(item => item.productId === product._id);
      let newCart;
      if (existingItem) {
        newCart = {
          ...cart,
          items: cart.items.map(item =>
            item.productId === product._id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      } else {
        newCart = {
          ...cart,
          items: [
            ...cart.items,
            {
              productId: product._id,
              productName: product.name,
              productImage: product.imageUrl,
              quantity,
              price: product.price,
            },
          ],
        };
      }
      setCart(newCart);
    }
  };

  const removeFromCart = async (productId) => {
    const userId = getUserId();
    if (userId) {
      try {
        const updatedCart = await removeFromCartApi(userId, productId);
        setCart({ items: updatedCart.cart || updatedCart });
      } catch (error) {
        console.error('Error removing product from cart:', error);
      }
    } else {
      const newCart = {
        ...cart,
        items: cart.items.filter(item => item.productId !== productId),
      };
      setCart(newCart);
    }
  };

  // New clearCart function to remove all items after order is placed
  const clearCart = async () => {
    const userId = getUserId();
    if (userId) {
      try {
        const clearedCart = await clearCartApi(userId);
        setCart({ items: clearedCart.cart || clearedCart });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      setCart({ items: [] });
      localStorage.removeItem('cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
