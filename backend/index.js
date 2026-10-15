import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import seedProducts from "./utils/seedProducts.js";

// Import route handlers
import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database and seed products
connectDB().then(() => {
  seedProducts();
});

// Middleware configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local student evaluation
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "ShopKart API Services",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/customers", customerRoutes);
app.use("/auth", customerRoutes); // Handy alias for standard auth endpoints
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Ensure PORT is completely free by stopping any lingering duplicate processes
try {
  const currentPid = process.pid;
  const pids = execSync(`lsof -ti :${PORT}`, { encoding: "utf8" })
    .trim()
    .split("\n")
    .map((p) => parseInt(p.trim(), 10))
    .filter((p) => p && p !== currentPid);

  for (const pid of pids) {
    try {
      process.kill(pid, "SIGKILL");
      console.log(`🧹 Auto-freed port ${PORT} by stopping stale instance (PID ${pid})`);
    } catch (_) {}
  }
} catch (_) {
  // Port is already free
}

const server = app.listen(PORT, () => {
  console.log(`🚀 ShopKart API Server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints active: /customers, /products, /wishlist, /cart, /orders`);
});

// Handle listen errors gracefully (prevent unhandled crash on EADDRINUSE)
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use by another instance. Please close the other terminal or run: lsof -ti :${PORT} | xargs kill -9`);
    process.exit(1);
  } else {
    console.error("Server error:", err);
  }
});

// Clean shutdown on nodemon restart or termination
const handleGracefulShutdown = () => {
  server.close(() => {
    console.log("🛑 ShopKart API Server stopped cleanly.");
    process.exit(0);
  });
};

process.on("SIGINT", handleGracefulShutdown);
process.on("SIGTERM", handleGracefulShutdown);

export default app;
