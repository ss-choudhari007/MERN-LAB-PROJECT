import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication Services
export const authService = {
  register: async (userData) => {
    const res = await api.post("/customers/register", userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post("/customers/login", credentials);
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get("/customers/me");
    return res.data;
  },
  logout: async () => {
    const res = await api.post("/customers/logout");
    return res.data;
  },
  changePassword: async (passwords) => {
    const res = await api.patch("/customers/change-password", passwords);
    return res.data;
  },
};

// Product Services
export const productService = {
  getProducts: async ({ search = "", category = "", sort = "" } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "All") params.append("category", category);
    if (sort) params.append("sort", sort);

    const res = await api.get(`/products?${params.toString()}`);
    return res.data;
  },
  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  createProduct: async (productData) => {
    const res = await api.post("/products", productData);
    return res.data;
  },
};

// Wishlist Services
export const wishlistService = {
  getWishlist: async () => {
    const res = await api.get("/wishlist");
    return res.data;
  },
  addToWishlist: async (productId) => {
    const res = await api.post(`/wishlist/${productId}`);
    return res.data;
  },
  removeFromWishlist: async (productId) => {
    const res = await api.delete(`/wishlist/${productId}`);
    return res.data;
  },
  toggleWishlist: async (productId) => {
    const res = await api.patch(`/wishlist/${productId}/toggle`);
    return res.data;
  },
};

// Cart Services
export const cartService = {
  getCart: async () => {
    const res = await api.get("/cart");
    return res.data;
  },
  addToCart: async (productId, quantity = 1) => {
    const res = await api.post(`/cart/${productId}`, { quantity });
    return res.data;
  },
  updateQuantity: async (productId, quantity) => {
    const res = await api.patch(`/cart/${productId}`, { quantity });
    return res.data;
  },
  removeFromCart: async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    return res.data;
  },
};

// Order & Payment Services
export const orderService = {
  createPaymentOrder: async (shippingAddress) => {
    const res = await api.post("/orders/create-payment-order", { shippingAddress });
    return res.data;
  },
  verifyPayment: async (paymentData) => {
    const res = await api.post("/orders/verify-payment", paymentData);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get("/orders");
    return res.data;
  },
  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  updateOrderStatus: async (id, status) => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res.data;
  },
};

export default api;
