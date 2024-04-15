# Eccomerce (Metropolitan / Pet E-Commerce) — Complete Documentation

**Repository:** [https://github.com/mshayan-ags/Eccomerce](https://github.com/mshayan-ags/Eccomerce)  
**Default branch:** `master`  
**Author / Owner:** mshayan-ags  
**Status:** No description, topics, website, stars, or forks on the public GitHub page.  
**Commits (at time of documentation):** ~15  

This document describes **every major part** of the repository: structure, tech stack, features, data models, API surface, frontend & admin apps, real-time features, payments, security, environment configuration, and how the pieces fit together.

---

## 1. Project Overview

**Eccomerce** is a full-stack **pet-focused e-commerce platform** (package names and product attributes strongly indicate pet supplies: LifeStage, flavor, size for dogs/cats, nutritional info, ingredients, etc.). Internally the backend is named **“metropolitan”**; the customer frontend is **“pet-ecommerce”** and the admin app is **“pet-eccomerece”**.

It consists of **three separate applications**:

| Part       | Role                                      | Stack                          | Default port / notes      |
|------------|-------------------------------------------|--------------------------------|---------------------------|
| **Backend**   | REST API + WebSocket server + Stripe webhook | Node.js, Express, MongoDB (Mongoose), Socket.IO, Stripe, JWT | `5000`                   |
| **Frontend**  | Customer-facing store                      | React 18 (CRA), Tailwind, React Router, Stripe React, Socket.IO client, AOS | `3000` (CRA default)     |
| **Admin**     | Admin panel / dashboard                    | React 18 (CRA), Tailwind, MUI, ApexCharts, Chakra UI pieces, React Router | Separate CRA app (often `3001`) |

There is **no root README**. Each app has its own `package.json`, `.env.example`, and is meant to be run independently against a shared MongoDB instance and the Backend API.

---

## 2. High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Customer       │     │  Admin Panel    │
│  Frontend       │     │  (React CRA)    │
│  (React CRA)    │     │                 │
└────────┬────────┘     └────────┬────────┘
         │ HTTP + Socket.IO      │ HTTP + Socket.IO
         │ (JWT Bearer)          │ (JWT + Role)
         ▼                       ▼
┌────────────────────────────────────────────┐
│              Backend (Express)             │
│  • REST routes                             │
│  • JWT auth (User / Admin)                 │
│  • Socket.IO (order rooms + admin room)    │
│  • Stripe payment + webhook                │
│  • Image serving                           │
│  • Rate limiting, Helmet, sanitization     │
└────────────────────┬───────────────────────┘
                     │
                     ▼
              MongoDB (Mongoose)
```

- **Authentication:** JWT (Bearer token). Separate helpers for **customer** (`getUserId`) and **admin** (`getAdminId` with `Role`).
- **Real-time:** Socket.IO rooms:
  - `sale:<saleId>` — order status updates (owner or admin only).
  - `admins` — new-order notifications for admin panel.
- **Payments:** Stripe PaymentIntents + webhook endpoint `/Stripe-Webhook`.
- **Images:** Stored via backend; served through a `GetImage` route; frontend uses `REACT_APP_IMAGE_CLOUD`.

---

## 3. Repository Structure

```
Eccomerce/
├── .gitignore
├── Admin/                 # Admin React app
│   ├── .env.example
│   ├── LICENSE.md
│   ├── package.json
│   ├── jsconfig.json
│   ├── postcss.config.js
│   ├── prettier.config.js
│   ├── tailwind.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── ProtectedRoute.js
│       ├── routes.js
│       ├── link.js
│       ├── index.js / index.css
│       ├── assets/        # CSS, images (auth, avatars, dashboards)
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── utils/
│       ├── variables/
│       └── views/
│           ├── auth/      # SignIn
│           └── admin/     # Dashboard, Brand, Category, Product, Sale, etc.
├── Backend/               # Node/Express API
│   ├── .env.example
│   ├── package.json
│   ├── app.js             # Entry point
│   ├── Middlewares/
│   │   ├── Db.js
│   │   ├── Routes.js
│   │   ├── Server.js
│   │   └── socket.js
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── utils/             # Auth, mailer, image save, helpers
│   └── tests/
│       └── auth.test.js
└── Frontend/              # Customer React app
    ├── .env.example
    ├── package.json
    ├── index.html
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── public/
    └── src/
        ├── App.js
        ├── index.js / index.css
        ├── link.js
        ├── socket.js
        ├── Components/
        ├── Pages/
        ├── Section/
        ├── assests/
        ├── context/
        ├── hooks/
        └── utils/
```

---

## 4. Backend (API Server)

### 4.1 Entry & Boot

- **Entry:** `Backend/app.js`
  - Loads `dotenv`
  - Connects MongoDB via `Middlewares/Db`
  - Loads routes via `Middlewares/Routes`
  - Starts HTTP server from `Middlewares/Server` on `PORT` (default **5000**)

### 4.2 Server Middleware (`Middlewares/Server.js`)

- **Helmet** — security headers
- **CORS** — origins from `CORS_ORIGIN` (comma-separated); credentials enabled
- **Body parsing** — JSON (10mb) for all routes **except** `/Stripe-Webhook` (raw body required for Stripe signature verification)
- **URL-encoded** body parser
- **express-mongo-sanitize** — NoSQL injection protection
- **Rate limiting** (15 min window, max 20 requests) on auth-related paths:
  - `/Login`, `/Login-Admin`, `/Forget-Password`, `/Resend-OTP`, `/Verify-OTP`, `/Reset-Password`
- **Socket.IO** initialized on the same HTTP server

### 4.3 Route Registration (`Middlewares/Routes.js`)

Mounted routers:

| Router            | Purpose                          |
|-------------------|----------------------------------|
| User              | Customer auth, profile, OTP, etc.|
| Sale              | Orders / sales                   |
| Coupon            | Coupons                          |
| Discount          | Discounts                        |
| Bank              | Payment methods / bank details   |
| Address           | Shipping addresses               |
| Product           | Products                         |
| Category          | Categories                       |
| Brand             | Brands                           |
| Admin             | Admin auth & admin-only ops      |
| Wishlist          | Wishlists                        |
| Review            | Product reviews                  |
| Blog              | Blog posts                       |
| GetImage (Image)  | Image retrieval                  |
| StripeWebhook     | Stripe webhook handler           |

### 4.4 Models (Mongoose)

Located in `Backend/models/`:

| Model            | Description |
|------------------|-------------|
| **User**         | name, email (unique), password (select:false), points, stripeID, isVerified, otp / otpExpiresAt, subscriber, profilePicture → Image, Bank[], Address[], Whishlist, Review[], Sale[], CouponRedeem[] |
| **Admin**        | Admin accounts (used with Role in JWT) |
| **Product**      | Product, ProductCode, name, description, price, quantity, currentColor, LifeStage, currentSize, currentFlavor, isArchive, ingredients, nutritional_info (protein/fat/fiber/moisture), brand → Brand, category → Category, Discount, review[], whishlist[], color/size/flavor (self-refs for variants), images[] → Image |
| **Category**     | Product categories |
| **Brand**        | Brands |
| **Discount**     | Discount rules linked to products |
| **Coupon**       | Coupon definitions |
| **ReedemCoupon** | Coupon redemption records (note spelling) |
| **Sale**         | Order: User, Discount, Product[] → SaleOfProduct, Address, Bank, Review, CouponRedeem, totalAmount, totalAmountAfterDiscount, couponvalue, paymentMethod, status (`Pending` \| `Processing` \| `Shipped` \| `Delivered` \| `Cancelled` \| `Scheduled`), stripePaymentIntentId, trackingDetails (carrier, trackingNumber, estimatedDeliveryDate, currentLocation, lastUpdated, deliveryAttempts, comments), deliveryDate, scheduleDate, Notes |
| **SaleOfProduct**| Line items for a sale |
| **PendingSale**  | Pending / incomplete sales |
| **Address**      | User shipping addresses |
| **Bank**         | User payment method / bank info |
| **Review**       | Product reviews |
| **Whishlist**    | Wishlist (spelling as in repo) |
| **Blog**         | Blog posts |
| **Image**        | Stored images |

Product attributes (LifeStage, flavor, size, nutritional_info, ingredients) confirm a **pet e-commerce** domain (food, treats, etc.).

### 4.5 Auth (`utils/AuthCheck.js`)

- Requires `JWT_SECRET` (throws if missing).
- `getUserId(req)` — validates Bearer token, ensures user exists.
- `getAdminId(req)` — validates token and matching Admin + Role.
- Tokens carry `id` (and for admins, `Role`).

### 4.6 Real-time (`Middlewares/socket.js`)

- **join-order** `{ saleId, token }` — only order owner or admin can join `sale:<saleId>`.
- **leave-order**
- **join-admin** `{ token }` — only verified admin joins `admins` room (for new-order pushes).

### 4.7 Utilities

- `utils/mailer.js` — SMTP (Nodemailer) for password-reset OTPs; if SMTP unset, OTPs logged to console (dev fallback).
- `utils/saveImage.js` — image persistence.
- `utils/functions.js` — shared helpers.
- `utils/AuthCheck.js` — as above.

### 4.8 Payments

- Stripe SDK used for PaymentIntents.
- Webhook route `/Stripe-Webhook` uses raw body + `STRIPE_WEBHOOK_SECRET`.
- Sales store `stripePaymentIntentId`.

### 4.9 Tests

- `Backend/tests/auth.test.js` — Jest + Supertest (`npm test` runs `jest --runInBand`).

### 4.10 Backend Dependencies (key)

- express, mongoose, dotenv, cors, helmet, express-rate-limit, express-mongo-sanitize
- jsonwebtoken, bcryptjs, email-validator
- stripe, socket.io, nodemailer, node-cron, axios, moment, body-parser
- Dev: nodemon, jest, supertest

### 4.11 Backend Scripts

```bash
npm start   # node app.js
npm run dev # nodemon app.js
npm test    # jest --runInBand
```

### 4.12 Backend Environment (`.env.example`)

```env
MONGODB_URI=mongodb://127.0.0.1:27017/metropolitan
JWT_SECRET=replace-with-a-long-random-secret
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_WEBHOOK_SECRET=whsec_replace_me
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
PORT=5000
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Metropolitan <no-reply@example.com>"
```

---

## 5. Customer Frontend

### 5.1 Tech Stack

- React 18 + Create React App (`react-scripts` 5)
- React Router DOM v6 (`createBrowserRouter`)
- Tailwind CSS
- Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- Socket.IO client
- AOS (Animate On Scroll)
- SweetAlert / SweetAlert2
- Headless UI, Heroicons, React Icons
- Axios, Moment

### 5.2 Configuration (`src/link.js`)

```js
BackendLink = process.env.REACT_APP_BACKEND_LINK || "http://localhost:5000"
ImageCloud  = process.env.REACT_APP_IMAGE_CLOUD  || "http://localhost:5000/GetImage"
StripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
```

### 5.3 Environment (`.env.example`)

```env
SKIP_PREFLIGHT_CHECK=true
REACT_APP_BACKEND_LINK=http://localhost:5000
REACT_APP_IMAGE_CLOUD=http://localhost:5000/GetImage
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_replace_me
```

### 5.4 Pages (`src/Pages/`)

| Page                         | Route(s)                          | Purpose |
|-----------------------------|-----------------------------------|---------|
| Home                        | `/`, `*`                          | Landing |
| SignIn (Singin.js)          | `/SignIn`                         | Login |
| Signup                      | `/SignUp`                         | Registration |
| Category                    | `/Category`, `/Category/:name`    | Category / product listing |
| ProductDetails              | `/ProductDetails/:id`             | Product detail |
| ProductDetailWithComments   | `/ProductDetailWithComments`      | Detail + comments/reviews |
| Cart                        | `/Cart`                           | Shopping cart |
| Checkout                    | `/Checkout`                       | Checkout flow |
| Payment                     | `/Payment`                        | Payment (Stripe) |
| Wishlist                    | `/Wishlist`                       | Wishlist |
| OrderHistory                | `/OrderHistory`                   | Past orders |
| OrderTracking               | `/OrderTracking/:id`              | Live order tracking (Socket.IO) |
| Profile                     | `/Profile`                        | User profile |
| AccountSetting              | `/AccountSetting`                 | Account settings |
| ChangePassword              | `/ChangePassword`                 | Password change |
| Privacy                     | `/privacy-policy`                 | Privacy policy |
| TAC (Terms)                 | `/TermsOfUse`                     | Terms of use |
| BlogList                    | `/Blog`                           | Blog listing |
| BlogDetail                  | `/Blog/:id`                       | Single blog post |

Routing is defined in `src/App.js` with `createBrowserRouter`. AOS is initialized on mount.

### 5.5 Other Frontend Folders

- **Components/** — Reusable UI pieces  
- **Section/** — Page sections  
- **context/** — React context (auth, cart, etc.)  
- **hooks/** — Custom hooks  
- **utils/** — Helpers  
- **assests/** — Static assets (typo in folder name)  
- **socket.js** — Socket.IO client setup for order updates  

### 5.6 Frontend Scripts

```bash
npm start   # react-scripts start
npm run build
npm test
```

---

## 6. Admin Panel

### 6.1 Tech Stack

- React 18 + CRA
- Tailwind (+ tailwindcss-rtl)
- Material UI (`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`)
- ApexCharts / react-apexcharts
- Chakra UI (selected packages: modal, popover, portal, system, tooltip, hooks)
- Framer Motion, React Calendar, React Table
- React Router v6, Axios, SweetAlert, Moment, React Icons

### 6.2 Configuration

- `REACT_APP_PUBLIC_PATH=http://localhost:5000` (API base)
- `SKIP_PREFLIGHT_CHECK=true`
- Path aliases via `jsconfig.json` (e.g. `views/...`)

### 6.3 Routes (`src/routes.js`)

Admin layout routes (under `/admin`) and auth under `/auth`:

| Name            | Path                                      | Notes |
|-----------------|-------------------------------------------|-------|
| Sign In         | `/auth/sign-in`                           | Hidden from sidebar |
| Main Dashboard  | `/admin/default`                          | Charts / overview |
| Brand           | `/admin/Brand`                            | List |
| AddBrand        | `/admin/AddBrand/:id`                     | Create/edit (hidden) |
| Category        | `/admin/Category`                         | List |
| AddCategory     | `/admin/AddCategory/:id`                  | Create/edit |
| Discount        | `/admin/Discount`                         | List |
| AddDiscount     | `/admin/AddDiscount/:id`                  | Create/edit |
| Coupon          | `/admin/Coupon`                           | List |
| AddCoupon       | `/admin/AddCoupon/:id`                    | Create/edit |
| Product         | `/admin/Product`                          | List |
| AddProduct      | `/admin/AddProduct/:id`                   | Create/edit |
| SelectProduct   | `/admin/SelectProduct/:ProductCode/:Type/:id` | Variant selection (color/size/flavor) |
| Address         | `/admin/Address`                          | List |
| User            | `/admin/User`                             | Customer list |
| Sale            | `/admin/Sale`                             | Orders list |
| EditSale        | `/admin/EditSale/:id`                     | Order tracking / update |
| Bank            | `/admin/Bank`                             | Payment methods |
| Blog            | `/admin/Blog`                             | List |
| AddBlog         | `/admin/AddBlog/:id`                      | Create/edit |
| Reviews         | `/admin/Review`                           | Review moderation |

Protected by `ProtectedRoute.js` (admin JWT + Role).

### 6.4 Views Structure

```
views/
├── auth/
│   └── SignIn
└── admin/
    ├── default/     # Main dashboard
    ├── Address/
    ├── Bank/
    ├── Blog/
    ├── Brand/
    ├── Category/
    ├── Coupon/
    ├── Discount/
    ├── Product/     # List, Add, Select
    ├── Review/
    ├── Sale/        # List + OrderTracking
    └── User/
```

### 6.5 Admin Scripts

```bash
npm start
npm run build
npm test
npm run pretty   # Prettier
```

---

## 7. Feature Summary

### Customer-facing

- Browse by category; product detail with variants (color / size / flavor)
- Cart, wishlist, checkout
- Stripe payments
- Order history and real-time order tracking (Socket.IO)
- Reviews / comments on products
- Profile, account settings, change password
- Blog list + detail
- Privacy policy & terms
- Points / loyalty field on User
- Coupon application at checkout
- Password reset via OTP (email or console fallback)

### Admin

- Dashboard with charts (ApexCharts)
- CRUD for Brands, Categories, Products (incl. variants), Discounts, Coupons, Blogs
- Manage Users, Addresses, Banks
- Manage Sales / orders (status, tracking details)
- Review management
- Real-time new-order notifications via Socket.IO admin room

### Cross-cutting

- JWT auth for users and admins
- Image upload/storage and serving
- Rate-limited auth endpoints
- Helmet + CORS + mongo-sanitize
- Stripe webhook for payment confirmation
- Optional SMTP for OTPs

---

## 8. Data & Business Concepts

- **Products** support multi-variant linking (color/size/flavor as related Product documents), archival flag, nutritional info, and discount linkage — typical of pet food/supplies catalogs.
- **Sales** are full orders with status machine, optional scheduling, tracking metadata, and Stripe intent ID.
- **Users** hold points, optional Stripe customer ID, addresses, banks, wishlist, reviews, and past sales.
- **Coupons** and **Discounts** are first-class entities with redemption tracking.

---

## 9. Security Notes (as implemented)

- Passwords stored hashed (bcryptjs); password field `select: false`.
- JWT secret required; no hard-coded secrets in `.env.example`.
- Stripe secrets only in env; publishable key only on frontend.
- Auth routes rate-limited.
- Mongo sanitize and Helmet enabled.
- Socket rooms gated by token ownership / admin Role.
- CORS restricted to configured origins when set.
- `.env` and builds are gitignored; only `.env.example` is tracked.

---

## 10. How to Run (Local Development)

1. **MongoDB** running (local or Atlas). Set `MONGODB_URI`.

2. **Backend**
   ```bash
   cd Backend
   cp .env.example .env
   # Fill JWT_SECRET, Stripe keys, CORS_ORIGIN, optional SMTP
   npm install
   npm run dev
   # → http://localhost:5000
   ```

3. **Frontend**
   ```bash
   cd Frontend
   cp .env.example .env
   # Set REACT_APP_* (backend URL, image cloud, Stripe publishable key)
   npm install
   npm start
   # → http://localhost:3000
   ```

4. **Admin**
   ```bash
   cd Admin
   cp .env.example .env
   # Set REACT_APP_PUBLIC_PATH to backend URL
   npm install
   npm start
   # → typically http://localhost:3001 (if 3000 is taken)
   ```

5. **Stripe webhook (local)**  
   Use Stripe CLI: `stripe listen --forward-to localhost:5000/Stripe-Webhook` and put the signing secret into `STRIPE_WEBHOOK_SECRET`.

---

## 11. Naming & Consistency Notes

- Repo name: **Eccomerce** (double “c”, missing “m”).
- Package names: backend `metropolitan`, frontend `pet-ecommerce`, admin `pet-eccomerece`.
- Model/folder spellings: `Whishlist`, `ReedemCoupon`, Frontend `assests`, page `Singin.js`.
- These are preserved as in the source; documentation does not rename them.

---

## 12. What Is *Not* Present

- No root README or project-level documentation (this file is external documentation).
- No Docker / docker-compose.
- No CI config visible in the top-level tree.
- No production deployment config (Procfile, nginx, etc.) in the explored tree.
- Frontend and Admin are separate CRA apps (not a monorepo with shared packages).
- No GraphQL; pure REST + Socket.IO.

---

## 13. Quick Reference — Key Paths

| Concern              | Location |
|----------------------|----------|
| API entry            | `Backend/app.js` |
| Express + Socket setup | `Backend/Middlewares/Server.js`, `socket.js` |
| Route mounting       | `Backend/Middlewares/Routes.js` |
| Auth helpers         | `Backend/utils/AuthCheck.js` |
| Product schema       | `Backend/models/Product.js` |
| Order (Sale) schema  | `Backend/models/Sale.js` |
| User schema          | `Backend/models/User.js` |
| Customer routes      | `Frontend/src/App.js` |
| Admin routes         | `Admin/src/routes.js` |
| Env templates        | `*/.env.example` |

---

## 14. Summary

**Eccomerce** is a complete, multi-app **pet e-commerce** system:

- **Backend** — Express + MongoDB API with JWT auth, Stripe, Socket.IO order/admin rooms, rate limiting, and image serving.
- **Frontend** — Customer store with catalog, cart, checkout, Stripe pay, wishlist, reviews, blog, order tracking, and account management.
- **Admin** — Full management UI for catalog, orders, users, coupons, discounts, blogs, and reviews, with dashboard charts and real-time order alerts.
