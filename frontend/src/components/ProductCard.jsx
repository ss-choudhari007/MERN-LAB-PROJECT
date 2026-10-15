import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Check, Plus, Minus } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [selectedQty, setSelectedQty] = useState(1);
  const [addingCart, setAddingCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  const saved = isWishlisted(product._id);
  const isOutOfStock = product.stock <= 0;

  // Find if product is already in user's cart
  const cartItem = cart?.find(
    (item) => (item.product?._id || item.product)?.toString() === product._id?.toString()
  );
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setTogglingWishlist(true);
      await toggleWishlist(product);
    } finally {
      setTogglingWishlist(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setAddingCart(true);
      const res = await addToCart(product._id, selectedQty);
      if (res.success) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      } else {
        alert(res.message);
      }
    } finally {
      setAddingCart(false);
    }
  };

  const handleIncrementInCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCartQty >= product.stock) {
      alert(`Only ${product.stock} units available in stock`);
      return;
    }
    await updateQuantity(product._id, inCartQty + 1);
  };

  const handleDecrementInCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCartQty <= 1) {
      await removeFromCart(product._id);
    } else {
      await updateQuantity(product._id, inCartQty - 1);
    }
  };

  const handleQtyChange = (delta, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedQty((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > product.stock) return product.stock;
      return next;
    });
  };

  return (
    <div className="card product-card" style={{ transition: "all 0.28s ease" }}>
      {/* Product Image & Badges */}
      <div className="product-img-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />

        {/* Top Badges */}
        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", display: "flex", flexDirection: "column", gap: "0.35rem", zIndex: 2 }}>
          {product.price > 2000 ? (
            <span className="badge badge-primary" style={{ fontSize: "0.68rem", padding: "0.2rem 0.5rem", letterSpacing: "0.03em" }}>
              BESTSELLER
            </span>
          ) : (
            <span className="badge" style={{ backgroundColor: "#1e293b", color: "#ffffff", fontSize: "0.68rem", padding: "0.2rem 0.5rem" }}>
              CURATED
            </span>
          )}
        </div>

        <button
          onClick={handleWishlistClick}
          className={`wishlist-btn-overlay ${saved ? "saved" : ""}`}
          title={saved ? "Remove from Wishlist" : "Add to Wishlist"}
          disabled={togglingWishlist}
          style={{
            animation: saved ? "heartPop 0.35s ease" : undefined,
          }}
        >
          <Heart size={18} fill={saved ? "#b91c1c" : "none"} color={saved ? "#b91c1c" : "currentColor"} />
        </button>
      </div>

      {/* Content */}
      <div className="product-content">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
          <span className="product-category">{product.category}</span>
          <span className="rating-pill">★ 4.8</span>
        </div>

        <h3 className="product-title" title={product.name}>
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>

        <div className="product-price">
          ₹{product.price.toLocaleString("en-IN")}
        </div>

        <div className="product-stock">
          {isOutOfStock ? (
            <span className="badge badge-danger">Out of Stock</span>
          ) : product.stock <= 5 ? (
            <span className="badge badge-warning">Only {product.stock} units left!</span>
          ) : (
            <span className="badge badge-success">In Stock ({product.stock})</span>
          )}
        </div>

        {/* Quantity Stepper Controls (+ / -) */}
        {!isOutOfStock && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "var(--bg-muted)",
              padding: "0.35rem 0.65rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "0.75rem",
              fontSize: "0.85rem",
              border: "1px solid var(--border-light)",
            }}
          >
            <span style={{ fontWeight: "600", color: "var(--text-muted)" }}>
              {inCartQty > 0 ? "In Cart:" : "Quantity:"}
            </span>

            {inCartQty > 0 ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                <button
                  onClick={handleDecrementInCart}
                  className="btn btn-secondary"
                  style={{ width: "1.75rem", height: "1.75rem", padding: 0, borderRadius: "var(--radius-sm)" }}
                  title="Reduce quantity by 1"
                >
                  <Minus size={13} />
                </button>
                <span style={{ minWidth: "1.5rem", textAlign: "center", fontWeight: "700", color: "var(--color-primary)" }}>
                  {inCartQty}
                </span>
                <button
                  onClick={handleIncrementInCart}
                  disabled={inCartQty >= product.stock}
                  className="btn btn-secondary"
                  style={{ width: "1.75rem", height: "1.75rem", padding: 0, borderRadius: "var(--radius-sm)" }}
                  title="Add 1 more to cart"
                >
                  <Plus size={13} />
                </button>
              </div>
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                <button
                  onClick={(e) => handleQtyChange(-1, e)}
                  disabled={selectedQty <= 1}
                  className="btn btn-secondary"
                  style={{ width: "1.75rem", height: "1.75rem", padding: 0, borderRadius: "var(--radius-sm)" }}
                  title="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span style={{ minWidth: "1.5rem", textAlign: "center", fontWeight: "700" }}>
                  {selectedQty}
                </span>
                <button
                  onClick={(e) => handleQtyChange(1, e)}
                  disabled={selectedQty >= product.stock}
                  className="btn btn-secondary"
                  style={{ width: "1.75rem", height: "1.75rem", padding: 0, borderRadius: "var(--radius-sm)" }}
                  title="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "auto" }}>
          <Link
            to={`/products/${product._id}`}
            className="btn btn-secondary"
            style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}
          >
            <Eye size={16} />
            <span>Details</span>
          </Link>

          <button
            onClick={inCartQty > 0 ? handleIncrementInCart : handleAddToCart}
            disabled={addingCart || isOutOfStock || inCartQty >= product.stock}
            className={`btn ${justAdded ? "btn-secondary" : "btn-primary"}`}
            style={{
              padding: "0.5rem 0.75rem",
              fontSize: "0.85rem",
              backgroundColor: justAdded ? "#2e7d32" : undefined,
              color: justAdded ? "#ffffff" : undefined,
            }}
          >
            {addingCart ? (
              <span>Adding...</span>
            ) : justAdded ? (
              <>
                <Check size={16} />
                <span>Added</span>
              </>
            ) : inCartQty > 0 ? (
              <>
                <Plus size={16} />
                <span>Add More</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add {selectedQty > 1 ? `(${selectedQty})` : ""}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
