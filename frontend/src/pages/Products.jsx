import React, { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, AlertCircle, PackageX, Sparkles, RefreshCw } from "lucide-react";
import { productService } from "../services/api";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Books"];

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts({ search, category, sort });
      setProducts(data.products || []);
    } catch (err) {
      console.error("Products error:", err.message);
      setError("Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search / refetch on filter change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(handler);
  }, [search, category, sort]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("newest");
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1rem 4rem" }}>
      {/* Interactive Hero Showcase Banner */}
      <div className="hero-banner">
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="hero-tag">
            <Sparkles size={14} />
            <span>Curated Lifestyle & Electronics</span>
          </div>
          <h1 className="hero-title">Experience Better Shopping</h1>
          <p className="hero-subtitle">
            Browse our hand-picked catalog with live stock tracking, honest pricing, and instant checkout via official Razorpay gateway.
          </p>
          <div className="hero-features">
            <div className="hero-feature-item">
              <span>⚡ Fast Dispatch</span>
            </div>
            <div className="hero-feature-item">
              <span>🔒 Razorpay Secured</span>
            </div>
            <div className="hero-feature-item">
              <span>🛡️ 100% Genuine</span>
            </div>
            <div className="hero-feature-item">
              <span>🚚 Free Delivery Nationwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div
        className="card"
        style={{
          padding: "1.5rem",
          marginBottom: "2.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1.25rem",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "var(--shadow-md)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        {/* Search Input */}
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search products by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-full)" }}
          />
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "0.85rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "600",
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Filter size={15} /> Category:
          </span>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => {
              const iconMap = {
                All: "✦",
                Electronics: "⚡",
                Fashion: "✨",
                Home: "🏡",
                Books: "📖",
              };
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`btn ${category === cat ? "btn-primary" : "btn-secondary"}`}
                  style={{
                    padding: "0.4rem 0.85rem",
                    fontSize: "0.85rem",
                    borderRadius: "var(--radius-full)",
                    gap: "0.35rem",
                  }}
                >
                  <span>{iconMap[cat] || "•"}</span>
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ArrowUpDown size={16} color="var(--text-muted)" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="form-select"
            style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", height: "2.75rem", width: "auto", borderRadius: "var(--radius-full)" }}
          >
            <option value="newest">Sort by: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="state-container">
          <RefreshCw size={36} color="var(--color-primary)" style={{ animation: "spin 1s linear infinite", marginBottom: "1rem" }} />
          <div className="state-title">Loading products...</div>
          <p className="state-description">Fetching the latest catalog items from MongoDB.</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="state-container">
          <AlertCircle size={48} color="var(--color-danger)" style={{ marginBottom: "1rem" }} />
          <div className="state-title">Something went wrong while loading products.</div>
          <p className="state-description">{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary">
            <RefreshCw size={18} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="state-container">
          <PackageX size={54} color="#94a3b8" style={{ marginBottom: "1rem" }} />
          <div className="state-title">No products found.</div>
          <p className="state-description">
            We couldn't find any products matching "{search}" in {category}. Try adjusting your keywords or clearing filters.
          </p>
          <button onClick={handleResetFilters} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            <span>Showing {products.length} {products.length === 1 ? "product" : "products"}</span>
            {(search || category !== "All") && (
              <button
                onClick={handleResetFilters}
                style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontWeight: "600" }}
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="grid-products">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Products;
