import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { CheckCircle2, Package, ShoppingBag, ArrowRight, Truck, MapPin, CreditCard } from "lucide-react";
import { orderService } from "../services/api";

export const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      orderService
        .getOrderById(id)
        .then((data) => setOrder(data.order))
        .catch((err) => console.error("Failed to load confirmed order:", err))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <div className="state-container">
          <div className="state-title">Loading order confirmation...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "3rem 1rem", maxWidth: "800px" }}>
      <div className="card" style={{ padding: "3rem 2rem", textAlign: "center", marginBottom: "2rem" }}>
        {/* Animated Success Badge */}
        <div
          style={{
            width: "5rem",
            height: "5rem",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-success-bg)",
            color: "var(--color-success)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            boxShadow: "0 0 0 10px rgba(16, 185, 129, 0.1)",
          }}
        >
          <CheckCircle2 size={48} />
        </div>

        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Order Placed Successfully!</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "2rem" }}>
          Thank you for shopping with ShopKart. Your payment has been verified and your order is confirmed.
        </p>

        {/* Invoice Grid */}
        <div
          style={{
            backgroundColor: "var(--bg-muted)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
            textAlign: "left",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
              Order Reference
            </div>
            <div style={{ fontFamily: "monospace", fontWeight: "700", fontSize: "1.05rem", color: "var(--text-main)", marginTop: "0.25rem" }}>
              #{order?._id || id}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
              Payment Status
            </div>
            <div style={{ marginTop: "0.25rem" }}>
              <span className="badge badge-success">PAID</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
              Order Status
            </div>
            <div style={{ marginTop: "0.25rem" }}>
              <span className="badge badge-primary">{order?.status || "PLACED"}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
              Total Paid
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: "800", color: "var(--color-primary)", marginTop: "0.25rem" }}>
              ₹{order?.totalAmount?.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Shipping Address Recap */}
        {order?.shippingAddress && (
          <div
            style={{
              textAlign: "left",
              padding: "1.25rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-light)",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>
              <MapPin size={18} color="var(--color-primary)" />
              <span>Delivery Address</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
              <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.phone})<br />
              {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </p>
          </div>
        )}

        {/* Item Snapshots */}
        {order?.items && order.items.length > 0 && (
          <div style={{ textAlign: "left", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Purchased Items</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-muted)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <img src={item.image} alt="" style={{ width: "42px", height: "42px", borderRadius: "var(--radius-sm)", objectFit: "cover" }} />
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{item.name}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: "700" }}>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/orders" className="btn btn-primary" style={{ padding: "0.85rem 1.75rem" }}>
            <Package size={18} />
            <span>View My Orders</span>
          </Link>
          <Link to="/products" className="btn btn-secondary" style={{ padding: "0.85rem 1.75rem" }}>
            <ShoppingBag size={18} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
