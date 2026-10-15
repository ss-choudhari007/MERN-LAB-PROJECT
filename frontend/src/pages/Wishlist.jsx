import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Eye, ShoppingCart, RefreshCw, AlertCircle, ShoppingBag } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (product) => {
    const res = await addToCart(product._id);
    if (!res.success) {
      alert(res.message);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="state-container">
          <RefreshCw size={36} color="var(--color-primary)" style={{ animation: "spin 1s linear infinite", marginBottom: "1rem" }} />
          <div className="state-title">Loading your wishlist...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="state-container">
          <AlertCircle size={48} color="var(--color-danger)" style={{ marginBottom: "1rem" }} />
          <div className="state-title">Something went wrong.</div>
          <p className="state-description">We couldn't load your wishlist.</p>
          <button onClick={fetchWishlist} className="btn btn-primary">
            <RefreshCw size={18} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="state-container">
          <div style={{ width: "4rem", height: "4rem", borderRadius: "var(--radius-full)", backgroundColor: "#ffe4e6", display: "flex", alignItems: "center", justifyContent: "center", color: "#e11d48", marginBottom: "1.25rem" }}>
            <Heart size={32} fill="#e11d48" />
          </div>
          <div className="state-title">Your wishlist is empty ❤️</div>
          <p className="state-description">
            Save products you love and find them here later.
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
      {/* Title Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>My Wishlist</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          {wishlist.length} {wishlist.length === 1 ? "product saved" : "products saved"}
        </p>
      </div>

      {/* Wishlist Grid */}
      <div className="grid-products">
        {wishlist.map((product) => {
          const isOutOfStock = product.stock <= 0;
          return (
            <div key={product._id} className="card product-card">
              <div className="product-img-wrapper">
                <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
              </div>

              <div className="product-content">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title" title={product.name}>
                  <Link to={`/products/${product._id}`}>{product.name}</Link>
                </h3>

                <div className="product-price">
                  ₹{product.price?.toLocaleString("en-IN")}
                </div>

                <div className="product-stock">
                  {isOutOfStock ? (
                    <span className="badge badge-danger">Out of Stock</span>
                  ) : product.stock <= 5 ? (
                    <span className="badge badge-warning">Only {product.stock} left</span>
                  ) : (
                    <span className="badge badge-success">In Stock ({product.stock})</span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <Link
                      to={`/products/${product._id}`}
                      className="btn btn-secondary"
                      style={{ padding: "0.5rem", fontSize: "0.85rem" }}
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </Link>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock}
                      className="btn btn-primary"
                      style={{ padding: "0.5rem", fontSize: "0.85rem" }}
                    >
                      <ShoppingCart size={16} />
                      <span>Add Cart</span>
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="btn btn-outline-danger"
                    style={{ padding: "0.5rem", fontSize: "0.85rem", width: "100%" }}
                  >
                    <Trash2 size={16} />
                    <span>Remove from Wishlist</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
