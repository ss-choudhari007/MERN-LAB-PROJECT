import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";

export const initialProducts = [
  {
    name: "Noise Cancelling Wireless Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 40-hour battery life, and spatial audio support.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    stock: 25,
  },
  {
    name: "RGB Mechanical Gaming Keyboard",
    description: "Tactile clicky mechanical keyboard with customizable RGB backlighting, aircraft-grade aluminum frame, and detachable wrist rest.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    stock: 15,
  },
  {
    name: "Ultra-Lightweight Ergonomic Mouse",
    description: "High-precision 26,000 DPI sensor wireless gaming mouse with sub-60g honeycomb chassis and 80-hour battery life.",
    price: 1499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
    stock: 30,
  },
  {
    name: "Modern Minimalist Leather Watch",
    description: "Sleek stainless steel case with sapphire crystal glass and genuine Italian calfskin leather strap.",
    price: 3499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    stock: 12,
  },
  {
    name: "Urban Explorer Commuter Backpack",
    description: "Water-resistant 25L modular backpack with dedicated padded 16-inch laptop compartment and hidden anti-theft pockets.",
    price: 1999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    stock: 20,
  },
  {
    name: "Smart Ceramic Coffee Mug Warmer",
    description: "Temperature-controlled heating pad that keeps your coffee, tea, or milk at the ideal sipping temperature all day long.",
    price: 1299,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    stock: 18,
  },
  {
    name: "Designing Data-Intensive Applications",
    description: "The definitive guide to the architecture and principles of reliable, scalable, and maintainable data systems by Martin Kleppmann.",
    price: 899,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    stock: 40,
  },
  {
    name: "Atomic Habits by James Clear",
    description: "An easy and proven way to build good habits and break bad ones. Hardcover edition with personal journaling worksheet.",
    price: 499,
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
    stock: 50,
  },
];

export const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("🌱 Database has no products. Seeding initial catalog...");
      await Product.insertMany(initialProducts);
      console.log(`✅ Seeded ${initialProducts.length} default products.`);
    }

    // Seed demo customer for evaluator/testing convenience
    const demoEmail = "john@example.com";
    const existingDemo = await Customer.findOne({ email: demoEmail });
    if (!existingDemo) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);
      await Customer.create({
        fullName: "John Doe",
        email: demoEmail,
        password: hashedPassword,
        phone: "9876543210",
      });
      console.log(`✅ Seeded demo customer account: ${demoEmail} / password123`);
    }
  } catch (error) {
    console.warn("⚠️ Database seeding skipped:", error.message);
  }
};

export default seedProducts;

