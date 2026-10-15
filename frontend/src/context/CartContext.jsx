import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { cartService } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data.cart || []);
    } catch (err) {
      console.warn("Failed to fetch cart:", err.message);
      setError("Unable to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Derived Values — calculate totals on frontend
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  }, [cart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      return { success: false, message: "Please log in to add items to your cart" };
    }
    try {
      const data = await cartService.addToCart(productId, quantity);
      setCart(data.cart || []);
      return { success: true, message: data.message || "Product added to cart" };
    } catch (err) {
      const msg = err.response?.data?.message || "Could not add product to cart";
      return { success: false, message: msg };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const data = await cartService.updateQuantity(productId, quantity);
      setCart(data.cart || []);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Could not update quantity";
      return { success: false, message: msg };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const data = await cartService.removeFromCart(productId);
      setCart(data.cart || []);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Could not remove product from cart";
      return { success: false, message: msg };
    }
  };

  // Immediately reset global cart state after verified order
  const clearCartState = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
