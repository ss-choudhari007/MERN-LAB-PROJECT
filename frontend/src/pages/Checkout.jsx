import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Truck, CreditCard, AlertCircle, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/api";

// Helper to ensure Razorpay checkout script is loaded
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const { cart, cartCount, subtotal, clearCartState } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Preload Razorpay script on checkout mount
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Validation rules
  const validateForm = () => {
    const errs = {};
    if (!shippingAddress.fullName.trim()) errs.fullName = "Full name is required";
    if (!shippingAddress.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(shippingAddress.phone.trim())) {
      errs.phone = "Phone must be a valid 10-digit number";
    }
    if (!shippingAddress.addressLine1.trim()) errs.addressLine1 = "Street address is required";
    if (!shippingAddress.city.trim()) errs.city = "City is required";
    if (!shippingAddress.state.trim()) errs.state = "State is required";
    if (!shippingAddress.pincode.trim()) {
      errs.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      errs.pincode = "Pincode must contain exactly 6 digits";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errorMessage) setErrorMessage("");
  };

  // Step 1: Create Order on Backend & Trigger Official Razorpay Gateway
  const handleInitiatePayment = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      // POST /orders/create-payment-order
      const data = await orderService.createPaymentOrder(shippingAddress);

      if (!data.success) {
        throw new Error(data.message || "Failed to create order on server");
      }

      // Load official Razorpay Standard Checkout SDK
      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && window.Razorpay) {
        const razorpayKey = data.key || "rzp_test_To6xONZBzQSfYZ";

        const options = {
          key: razorpayKey,
          amount: data.amount,
          currency: data.currency || "INR",
          name: "ShopKart",
          description: `Order #${data.shopKartOrderId}`,
          order_id: data.razorpayOrderId,
          handler: async function (response) {
            // Send returned signature & IDs to backend for HMAC verification
            await handleVerifyPayment({
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          prefill: {
            name: shippingAddress.fullName,
            contact: shippingAddress.phone,
            email: user?.email,
          },
          theme: {
            color: "#556b2f",
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setErrorMessage("Razorpay payment window closed. Your cart remains intact.");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          console.error("Payment failed:", resp.error);
          setErrorMessage(`Payment Failed: ${resp.error?.description || "Payment was declined by Razorpay"}`);
          setLoading(false);
        });
        rzp.open();
      } else {
        setErrorMessage("Unable to load Razorpay payment gateway. Please disable any ad-blockers or try refreshing the page.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setErrorMessage(err.response?.data?.message || err.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  // Step 2: Verify Payment Signature on Backend
  const handleVerifyPayment = async (verificationPayload) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const verifyRes = await orderService.verifyPayment(verificationPayload);

      if (verifyRes.success) {
        clearCartState();
        navigate(`/order-success/${verificationPayload.shopKartOrderId}`, {
          state: { order: verifyRes.order },
        });
      } else {
        throw new Error(verifyRes.message || "Payment verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMessage(err.response?.data?.message || err.message || "Payment signature could not be verified");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="state-container">
          <div className="state-title">Your cart is empty</div>
          <p className="state-description">Add some products to your cart before proceeding to checkout.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "3rem 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link to="/cart" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.75rem" }}>
          <ArrowLeft size={16} />
          <span>Return to Cart</span>
        </Link>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Secure Checkout</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Complete your purchase securely via Razorpay Payment Gateway.
        </p>
      </div>

      {errorMessage && (
        <div
          style={{
            backgroundColor: "var(--color-danger-bg)",
            border: "1px solid #fecaca",
            color: "var(--color-danger)",
            padding: "1rem 1.25rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.95rem",
          }}
        >
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2.5rem", alignItems: "start" }}>
        {/* Shipping & Payment Options Form */}
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.35rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Truck size={22} color="var(--color-primary)" />
            <span>1. Shipping Address</span>
          </h2>

          <form onSubmit={handleInitiatePayment} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                className="form-input"
                placeholder="John Doe"
                value={shippingAddress.fullName}
                onChange={handleInputChange}
                required
              />
              {errors.fullName && <div className="form-error"><AlertCircle size={14} /> {errors.fullName}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Contact Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                className="form-input"
                placeholder="9876543210"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                required
              />
              {errors.phone && <div className="form-error"><AlertCircle size={14} /> {errors.phone}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="addressLine1">Street Address Line 1 *</label>
              <textarea
                id="addressLine1"
                name="addressLine1"
                rows="2"
                autoComplete="street-address"
                className="form-textarea"
                placeholder="Apartment 4B, MG Road, Landmark..."
                value={shippingAddress.addressLine1}
                onChange={handleInputChange}
                required
              />
              {errors.addressLine1 && <div className="form-error"><AlertCircle size={14} /> {errors.addressLine1}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="city">City *</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  className="form-input"
                  placeholder="Bengaluru"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                />
                {errors.city && <div className="form-error"><AlertCircle size={14} /> {errors.city}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="state">State *</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  autoComplete="address-level1"
                  className="form-input"
                  placeholder="Karnataka"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  required
                />
                {errors.state && <div className="form-error"><AlertCircle size={14} /> {errors.state}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pincode">Pincode (6 digits) *</label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                inputMode="numeric"
                maxLength="6"
                autoComplete="postal-code"
                className="form-input"
                placeholder="560001"
                value={shippingAddress.pincode}
                onChange={handleInputChange}
                required
              />
              {errors.pincode && <div className="form-error"><AlertCircle size={14} /> {errors.pincode}</div>}
            </div>

            {/* Payment Method Presentation */}
            <div style={{ marginTop: "2rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.35rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CreditCard size={22} color="var(--color-primary)" />
                <span>2. Payment Method</span>
              </h2>

              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: "var(--radius-lg)",
                  border: "2px solid var(--color-primary)",
                  backgroundColor: "var(--color-primary-light)",
                  position: "relative",
                  boxShadow: "0 2px 8px rgba(85, 107, 47, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div
                      style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-primary)",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "1.05rem" }}>
                        Razorpay Payment Gateway
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Official Indian Payments Partner
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-success" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <CheckCircle2 size={13} /> Active
                  </span>
                </div>

                <p style={{ fontSize: "0.875rem", color: "var(--text-main)", marginBottom: "1rem", lineHeight: "1.5" }}>
                  Pay smoothly and securely using your preferred payment method on the official Razorpay checkout screen:
                </p>

                {/* Badges for supported methods */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-full)", backgroundColor: "#ffffff", border: "1px solid var(--border-light)" }}>
                    ⚡ UPI (GPay, PhonePe, Paytm, CRED)
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-full)", backgroundColor: "#ffffff", border: "1px solid var(--border-light)" }}>
                    💳 Credit & Debit Cards (Visa, Mastercard, RuPay)
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-full)", backgroundColor: "#ffffff", border: "1px solid var(--border-light)" }}>
                    🏦 NetBanking (50+ Banks)
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-full)", backgroundColor: "#ffffff", border: "1px solid var(--border-light)" }}>
                    👛 Wallets
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.775rem", color: "var(--text-muted)" }}>
                  <Lock size={13} color="var(--color-primary)" />
                  <span>256-Bit SSL Encrypted & HMAC SHA256 Signature Verified</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{ padding: "1rem", fontSize: "1.05rem", marginTop: "1rem" }}
            >
              <Lock size={18} />
              <span>
                {loading
                  ? "Opening Razorpay..."
                  : `Pay ₹${subtotal.toLocaleString("en-IN")} via Razorpay`}
              </span>
            </button>
          </form>
        </div>

        {/* Order Review Box */}
        <div className="order-summary-box">
          <h2 style={{ fontSize: "1.35rem", marginBottom: "1.25rem" }}>Order Summary ({cartCount} items)</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "320px", overflowY: "auto", marginBottom: "1.5rem", paddingRight: "0.5rem" }}>
            {cart.map((item) => (
              <div key={item.product?._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <img src={item.product?.image} alt="" style={{ width: "44px", height: "44px", borderRadius: "var(--radius-sm)", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontWeight: "600" }}>{item.product?.name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Qty: {item.quantity} × ₹{item.product?.price?.toLocaleString("en-IN")}</div>
                  </div>
                </div>
                <div style={{ fontWeight: "700" }}>
                  ₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Items Subtotal</span>
            <span style={{ fontWeight: "600" }}>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span style={{ color: "#16a34a", fontWeight: "600" }}>FREE</span>
          </div>

          <div className="summary-row total">
            <span>Total Payable</span>
            <span style={{ color: "var(--color-primary)" }}>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "var(--bg-muted)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
            <ShieldCheck size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
            <div>
              <strong style={{ color: "var(--text-main)", display: "block" }}>Secure Payment Protection</strong>
              Transactions are processed directly through Razorpay's PCI-DSS compliant infrastructure with real-time cryptographic signature verification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
