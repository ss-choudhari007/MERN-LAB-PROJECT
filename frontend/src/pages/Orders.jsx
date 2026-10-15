import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle2, Truck, RefreshCw, AlertCircle, ShoppingBag, ChevronRight } from "lucide-react";
import { orderService } from "../services/api";

const STATUS_PROGRESSION = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Orders error:", err.message);
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED":
        return <span className="badge badge-success">DELIVERED</span>;
      case "SHIPPED":
        return <span className="badge badge-primary">SHIPPED</span>;
      case "CONFIRMED":
        return <span className="badge badge-warning">CONFIRMED</span>;
      case "PLACED":
      default:
        return <span className="badge badge-outline" style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>PLACED</span>;
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="state-container">
          <RefreshCw size={36} color="var(--color-primary)" style={{ animation: "spin 1s linear infinite", marginBottom: "1rem" }} />
          <div className="state-title">Loading your orders...</div>
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
          <p className="state-description">{error}</p>
          <button onClick={fetchOrders} className="btn btn-primary">
            <RefreshCw size={18} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!orders || orders.length === 0) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="state-container">
          <div style={{ width: "4rem", height: "4rem", borderRadius: "var(--radius-full)", backgroundColor: "var(--bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            <Package size={32} />
          </div>
          <div className="state-title">You have not placed any orders yet.</div>
          <p className="state-description">
            Your completed purchases will appear here with real-time status tracking and invoices.
          </p>
          <Link to="/products" className="btn btn-primary">
            <ShoppingBag size={18} />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "3rem 1rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>My Order History</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Viewing {orders.length} {orders.length === 1 ? "order" : "orders"} placed on ShopKart
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        {orders.map((order) => {
          const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          const isDelivered = order.status === "DELIVERED";

          return (
            <div key={order._id} className="card" style={{ padding: "1.75rem" }}>
              {/* Header Info */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  paddingBottom: "1.25rem",
                  borderBottom: "1px solid var(--border-light)",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                    Order ID
                  </div>
                  <div style={{ fontFamily: "monospace", fontWeight: "700", fontSize: "1.1rem" }}>
                    #{order._id}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  <Clock size={16} />
                  <span>{dateStr}</span>
                </div>

                <div>{getStatusBadge(order.status)}</div>

                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                    Total Amount
                  </div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: "800", color: "var(--color-primary)" }}>
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Visual Order Progression Timeline */}
              <div style={{ margin: "1.75rem 0", padding: "0 0.5rem" }}>
                {(() => {
                  const statusIdx = STATUS_PROGRESSION.indexOf(order.status);
                  const progressPct = statusIdx === -1 ? 0 : (statusIdx / (STATUS_PROGRESSION.length - 1)) * 100;
                  const stepIcons = ["📦", "📋", "🚚", "🎉"];

                  return (
                    <div style={{ position: "relative" }}>
                      {/* Background Bar */}
                      <div
                        style={{
                          position: "absolute",
                          top: "1.25rem",
                          left: "5%",
                          right: "5%",
                          height: "4px",
                          backgroundColor: "var(--border-light)",
                          zIndex: 1,
                        }}
                      />
                      {/* Active Fill Bar */}
                      <div
                        style={{
                          position: "absolute",
                          top: "1.25rem",
                          left: "5%",
                          width: `${(progressPct * 0.9)}%`,
                          height: "4px",
                          background: "linear-gradient(90deg, #556b2f, #15803d)",
                          zIndex: 2,
                          transition: "width 0.4s ease",
                        }}
                      />

                      {/* Step Points */}
                      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 3 }}>
                        {STATUS_PROGRESSION.map((s, idx) => {
                          const isReached = statusIdx >= idx;
                          const isCurrent = statusIdx === idx;

                          return (
                            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
                              <div
                                style={{
                                  width: "2.5rem",
                                  height: "2.5rem",
                                  borderRadius: "var(--radius-full)",
                                  backgroundColor: isReached ? (isCurrent ? "var(--color-primary)" : "#15803d") : "#ffffff",
                                  color: isReached ? "#ffffff" : "var(--text-muted)",
                                  border: `2px solid ${isReached ? (isCurrent ? "var(--color-primary)" : "#15803d") : "var(--border-subtle)"}`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.95rem",
                                  fontWeight: "700",
                                  boxShadow: isCurrent ? "0 0 0 4px rgba(85, 107, 47, 0.25)" : "var(--shadow-sm)",
                                  transition: "all var(--transition-fast)",
                                }}
                              >
                                {isReached && !isCurrent ? "✓" : stepIcons[idx]}
                              </div>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  fontWeight: isCurrent ? "700" : "600",
                                  color: isCurrent ? "var(--color-primary)" : isReached ? "var(--text-main)" : "var(--text-muted)",
                                  textTransform: "capitalize",
                                }}
                              >
                                {s.toLowerCase()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Order Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      padding: "0.5rem 0",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <img src={item.image} alt="" style={{ width: "48px", height: "48px", borderRadius: "var(--radius-sm)", objectFit: "cover" }} />
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{item.name}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "1.05rem" }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer with Delivery info */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--border-light)",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                }}
              >
                <div>
                  Delivery to: <strong>{order.shippingAddress?.fullName}</strong>, {order.shippingAddress?.city} ({order.shippingAddress?.pincode})
                </div>

                {isDelivered ? (
                  <span style={{ color: "#16a34a", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <CheckCircle2 size={16} /> Delivered to you
                  </span>
                ) : (
                  <span style={{ color: "var(--color-primary)", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Truck size={16} /> Order in progress • {order.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
