import jwt from "jsonwebtoken";

export const generateToken = (res, customer) => {
  const secret = process.env.JWT_SECRET || "shopkart_jwt_secret_key_super_secure_2026";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  const token = jwt.sign(
    {
      id: customer._id,
      email: customer.email,
    },
    secret,
    {
      expiresIn,
    }
  );

  // Set HttpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  return token;
};

export default generateToken;
