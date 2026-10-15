import "dotenv/config";
import Razorpay from "razorpay";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load from both parent and current directory for safety
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

let razorpay = null;

const initRazorpay = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (key_id && key_secret) {
    try {
      razorpay = new Razorpay({
        key_id,
        key_secret,
      });
      console.log(`✅ Razorpay SDK initialized with Key ID: ${key_id}`);
      return razorpay;
    } catch (err) {
      console.warn("⚠️ Razorpay initialization warning:", err.message);
    }
  }
  return null;
};

initRazorpay();

export const getRazorpayInstance = () => {
  if (!razorpay) {
    return initRazorpay();
  }
  return razorpay;
};

export const RAZORPAY_CONFIG = {
  get key_id() {
    return process.env.RAZORPAY_KEY_ID || "";
  },
  get key_secret() {
    return process.env.RAZORPAY_KEY_SECRET || "";
  },
};

export default razorpay;
