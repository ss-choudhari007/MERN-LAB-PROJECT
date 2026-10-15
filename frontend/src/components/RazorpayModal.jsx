import React, { useState } from "react";
import { CheckCircle2, XCircle, ShieldCheck, CreditCard, Lock } from "lucide-react";

export const RazorpayModal = ({ isOpen, onClose, orderData, onPaymentSuccess, onPaymentFailure }) => {
  if (!isOpen || !orderData) return null;

  const [simulating, setSimulating] = useState(false);

  const handleSimulateSuccess = async () => {
    setSimulating(true);
    try {
      const mockPaymentId = `pay_test_${Date.now()}`;
      // In simulator, send payment id and test signature
      await onPaymentSuccess({
        shopKartOrderId: orderData.shopKartOrderId,
        razorpay_order_id: orderData.razorpayOrderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: `test_sig_${mockPaymentId}`,
      });
    } finally {
      setSimulating(false);
    }
  };

  const handleSimulateFailure = () => {
    onPaymentFailure("Payment was declined or cancelled in Razorpay test mode");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "2rem",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-xl)",
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "#e0e7ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4338ca",
              }}
            >
              <CreditCard size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Razorpay Test Gateway</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Secure Sandboxed Checkout</p>
            </div>
          </div>
          <span className="badge badge-warning" style={{ fontWeight: "700" }}>TEST MODE</span>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-muted)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Order ID:</span>
            <span style={{ fontFamily: "monospace", fontWeight: "600" }}>{orderData.razorpayOrderId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-muted)" }}>ShopKart Ref:</span>
            <span style={{ fontFamily: "monospace" }}>{orderData.shopKartOrderId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: "800", paddingTop: "0.5rem", borderTop: "1px solid var(--border-light)" }}>
            <span>Amount to Pay:</span>
            <span style={{ color: "var(--color-primary)" }}>₹{(orderData.amount / 100).toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={handleSimulateSuccess}
            disabled={simulating}
            className="btn btn-primary btn-block"
            style={{ padding: "0.85rem", fontSize: "1rem" }}
          >
            <ShieldCheck size={20} />
            <span>{simulating ? "Verifying Signature..." : "Complete Test Payment (Success)"}</span>
          </button>

          <button
            onClick={handleSimulateFailure}
            disabled={simulating}
            className="btn btn-outline-danger btn-block"
            style={{ padding: "0.65rem", fontSize: "0.9rem" }}
          >
            <XCircle size={18} />
            <span>Simulate Payment Failure</span>
          </button>

          <button
            onClick={onClose}
            disabled={simulating}
            className="btn btn-secondary btn-block"
            style={{ padding: "0.65rem", fontSize: "0.9rem" }}
          >
            <span>Cancel</span>
          </button>
        </div>

        <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
          <Lock size={12} />
          <span>Server-Side HMAC SHA256 Signature Verification Enforced</span>
        </div>
      </div>
    </div>
  );
};

export default RazorpayModal;
