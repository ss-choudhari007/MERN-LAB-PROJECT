import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

/**
 * @desc   Add product to cart or increase quantity by 1
 * @route  POST /cart/:productId
 * @access Protected
 */
export const addToCart = async (req, res) => {
  try {
    const productId = req.params.productId || req.body.productId;
    const requestedQty = Number(req.body?.quantity) || 1;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
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

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    const customer = await Customer.findById(req.user._id);

    const existingIndex = customer.cart.findIndex(
      (item) => item.product && item.product.toString() === productId.toString()
    );

    let targetQuantity = requestedQty;
    if (existingIndex > -1) {
      targetQuantity = customer.cart[existingIndex].quantity + requestedQty;
    }

    // Validate that targetQuantity does not exceed available stock
    if (targetQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add more. Only ${product.stock} units available in stock`,
      });
    }

    if (existingIndex > -1) {
      customer.cart[existingIndex].quantity = targetQuantity;
    } else {
      customer.cart.push({
        product: product._id,
        quantity: targetQuantity,
      });
    }

    await customer.save();

    const updatedCustomer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category",
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: updatedCustomer.cart,
    });
  } catch (error) {
    console.error("Add to Cart Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error adding to cart",
    });
  }
};

/**
 * @desc   Get current user's cart
 * @route  GET /cart
 * @access Protected
 */
export const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category",
    });

    // Clean up any cart items where the product might have been deleted
    const validCart = (customer.cart || []).filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      cart: validCart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching cart",
    });
  }
};

/**
 * @desc   Update product quantity in cart
 * @route  PATCH /cart/:productId
 * @access Protected
 */
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid number and at least 1",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Quantity cannot exceed product stock of ${product.stock}`,
      });
    }

    const customer = await Customer.findById(req.user._id);

    const itemIndex = customer.cart.findIndex(
      (item) => item.product && item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    customer.cart[itemIndex].quantity = quantity;
    await customer.save();

    const updatedCustomer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category",
    });

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: updatedCustomer.cart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error updating cart",
    });
  }
};

/**
 * @desc   Remove product from cart
 * @route  DELETE /cart/:productId
 * @access Protected
 */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const customer = await Customer.findById(req.user._id);

    const itemIndex = customer.cart.findIndex(
      (item) => item.product && item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    customer.cart.splice(itemIndex, 1);
    await customer.save();

    const updatedCustomer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category",
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: updatedCustomer.cart,
    });
  } catch (error) {
    console.error("Remove from Cart Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error removing from cart",
    });
  }
};
