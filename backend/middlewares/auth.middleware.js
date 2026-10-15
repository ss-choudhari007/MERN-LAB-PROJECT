import jwt from "jsonwebtoken";
import Customer from "../models/customer.model.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Fallback: Authorization header Bearer token (useful for Postman testing)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET environment variable is not set");
    let decoded;

    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid or expired token",
      });
    }

    const user = await Customer.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized, authentication failed",
    });
  }
};

export default protect;
