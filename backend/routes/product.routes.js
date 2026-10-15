import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
} from "../controllers/product.controller.js";

const router = express.Router();

// Product Catalog Endpoints
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
