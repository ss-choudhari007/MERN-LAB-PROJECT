import mongoose from "mongoose";
import Product from "../models/product.model.js";

/**
 * @desc   Create a new product
 * @route  POST /products
 * @access Public
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // Validation: Mandatory fields
    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, description, price, category, image, stock) are required",
      });
    }

    // Validation: price > 0
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a number greater than 0",
      });
    }

    // Validation: stock >= 0
    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      image: image.trim(),
      stock,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc   Get all products with search, category filtering & sorting
 * @route  GET /products
 * @access Public
 */
export const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    const filter = {};

    // Search query: Case-insensitive match on name
    if (search && search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    // Category filter: Exact or case-insensitive match
    if (category && category.trim() !== "" && category.toLowerCase() !== "all") {
      filter.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === "price_asc") {
      sortOption = { price: 1 };
    } else if (sort === "price_desc") {
      sortOption = { price: -1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(filter).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching products",
    });
  }
};

/**
 * @desc   Get single product by ID
 * @route  GET /products/:id
 * @access Public
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Get Product Details Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching product details",
    });
  }
};
