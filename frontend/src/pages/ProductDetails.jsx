import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, ShieldCheck, Truck, RotateCcw, AlertCircle, RefreshCw, Check } from "lucide-react";
import { productService } from "../services/api";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingCart, setAddingCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error("Fetch product error:", err.message);
      setError(err.response?.data?.message || "Product not found or unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const saved = product ? isWishlisted(product._id) : false;
  const isOutOfStock = product ? product.stock <= 0 : false;

  const handleWishlistClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setTogglingWishlist(true);
    try {
      await toggleWishlist(product);
    } finally {
      setTogglingWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAddingCart(true);
    try {
      const res = await addToCart(product._id);
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

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="state-container">
          <RefreshCw size={36} color="var(--color-primary)" style={{ animation: "spin 1s linear infinite", marginBottom: "1rem" }} />
          <div className="state-title">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="state-container">
          <AlertCircle size={48} color="var(--color-danger)" style={{ marginBottom: "1rem" }} />
          <div className="state-title">Product Not Found</div>
          <p className="state-description">{error || "The requested product does not exist."}</p>
          <Link to="/products" className="btn btn-primary">
            <ArrowLeft size={18} />
            <span>Return to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "3rem 1rem" }}>
      {/* Back to Products */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          to="/products"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--text-muted)",
            fontSize: "0.95rem",
            fontWeight: "500",
          }}
        >
          <ArrowLeft size={18} />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Main Product Showcase */}
      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "3rem",
          padding: "2.5rem",
        }}
      >
        {/* Large Product Image */}
        <div
          style={{
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            backgroundColor: "#f1f5f9",
            position: "relative",
            maxHeight: "520px",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Product Details & Actions */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
            <span className="badge badge-primary" style={{ textTransform: "uppercase", letterSpacing: "0.05em", padding: "0.35rem 0.75rem" }}>
              {product.category}
            </span>

            <button
              onClick={handleWishlistClick}
              disabled={togglingWishlist}
              className={`wishlist-btn-overlay ${saved ? "saved" : ""}`}
              style={{ position: "static", width: "2.75rem", height: "2.75rem" }}
              title={saved ? "Remove from Wishlist" : "Save to Wishlist"}
            >
              <Heart size={20} fill={saved ? "#e11d48" : "none"} />
            </button>
          </div>

          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{product.name}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span className="rating-pill">★ 4.8 Rating</span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>• 120+ Verified Reviews</span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", fontWeight: "800", color: "var(--color-primary)" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Inclusive of all taxes</span>
          </div>

          {/* Stock Status Badge */}
          <div style={{ marginBottom: "1.75rem" }}>
            {isOutOfStock ? (
              <span className="badge badge-danger" style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem" }}>
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="badge badge-warning" style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem" }}>
                Hurry! Only {product.stock} units remaining in stock
              </span>
            ) : (
              <span className="badge badge-success" style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem" }}>
                In Stock ({product.stock} available)
              </span>
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)", padding: "1.5rem 0", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Description
            </h3>
            <p style={{ fontSize: "1.05rem", lineHeight: "1.7", color: "var(--text-main)" }}>
              {product.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "auto", marginBottom: "2rem" }}>
            <button
              onClick={handleAddToCart}
              disabled={addingCart || isOutOfStock}
              className={`btn ${justAdded ? "btn-secondary" : "btn-primary"}`}
              style={{
                flex: "1 1 200px",
                padding: "0.95rem 1.5rem",
                fontSize: "1.05rem",
                backgroundColor: justAdded ? "#15803d" : undefined,
                color: justAdded ? "#ffffff" : undefined,
              }}
            >
              {addingCart ? (
                <span>Adding to Cart...</span>
              ) : justAdded ? (
                <>
                  <Check size={20} />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleWishlistClick}
              disabled={togglingWishlist}
              className={`btn ${saved ? "btn-outline-danger" : "btn-secondary"}`}
              style={{ padding: "0.95rem 1.5rem", fontSize: "1.05rem" }}
            >
              <Heart size={20} fill={saved ? "#e11d48" : "none"} />
              <span>{saved ? "Saved in Wishlist" : "Add to Wishlist"}</span>
            </button>
          </div>

          {/* Value Props */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Truck size={18} color="var(--color-primary)" />
              <span>Free Delivery across India</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldCheck size={18} color="var(--color-primary)" />
              <span>100% Genuine Products</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
