import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, ShoppingBag, Heart, ShoppingCart, Package, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { authService } from "../services/api";

export const Home = () => {
  const { user, loading, checkAuth } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [passwordModal, setPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState({ type: "", text: "" });
  const [changingPwd, setChangingPwd] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <div className="state-container">
          <div className="state-title">Loading your ShopKart account...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: "", text: "" });

    if (!oldPassword || !newPassword) {
      setPwdMsg({ type: "error", text: "Please enter both old and new password" });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMsg({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }

    setChangingPwd(true);
    try {
      await authService.changePassword({ oldPassword, newPassword });
      setPwdMsg({ type: "success", text: "Password changed successfully!" });
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => {
        setPasswordModal(false);
        setPwdMsg({ type: "", text: "" });
      }, 1500);
    } catch (err) {
      setPwdMsg({ type: "error", text: err.response?.data?.message || "Failed to change password" });
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="container" style={{ padding: "3rem 1rem" }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #32411b 0%, #4a5c29 50%, #63773c 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "2.75rem",
          color: "#ffffff",
          marginBottom: "2.5rem",
          boxShadow: "0 16px 36px -8px rgba(45, 58, 26, 0.35)",
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <span
            className="badge"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              marginBottom: "1rem",
              padding: "0.35rem 0.75rem",
            }}
          >
            CUSTOMER DASHBOARD
          </span>
          <h1 style={{ fontSize: "2.5rem", color: "#ffffff", marginBottom: "0.75rem" }}>
            Welcome back, {user.fullName}!
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.9, lineHeight: "1.6", marginBottom: "1.5rem" }}>
            Explore trending electronics, manage your saved wishlist, review your shopping cart, and track recent orders in real-time.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/products" className="btn btn-secondary" style={{ backgroundColor: "#ffffff", color: "var(--color-primary)", fontWeight: "700" }}>
              <ShoppingBag size={18} />
              <span>Explore Products</span>
            </Link>
            <button
              onClick={() => setPasswordModal(true)}
              className="btn btn-secondary"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.3)" }}
            >
              <KeyRound size={18} />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Customer Profile & Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
        {/* Customer Profile Card */}
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.35rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User size={22} color="var(--color-primary)" />
            <span>Customer Profile</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-full)", backgroundColor: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
                <User size={20} />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Full Name</div>
                <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>{user.fullName}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-full)", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a" }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Email Address</div>
                <div style={{ fontSize: "1.05rem", fontWeight: "500" }}>{user.email}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-full)", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706" }}>
                <Phone size={20} />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Phone Number</div>
                <div style={{ fontSize: "1.05rem", fontWeight: "500" }}>{user.phone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Quick Shortcuts */}
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "1.25rem" }}>
          {/* Wishlist Box */}
          <Link to="/wishlist" className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "3rem", height: "3rem", borderRadius: "var(--radius-lg)", backgroundColor: "#ffe4e6", display: "flex", alignItems: "center", justifyContent: "center", color: "#e11d48" }}>
                <Heart size={24} fill="#e11d48" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem" }}>My Wishlist</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  {wishlistCount} {wishlistCount === 1 ? "product saved" : "products saved"}
                </p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--text-muted)" />
          </Link>

          {/* Cart Box */}
          <Link to="/cart" className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "3rem", height: "3rem", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
                <ShoppingCart size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem" }}>Shopping Cart</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  {cartCount} {cartCount === 1 ? "item waiting" : "items waiting"}
                </p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--text-muted)" />
          </Link>
        </div>
      </div>

      {/* Change Password Modal */}
      {passwordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <KeyRound size={20} color="var(--color-primary)" />
              <span>Change Password</span>
            </h3>

            {pwdMsg.text && (
              <div
                style={{
                  backgroundColor: pwdMsg.type === "success" ? "var(--color-success-bg)" : "var(--color-danger-bg)",
                  color: pwdMsg.type === "success" ? "#065f46" : "var(--color-danger)",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "1rem",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {pwdMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{pwdMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (min 6 characters)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="submit"
                  disabled={changingPwd}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {changingPwd ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setPasswordModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
