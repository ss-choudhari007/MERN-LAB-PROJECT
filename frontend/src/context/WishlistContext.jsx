import React, { createContext, useContext, useState, useEffect } from "react";
import { wishlistService } from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await wishlistService.getWishlist();
      setWishlist(data.wishlist || []);
    } catch (err) {
      console.warn("Failed to fetch wishlist:", err.message);
      setError("Unable to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const isWishlisted = (productId) => {
    if (!productId || !wishlist) return false;
    return wishlist.some(
      (item) => (item._id || item).toString() === productId.toString()
    );
  };

  const toggleWishlist = async (product) => {
    if (!user) return { success: false, message: "Please login first" };
    const productId = product._id || product;

    try {
      const res = await wishlistService.toggleWishlist(productId);
      if (res.saved) {
        // Add to state if not present
        setWishlist((prev) => [...prev, product]);
      } else {
        // Remove from state
        setWishlist((prev) =>
          prev.filter((item) => (item._id || item).toString() !== productId.toString())
        );
      }
      return { success: true, saved: res.saved, message: res.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update wishlist",
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlist((prev) =>
        prev.filter((item) => (item._id || item).toString() !== productId.toString())
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to remove from wishlist",
      };
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        error,
        fetchWishlist,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export default WishlistContext;
