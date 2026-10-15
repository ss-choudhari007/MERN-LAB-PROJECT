import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag, ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";

export const Cart = () => {
  const { cart, cartCount, subtotal, loading, error, updateQuantity, removeFromCart, fetchCart } = useCart();
  const navigate = useNavigate();

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.product._id, item.quantity - 1);
    }
  };

  const handleIncrease = (item) => {
    const stock = item.product?.stock || 0;
    if (item.quantity < stock) {
      updateQuantity(item.product._id, item.quantity + 1);
    } else {
      alert(`Cannot add more. Only ${stock} units in stock.`);
    }
  };

  if (loading && cart.length === 0) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="state-container">
          <RefreshCw size={36} color="var(--color-primary)" style={{ animation: "spin 1s linear infinite", marginBottom: "1rem" }} />
          <div className="state-title">Loading your cart...</div>
        </div>
      </div>
    );
  }

  if (error && cart.length === 0) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="state-container">
          <AlertCircle size={48} color="var(--color-danger)" style={{ marginBottom: "1rem" }} />
          <div className="state-title">Unable to load your cart.</div>
          <button onClick={fetchCart} className="btn btn-primary" style={{ marginTop: "1rem" }}>
            <RefreshCw size={18} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (!cart || cart.length === 0) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="state-container">
          <div style={{ width: "4.5rem", height: "4.5rem", borderRadius: "var(--radius-full)", backgroundColor: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)", marginBottom: "1.25rem" }}>
            <ShoppingCart size={36} />
          </div>
          <div className="state-title">Your cart is empty 🛒</div>
          <p className="state-description">
            Looks like you haven't added anything to your cart yet. Discover trending products and add them with one click.
          </p>
          <Link to="/products" className="btn btn-primary">
            <ShoppingBag size={18} />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "3rem 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>My Shopping Cart</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          You have {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "start" }}>
        {/* Cart Item Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {cart.map((item) => {
            const product = item.product;
            if (!product) return null;

            const isMaxStock = item.quantity >= product.stock;

            return (
              <div
                key={product._id}
                className="card"
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Product Thumbnail */}
                <div style={{ width: "90px", height: "90px", borderRadius: "var(--radius-md)", overflow: "hidden", backgroundColor: "#f1f5f9", flexShrink: 0 }}>
                  <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                {/* Details */}
                <div style={{ flex: "1 1 200px" }}>
                  <Link to={`/products/${product._id}`} style={{ fontWeight: "600", fontSize: "1.05rem", color: "var(--text-main)", display: "block", marginBottom: "0.25rem" }}>
                    {product.name}
                  </Link>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                    Category: {product.category}
                  </div>
                  <div style={{ fontWeight: "700", color: "var(--color-primary)", fontSize: "1.1rem" }}>
                    ₹{product.price.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
                  <div className="quantity-control">
                    <button
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 1}
                      className="quantity-btn"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="quantity-val">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrease(item)}
                      disabled={isMaxStock}
                      className="quantity-btn"
                      title={isMaxStock ? "Maximum stock reached" : "Increase quantity"}
                    >
                      +
                    </button>
                  </div>
                  {isMaxStock && (
                    <span style={{ fontSize: "0.75rem", color: "#d97706", fontWeight: "600" }}>Max Stock</span>
                  )}
                </div>

                {/* Subtotal for Item */}
                <div style={{ textAlign: "right", minWidth: "100px" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Subtotal</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: "700" }}>
                    ₹{(product.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Remove Action */}
                <button
                  onClick={() => removeFromCart(product._id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-danger)",
                    cursor: "pointer",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Remove from cart"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary-box" style={{ borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)" }}>
          <h2 style={{ fontSize: "1.35rem", marginBottom: "1.25rem" }}>Order Summary</h2>

          {/* Free Shipping Progress Indicator */}
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-success-bg)",
              border: "1px solid #bbf7d0",
              color: "#166534",
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700", marginBottom: "0.4rem" }}>
              <span>🚚 Free Express Shipping Unlocked!</span>
            </div>
            <div style={{ width: "100%", height: "6px", backgroundColor: "#bbf7d0", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <div style={{ width: "100%", height: "100%", backgroundColor: "#16a34a", borderRadius: "var(--radius-full)" }} />
            </div>
          </div>

          <div className="summary-row">
            <span>Total Items</span>
            <span style={{ fontWeight: "600" }}>{cartCount} units</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span style={{ fontWeight: "600" }}>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Charges</span>
            <span style={{ color: "#16a34a", fontWeight: "700" }}>FREE</span>
          </div>

          <div className="summary-row total">
            <span>Order Total</span>
            <span style={{ color: "var(--color-primary)" }}>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="btn btn-primary btn-block"
            style={{ padding: "1rem", fontSize: "1.05rem", marginTop: "1.5rem" }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ marginTop: "1.25rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
            <ShieldCheck size={16} color="var(--color-primary)" />
            <span>Official Razorpay Payment Gateway Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
