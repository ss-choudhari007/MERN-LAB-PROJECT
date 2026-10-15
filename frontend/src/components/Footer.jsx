import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Headphones, Award } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f7f4ec", fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: "800", marginBottom: "0.85rem" }}>
              <ShoppingBag size={24} color="#a3b882" />
              <span>ShopKart</span>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: "1.6", color: "#b5bcaa" }}>
              Your destination for curated, premium lifestyle goods, electronics, books, and fashion. Seamless shopping with verified Razorpay test checkout and instant order tracking.
            </p>
          </div>

          <div>
            <h4 style={{ color: "#f7f4ec", marginBottom: "1rem", fontSize: "1rem" }}>Why Choose Us</h4>
            <ul style={{ listStyle: "none", fontSize: "0.875rem", display: "flex", flexDirection: "column", gap: "0.6rem", color: "#b5bcaa" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Truck size={16} color="#a3b882" /> Free Express Delivery on all orders
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck size={16} color="#a3b882" /> 100% Secure Razorpay Checkout
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <RefreshCw size={16} color="#a3b882" /> 7-Day Easy Replacement Policy
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={16} color="#a3b882" /> Genuine Brand Assured Products
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#f7f4ec", marginBottom: "1rem", fontSize: "1rem" }}>Shop Categories</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <Link to="/products?category=Electronics" className="badge badge-outline" style={{ borderColor: "#3d4530", color: "#d0d6c4", padding: "0.4rem 0.75rem", textDecoration: "none" }}>
                Electronics
              </Link>
              <Link to="/products?category=Fashion" className="badge badge-outline" style={{ borderColor: "#3d4530", color: "#d0d6c4", padding: "0.4rem 0.75rem", textDecoration: "none" }}>
                Fashion & Style
              </Link>
              <Link to="/products?category=Home" className="badge badge-outline" style={{ borderColor: "#3d4530", color: "#d0d6c4", padding: "0.4rem 0.75rem", textDecoration: "none" }}>
                Home & Living
              </Link>
              <Link to="/products?category=Books" className="badge badge-outline" style={{ borderColor: "#3d4530", color: "#d0d6c4", padding: "0.4rem 0.75rem", textDecoration: "none" }}>
                Books & Media
              </Link>
            </div>
            <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#b5bcaa" }}>
              <Headphones size={16} color="#a3b882" /> 24/7 Dedicated Customer Care
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #2e3422", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.8rem", color: "#8e9584" }}>
          <div>© {new Date().getFullYear()} ShopKart Store. All rights reserved.</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            Curated with care & precision
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
