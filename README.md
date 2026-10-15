# 🛒 ShopKart — MERN Full-Stack E-Commerce App

A full-stack e-commerce web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js), featuring user authentication, product catalog, cart, wishlist, and Razorpay payment integration.

---

## 🚀 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 19, Vite, Vanilla CSS       |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB Atlas (with in-memory fallback) |
| Auth       | JWT (HttpOnly Cookies) + bcrypt   |
| Payments   | Razorpay (HMAC SHA256 verified)   |

---

## ✨ Features

- 🔐 Secure JWT authentication (register / login / logout)
- 🛍️ Product catalog with search, filter by category, and sorting
- 🛒 Cart management with stock validation
- ❤️ Wishlist toggle with animated UI
- 📦 Order placement with Razorpay payment gateway
- 📋 Order history with visual 4-stage progress timeline
- 🌱 Auto-seeded products and demo account on first start
- 🔄 MongoDB Atlas with automatic in-memory fallback

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (optional — falls back to in-memory)
- Razorpay test account (optional)

### 1. Clone the repo
```bash
git clone https://github.com/ss-choudhari007/MERN-LAB-PROJECT.git
cd MERN-LAB-PROJECT
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env   # or create frontend/.env with VITE_API_URL=http://localhost:5001
npm install
npm run dev
```

### 4. Open in browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/health

---

## 🔑 Environment Variables

### `backend/.env` (create from `backend/.env.example`)

| Variable              | Description                        |
|-----------------------|------------------------------------|
| `PORT`                | Port for Express server (default 5001) |
| `MONGODB_URI`         | MongoDB Atlas connection string    |
| `JWT_SECRET`          | Secret key for JWT signing         |
| `JWT_EXPIRES_IN`      | JWT expiry duration (e.g. `7d`)    |
| `RAZORPAY_KEY_ID`     | Razorpay test/live Key ID          |
| `RAZORPAY_KEY_SECRET` | Razorpay test/live Key Secret      |
| `CLIENT_URL`          | Frontend URL for CORS              |

---

## 📡 API Endpoints

| Method | Endpoint                        | Description                   |
|--------|---------------------------------|-------------------------------|
| POST   | `/customers/register`           | Register new customer         |
| POST   | `/customers/login`              | Login customer                |
| POST   | `/customers/logout`             | Logout customer               |
| GET    | `/products`                     | Get all products (search/filter/sort) |
| GET    | `/products/:id`                 | Get product by ID             |
| GET    | `/cart`                         | Get user cart                 |
| POST   | `/cart/:productId`              | Add to cart                   |
| DELETE | `/cart/:productId`              | Remove from cart              |
| GET    | `/wishlist`                     | Get user wishlist             |
| PATCH  | `/wishlist/:productId/toggle`   | Toggle wishlist item          |
| POST   | `/orders/create-payment-order`  | Create Razorpay order         |
| POST   | `/orders/verify-payment`        | Verify payment signature      |
| GET    | `/orders/my-orders`             | Get user orders               |

---

## 📁 Project Structure

```
MERN-LAB-PROJECT/
├── backend/
│   ├── config/          # DB and Razorpay config
│   ├── controllers/     # Route handlers
│   ├── middlewares/     # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Token and seed helpers
│   ├── .env.example     # Sample env file
│   └── index.js         # Entry point
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, ProductCard
    │   ├── pages/       # Products, Cart, Orders, Checkout...
    │   ├── services/    # API service layer
    │   └── context/     # Auth, Cart, Wishlist context
    └── index.html
```

---

## 👤 Demo Account

After starting the backend, a demo account is auto-seeded:

| Field    | Value             |
|----------|-------------------|
| Email    | john@example.com  |
| Password | password123       |

---

## 📝 License

MIT — feel free to use and modify for your own projects.
