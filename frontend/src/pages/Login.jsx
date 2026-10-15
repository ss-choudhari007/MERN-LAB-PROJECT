import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const successMessage = location.state?.message;

  // Redirect if already logged in to shopping store
  React.useEffect(() => {
    if (user) {
      navigate("/products");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const res = await login(formData);
    setSubmitting(false);

    if (res.success) {
      navigate("/products");
    } else {
      setErrorMessage(res.message || "Invalid credentials");
    }
  };

  return (
    <div className="container" style={{ minHeight: "calc(100vh - 12rem)", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem" }}>
      <div className="card" style={{ width: "100%", maxWidth: "460px", padding: "2.5rem", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              boxShadow: "0 4px 12px rgba(85, 107, 47, 0.15)",
            }}
          >
            <LogIn size={26} />
          </div>
          <h1 style={{ fontSize: "1.85rem", marginBottom: "0.5rem" }}>Welcome Back</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Sign in to access your ShopKart account, cart, and orders.
          </p>
        </div>

        {successMessage && (
          <div
            style={{
              backgroundColor: "var(--color-success-bg)",
              border: "1px solid #a7f3d0",
              color: "#065f46",
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.9rem",
            }}
          >
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              backgroundColor: "var(--color-danger-bg)",
              border: "1px solid #fecaca",
              color: "var(--color-danger)",
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.9rem",
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: "2.6rem" }}
                required
              />
              <Mail size={18} color="#94a3b8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: "2.6rem" }}
                required
              />
              <Lock size={18} color="#94a3b8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block"
            style={{ padding: "0.9rem", marginTop: "1.25rem", fontSize: "1rem" }}
          >
            {submitting ? "Signing In..." : "Sign In"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.925rem", color: "var(--text-muted)" }}>
          Don't have an account yet?{" "}
          <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: "700" }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
