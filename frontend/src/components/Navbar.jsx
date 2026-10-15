import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, ShoppingCart, Package, User, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userInitial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <nav className="navbar">
          {/* Brand Logo */}
          <Link to="/products" className="brand-logo" title="ShopKart Store">
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-primary-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary)",
              }}
            >
              <ShoppingBag size={22} />
            </div>
            <span>ShopKart</span>
          </Link>

          {/* Navigation Links */}
          <ul className="nav-links">
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <span>Store</span>
              </NavLink>
            </li>

            {user && (
              <>
                <li>
                  <NavLink
                    to="/wishlist"
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  >
                    <Heart size={18} />
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="badge badge-primary badge-pulse" style={{ backgroundColor: "#e11d48" }}>
                        {wishlistCount}
                      </span>
                    )}
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  >
                    <ShoppingCart size={18} />
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="badge badge-primary badge-pulse">
                        {cartCount}
                      </span>
                    )}
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/orders"
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  >
                    <Package size={18} />
                    <span>My Orders</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* User Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <Link
                  to="/home"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.55rem",
                    padding: "0.35rem 0.85rem 0.35rem 0.4rem",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "var(--bg-muted)",
                    color: "var(--text-main)",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    border: "1px solid var(--border-light)",
                    transition: "all var(--transition-fast)",
                  }}
                  title="View Profile & Dashboard"
                >
                  <div
                    style={{
                      width: "1.85rem",
                      height: "1.85rem",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: "var(--color-primary)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "0.85rem",
                    }}
                  >
                    {userInitial}
                  </div>
                  <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.fullName || user.email.split("@")[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ padding: "0.45rem 0.85rem", fontSize: "0.875rem" }}
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                >
                  <UserPlus size={16} />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
