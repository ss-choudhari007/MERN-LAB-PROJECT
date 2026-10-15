import express from "express";
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
} from "../controllers/cart.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// Shopping Cart Endpoints (All Protected)
router.use(protect);

router.post("/", addToCart);
router.post("/:productId", addToCart);
router.get("/", getCart);
router.patch("/:productId", updateCartQuantity);
router.delete("/:productId", removeFromCart);

export default router;
