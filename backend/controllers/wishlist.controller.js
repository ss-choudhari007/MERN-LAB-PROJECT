import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

/**
 * @desc   Add product to wishlist
 * @route  POST /wishlist/:productId
 * @access Protected
 */
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate productId ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check if product exists in database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const customer = await Customer.findById(req.user._id);

    // Prevent duplicates: Check if already wishlisted
    const alreadyWishlisted = customer.wishlist.some(
      (id) => id.toString() === productId.toString()
    );

    if (alreadyWishlisted) {
      return res.status(409).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    customer.wishlist.push(product._id);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    console.error("Add to Wishlist Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error adding to wishlist",
    });
  }
};

/**
 * @desc   Get current user's wishlist
 * @route  GET /wishlist
 * @access Protected
 */
export const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "wishlist",
      select: "name price category image stock",
    });

    const activeWishlist = (customer.wishlist || []).filter(Boolean);

    return res.status(200).json({
      success: true,
      count: activeWishlist.length,
      wishlist: activeWishlist,
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching wishlist",
    });
  }
};

/**
 * @desc   Remove product from wishlist
 * @route  DELETE /wishlist/:productId
 * @access Protected
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const customer = await Customer.findById(req.user._id);

    const itemIndex = customer.wishlist.findIndex(
      (id) => id.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in wishlist",
      });
    }

    customer.wishlist.splice(itemIndex, 1);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Remove Wishlist Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error removing from wishlist",
    });
  }
};

/**
 * @desc   Toggle product in wishlist (Bonus)
 * @route  PATCH /wishlist/:productId/toggle
 * @access Protected
 */
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const customer = await Customer.findById(req.user._id);
    const itemIndex = customer.wishlist.findIndex(
      (id) => id.toString() === productId.toString()
    );

    let saved = false;
    if (itemIndex > -1) {
      customer.wishlist.splice(itemIndex, 1);
      saved = false;
    } else {
      customer.wishlist.push(product._id);
      saved = true;
    }

    await customer.save();

    return res.status(200).json({
      success: true,
      saved,
      message: saved ? "Product added to wishlist" : "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Toggle Wishlist Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error toggling wishlist",
    });
  }
};
