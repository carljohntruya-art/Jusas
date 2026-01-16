# 🌴 Jusas Monorepo: Full Vercel Deployment Guide

This guide provides a production-grade, step-by-step walkthrough to deploy the **Jusas Smoothie E-commerce** app to Vercel.

---

## 📋 1. Pre-Deployment Checklist

Before starting, ensure you have:

- [ ] A **GitHub** account with your code pushed to a repository.
- [ ] A **Vercel** account (linked to GitHub).
- [ ] A **PostgreSQL** database (Recommended: [Neon.tech](https://neon.tech/) or Supabase for free tiers).
- [ ] **Node.js 18+** configured in your environment.

### Required Files in Root:

- `vercel.json`: Handles routing between Frontend and Backend.
- `package.json`: Contains root-level scripts.
- `frontend/package.json`: Contains Vite build scripts.
- `backend/package.json`: Contains Prisma and Express build scripts.

---

## 🐘 2. Database Setup (Neon.tech)

Vercel deployment requires a real database. We use **Neon.tech** as it integrates perfectly.

1.  **Create a Neon Account**: Go to [Neon.tech](https://neon.tech/) and create a new project called `jusas-db`.
2.  **Get Connection String**: Copy the `DATABASE_URL`. It should look like:
    `postgres://user:password@hostname/neondb?sslmode=require`
3.  **Direct Connection URL**: Copy the "Pooled" or "Direct" URL for Prisma.

---

## 🚀 3. Vercel Project Configuration

### Step 3.1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" > "Project"**.
2. Select your **Jusas** repository.

### Step 3.2: Project Settings (CRITICAL)

- **Framework Preset**: Other (or Vite).
- **Root Directory**: Leave as `.` (Root).
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### Step 3.3: Environment Variables

Add the following variables in the Vercel Dashboard under **Settings > Environment Variables**:

| Variable       | Description                           | Example/Value                           |
| :------------- | :------------------------------------ | :-------------------------------------- |
| `DATABASE_URL` | Prisma Connection String              | `postgres://user:pass@host/db...`       |
| `JWT_SECRET`   | Secret for Authentication             | `yoursupersecretphrase123`              |
| `FRONTEND_URL` | Your Vercel URL (Update after deploy) | `https://jusas-smoothie.vercel.app`     |
| `API_URL`      | Your Vercel URL + /api                | `https://jusas-smoothie.vercel.app/api` |
| `NODE_ENV`     | Environment Type                      | `production`                            |

---

## 📦 4. Build & Deployment Execution

Vercel will run the following automatically based on our `vercel-build` scripts:

1.  **Framework Setup**: Vercel detects the root `package.json`.
2.  **Build Stage**:
    - Runs `npx prisma generate` in the backend to prepare the database client.
    - Runs `tsc && vite build` in the frontend to generate the static files.
3.  **Serverless Routing**:
    - Requests to `/api/*` are routed to `backend/src/index.ts` (mapped in `vercel.json`).
    - All other requests serve the React app from `frontend/dist`.

---

## 🛠️ 5. Database Migrations (Manual First Step)

Because it's a new database, you must push the schema:

1.  **On your local machine**, point your `.env` to the Neon `DATABASE_URL`.
2.  Run:
    ```bash
    cd backend
    npx prisma migrate deploy
    npx prisma db seed
    ```
    _This creates the tables and seeds the admin user/products into your production DB._

---

## 🧐 6. Common Errors & Fixes

| Issue                         | Cause                            | Fix                                                                        |
| :---------------------------- | :------------------------------- | :------------------------------------------------------------------------- |
| **401 Unauthorized**          | `JWT_SECRET` mismatch or missing | Ensure `JWT_SECRET` in Vercel matches your encryption logic.               |
| **Prisma Client Not Found**   | Missing `prisma generate`        | Ensure `backend/package.json` has `"vercel-build": "npx prisma generate"`. |
| **500 Internal Server Error** | Missing `DATABASE_URL`           | Check Vercel logs for missing connection metadata.                         |
| **CORS Errors**               | `FRONTEND_URL` incorrect         | Ensure the backend `cors` config uses the exact Vercel domain.             |

---

## ✅ 7. Final Verification

1.  **Visit Site**: `https://your-project.vercel.app`.
2.  **Test API**: Visit `https://your-project.vercel.app/api`. You should see `{"message": "Jusas Tropical Smoothie API is running 🌴"}`.
3.  **Admin Test**:
    - Login at `/login` as admin.
    - Go to `/admin/dashboard`.
    - Verify charts and product lists load.
4.  **Order Flow**:
    - Add a smoothie to cart.
    - Checkout as guest or logged-in user.
    - Verify transition to "Success" page.

---

### 💡 Backend Strategy (Vercel Node)

Vercel converts your `backend/src/index.ts` into a **Serverless Function**.

- **CORS**: Handled in `index.ts` using the `cors` package.
- **Sessions**: Not used! We use **JWT in Cookies** for stateless authentication.
- **Uploads**: Files are stored in the `uploads` folder. _Note: Vercel functions have ephemeral storage. For production images, use S3/Cloudinary in Phase 5._
