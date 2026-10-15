import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, Phone, User, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // If already logged in, redirect to shopping store
  React.useEffect(() => {
    if (user) {
      navigate("/products");
    }
  }, [user, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");

    const res = await register(formData);
    setSubmitting(false);

    if (res.success) {
      navigate("/products", {
        state: { welcomeMessage: `Welcome to ShopKart, ${formData.fullName}! Enjoy exploring our store.` },
      });
    } else {
      setApiError(res.message);
    }
  };

  return (
    <div className="container" style={{ minHeight: "calc(100vh - 12rem)", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem" }}>
      <div className="card" style={{ width: "100%", maxWidth: "480px", padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "3.25rem",
              height: "3.25rem",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <UserPlus size={28} />
          </div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Create your account</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Join ShopKart to browse thousands of products and order with ease.
          </p>
        </div>

        {apiError && (
          <div
            style={{
              backgroundColor: "var(--color-danger-bg)",
              border: "1px solid #fecaca",
              color: "var(--color-danger)",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
            }}
          >
            <AlertCircle size={18} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <div style={{ position: "relative" }}>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                style={{ paddingLeft: "2.5rem" }}
                required
              />
              <User size={18} color="#94a3b8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
            {errors.fullName && <div className="form-error"><AlertCircle size={14} /> {errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="form-input"
                placeholder="john@gmail.com"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: "2.5rem" }}
                required
              />
              <Mail size={18} color="#94a3b8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
            {errors.email && <div className="form-error"><AlertCircle size={14} /> {errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <div style={{ position: "relative" }}>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                className="form-input"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                style={{ paddingLeft: "2.5rem" }}
                required
              />
              <Phone size={18} color="#94a3b8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
            {errors.phone && <div className="form-error"><AlertCircle size={14} /> {errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password (min 6 characters)</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: "2.5rem" }}
                required
              />
              <Lock size={18} color="#94a3b8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
            {errors.password && <div className="form-error"><AlertCircle size={14} /> {errors.password}</div>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block"
            style={{ padding: "0.85rem", marginTop: "1rem" }}
          >
            {submitting ? "Creating Account..." : "Create Account"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: "600" }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
