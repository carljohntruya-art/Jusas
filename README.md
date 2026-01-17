# 🧃 JUSAS - Tropical Smoothie E-Commerce

![Hero Banner](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

> **A modern, full-stack e-commerce platform for ordering fresh tropical smoothies with enterprise-grade authentication, mobile-optimized performance, and real-time order management.**

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Live Demo & Test Accounts](#-live-demo--test-accounts)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Authentication Flow](#-authentication-flow)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌴 Overview

**JUSAS** is a production-grade tropical smoothie e-commerce application built with React, Express, and PostgreSQL. Designed for young health-conscious customers, it features:

- **Guest-to-User Seamless Transition**: Add items to cart as a guest, log in, and your cart is preserved.
- **Role-Based Access Control**: Separate customer and admin dashboards with server-validated permissions.
- **Mobile-First Performance**: Responsive images, lazy loading, and optimized animations for smooth 60fps scrolling.
- **Real-Time Order Management**: Admins can approve/decline orders, customers see live status updates.

### Why JUSAS?

- **Security-First**: JWT-based authentication with httpOnly cookies, server-validated sessions, and atomic logout.
- **Production-Ready**: Deployed on Vercel with CI/CD, includes comprehensive error handling and session management.
- **Developer-Friendly**: Clear separation of concerns, TypeScript throughout, and detailed inline documentation.

---

## 🚀 Live Demo & Test Accounts

### **Production URLs**

- **Website**: [https://jusas-new.vercel.app](https://jusas-new.vercel.app)
- **API Endpoint**: `https://jusas-new.vercel.app/api`

### **Test Credentials**

| Role         | Email                 | Password  | Access Level                  |
| ------------ | --------------------- | --------- | ----------------------------- |
| **Admin**    | admin@smoothie.local  | Admin123! | Full dashboard, stock, orders |
| **Customer** | _(Register your own)_ | -         | Shopping, cart, order history |

> ⚠️ **Note**: The admin account is pre-seeded. Customers must register via `/register`.

---

## 🛠️ Tech Stack

### **Frontend**

- **React 18** with TypeScript for type safety
- **Vite** for blazing-fast dev server and HMR
- **Tailwind CSS** + custom design tokens for consistent styling
- **Framer Motion** for smooth, GPU-accelerated animations
- **Zustand** for lightweight, server-first state management
- **Axios** with interceptors for centralized API error handling

### **Backend**

- **Node.js** + **Express** for RESTful API
- **Prisma ORM** for type-safe database queries
- **PostgreSQL** (Neon) for production-grade persistence
- **JWT** (jsonwebtoken) for stateless authentication
- **bcryptjs** for secure password hashing

### **DevOps & Deployment**

- **Vercel** for frontend + API hosting (serverless functions)
- **GitHub Actions** for CI/CD automation
- **Neon Database** for managed PostgreSQL
- **Environment Variables** for secrets management

---

## ✨ Features

### **Customer Experience**

- ✅ **Product Browsing**: View featured smoothies, search, and filter by category
- ✅ **Guest Cart**: Add items before logging in, preserved across sessions
- ✅ **Secure Checkout**: GCash (with image upload) and Cash-on-Delivery options
- ✅ **Order Tracking**: Real-time status updates (Pending → Approved → Delivered)
- ✅ **Order History**: View past orders with decline reasons (if rejected)

### **Admin Dashboard**

- ✅ **Stock Management**: Direct +/- controls on product cards
- ✅ **Order Pipeline**: Approve/decline orders with custom decline messages
- ✅ **Analytics**: Sales trends, revenue charts, and top-selling products
- ✅ **Product CRUD**: Create, edit, delete products with image support

### **Security & Performance**

- ✅ **Server-Validated Sessions**: Protected routes call `/auth/me` on every navigation
- ✅ **Atomic Logout**: Clears client state, cookies, and localStorage synchronously
- ✅ **Mobile Optimization**: Responsive images (`srcSet`), lazy loading, reduced motion
- ✅ **No Phantom Sessions**: Back button navigation re-validates authentication

---

## 🏗️ Project Architecture

```
Jusas/
├── frontend/                  # React SPA
│   ├── src/
│   │   ├── api/              # Axios client and interceptors
│   │   ├── components/       # Reusable UI components (Navbar, ProductCard, etc.)
│   │   ├── config/           # Route constants and app config
│   │   ├── pages/            # Page-level components (Home, Menu, Cart, Admin)
│   │   ├── store/            # Zustand stores (Auth, Cart, Toast)
│   │   └── App.tsx           # Root component with protected routes
│   ├── public/               # Static assets (logo, favicon)
│   └── vite.config.ts        # Vite configuration with proxy setup
│
├── backend/                   # Express API
│   ├── src/
│   │   ├── controllers/      # Request handlers (auth, products, orders)
│   │   ├── middleware/       # Auth guards, error handlers
│   │   ├── routes/           # API route definitions
│   │   ├── utils/            # Helpers (image sanitization, etc.)
│   │   └── index.ts          # Express app entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Version-controlled DB migrations
│   ├── seed.ts               # Database seeding script (admin + products)
│   └── vercel.json           # Serverless function config
│
├── docs/                      # Additional documentation
│   └── PRODUCTION_SETUP_GUIDE.md
└── design-tokens.json         # Centralized design system
```

### **Key Design Decisions**

1. **Monorepo Structure**: Frontend and backend in same repo for atomic deploys.
2. **Server-First Auth**: `ProtectedRoute` re-validates on every navigation to prevent stale sessions.
3. **Centralized Routes**: `config/routes.ts` ensures consistency across components.
4. **Image Optimization**: Uses Unsplash/Pexels with `?w=` query params for responsive delivery.

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ (or use [Neon](https://neon.tech) free tier)
- **Git**

### **1. Clone the Repository**

```bash
git clone https://github.com/carljohntruya-art/Jusas.git
cd Jusas
```

### **2. Install Dependencies**

```bash
# Install all packages (frontend + backend)
npm install --prefix frontend
npm install --prefix backend
```

### **3. Configure Environment Variables**

#### **Backend** (`backend/.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/jusas"
DIRECT_URL="postgresql://user:password@localhost:5432/jusas"  # For migrations
JWT_SECRET="your-super-secret-jwt-key-here"
NODE_ENV="development"
```

#### **Frontend** (`frontend/.env`)

```env
VITE_API_URL="http://localhost:3000/api"  # Optional, defaults to /api
```

> 💡 **Tip**: Generate a strong JWT secret with `openssl rand -base64 64`

### **4. Set Up the Database**

```bash
cd backend

# Run migrations to create tables
npx prisma migrate dev

# Seed database with admin user and sample products
npx prisma db seed

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

### **5. Start Development Servers**

```bash
# Terminal 1: Start backend API
cd backend
npm run dev  # Runs on http://localhost:3000

# Terminal 2: Start frontend dev server
cd frontend
npm run dev  # Runs on http://localhost:5173
```

### **6. Access the Application**

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)
- **Prisma Studio**: [http://localhost:5555](http://localhost:5555)

### **7. Login as Admin**

1. Go to [http://localhost:5173/login](http://localhost:5173/login)
2. Use credentials: `admin@smoothie.local` / `Admin123!`
3. Navigate to [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 🔐 Authentication Flow

### **How It Works**

JUSAS uses a **server-first** authentication model where the backend is the single source of truth.

#### **1. User Registration**

```
Frontend → POST /api/auth/register → Backend creates user → Returns success
User redirected to /login (does NOT auto-login)
```

#### **2. Login**

```
Frontend → POST /api/auth/login → Backend validates credentials
Backend sets httpOnly cookie with JWT (maxAge: 24h)
Frontend stores user data in Zustand store → Redirect to /
```

#### **3. Protected Routes**

```
User navigates to /admin or /orders
↓
ProtectedRoute calls GET /api/auth/me
↓
Backend validates JWT from cookie → Returns user data
↓
If valid: Render page
If invalid (401): Redirect to /login
```

#### **4. Logout**

```
User clicks "Logout"
↓
Frontend IMMEDIATELY:
  - Clears Zustand state
  - Wipes localStorage
  - Deletes all cookies
↓
Calls POST /api/auth/logout (fire-and-forget)
↓
Hard redirect to / (kills React state tree)
```

### **Session Persistence**

- **Cookie**: `token` (httpOnly, secure in production, sameSite: lax)
- **Expiration**: 24 hours
- **Refresh**: Not implemented (user must re-login after 24h)
- **Multi-Tab Sync**: `localStorage.clear()` on logout affects all tabs

### **Admin vs Customer**

| Feature                | Customer | Admin |
| ---------------------- | -------- | ----- |
| View Products          | ✅       | ✅    |
| Add to Cart            | ✅       | ❌    |
| Place Orders           | ✅       | ❌    |
| Manage Stock           | ❌       | ✅    |
| Approve/Decline Orders | ❌       | ✅    |
| View Analytics         | ❌       | ✅    |

> **Role Enforcement**: The `requireAdmin` prop on `ProtectedRoute` checks `user.role === 'admin'` (validated server-side via JWT claims).

---

## 🌐 Deployment

### **Vercel Deployment (Recommended)**

#### **Prerequisites**

1. Create accounts on:
   - [Vercel](https://vercel.com)
   - [Neon](https://neon.tech) (for PostgreSQL)
2. Install Vercel CLI: `npm i -g vercel`

#### **Step-by-Step**

1. **Link Your GitHub Repo to Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your `Jusas` repository
   - Select **Root Directory**: `.` (monorepo)

2. **Configure Build Settings**

   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables in Vercel**

   Navigate to **Settings → Environment Variables**:

   ```env
   DATABASE_URL=postgresql://user:pass@neon.tech/jusas?sslmode=require
   DIRECT_URL=postgresql://user:pass@neon.tech/jusas?sslmode=require
   JWT_SECRET=your-production-jwt-secret-here
   NODE_ENV=production
   ```

4. **Run Migrations on Production Database**

   ```bash
   # From your local machine
   cd backend
   npx prisma migrate deploy  # Uses DIRECT_URL from .env
   npx prisma db seed         # Seed admin user
   ```

5. **Deploy**

   ```bash
   vercel --prod
   ```

   Or push to `main` branch (auto-deploys if GitHub integration enabled).

#### **Troubleshooting**

- **401 Errors After Deployment**: Check `sameSite` cookie settings in `backend/src/controllers/authController.ts` (should be `'lax'` for Vercel).
- **CORS Issues**: Verify `frontend/.env` has the correct `VITE_API_URL` or use relative `/api` paths.
- **Database Connection**: Ensure `DIRECT_URL` is set (Neon requires direct connections for migrations).

### **Alternative: Manual Deployment**

See [PRODUCTION_SETUP_GUIDE.md](./docs/PRODUCTION_SETUP_GUIDE.md) for detailed instructions.

---

## 🤝 Contributing

We welcome contributions! Follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**

- Follow the existing code style (ESLint + Prettier configs included)
- Write meaningful commit messages (follow [Conventional Commits](https://www.conventionalcommits.org/))
- Add tests for new features (if applicable)
- Update documentation for breaking changes

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Carl John Truya**

- GitHub: [@carljohntruya-art](https://github.com/carljohntruya-art)
- Email: carljohntruya.art@example.com
- Live Project: [https://jusas-new.vercel.app](https://jusas-new.vercel.app)

---

## 🙏 Acknowledgments

- **Icons**: [Lucide React](https://lucide.dev/)
- **Images**: [Unsplash](https://unsplash.com/) & [Pexels](https://www.pexels.com/)
- **Design Inspiration**: Modern e-commerce platforms and tropical branding
- **Community**: Open-source contributors who make projects like this possible

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/carljohntruya-art/Jusas/issues) page
2. Open a new issue with the bug template
3. Join the discussion in the [Discussions](https://github.com/carljohntruya-art/Jusas/discussions) tab

---

**⭐ If this project helped you, consider giving it a star on GitHub!**
