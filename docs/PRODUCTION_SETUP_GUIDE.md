# 🚀 Comprehensive Production Setup Guide

This guide provides a sequential, security-first approach to deploying your application to production using **Vercel**, **Neon PostgreSQL**, and **GitHub Actions**.

---

## 📅 Roadmap Overview

1. [Phase 0: Prerequisites](#phase-0-prerequisites--initial-setup)
2. [Phase 1: Neon Database Setup](#phase-1-neon-database-setup)
3. [Phase 2: Vercel Setup](#phase-2-vercel-account--project-setup)
4. [Phase 3: GitHub Repository Setup](#phase-3-github-repository-setup)
5. [Phase 4: Environment Configuration](#phase-4-environment-configuration)
6. [Phase 5: Database Connection](#phase-5-database-connection-implementation)
7. [Phase 6: CI/CD Pipeline](#phase-6-cicd-pipeline-setup)
8. [Phase 7: Deployment & Verification](#phase-7-deployment--verification)

---

## Phase 0: Prerequisites & Initial Setup

Before starting, ensure your local environment is ready.

### 🛠️ Tooling Check

Run these commands to verify your installations:

```bash
node --version  # Recommended: v18+
git --version   # Ensure Git is initialized
npm --version
```

### 📁 Project Structure

Ensure your project has a clear separation between frontend and backend (if applicable).

> [!IMPORTANT]
> Your `.gitignore` **MUST** include `.env`, `.env.local`, and any other secret files.

---

## Phase 1: Neon Database Setup

> [!NOTE]
> We set up the database first so the connection string is ready for Vercel/GitHub configuration.

1. **Sign Up**: Go to [Neon.tech](https://neon.tech) and create an account.
2. **Create Project**: Click "Create a Project".
   - Name: `my-production-db`
   - Region: Select the one closest to your users (or Vercel deployment region).
3. **Generate Connection Strings**:
   - In the Neon Console, go to **Settings** -> **Connection String**.
   - **DATABASE_URL (Pooled)**: Toggle **Pooling** to **ON**. This URL is for your application runtime. It usually has `-pooler` in the hostname.
   - **DIRECT_URL (Unpooled)**: Toggle **Pooling** to **OFF**. This URL is for Prisma migrations. It usually uses port `5432`.
   - Copy both strings.
4. **SQL Test Query**: Go to the **SQL Editor** tab and run:
   ```sql
   SELECT NOW();
   ```
5. **Credential Storage**: Save this string securely in a password manager. **DO NOT** commit it to Git.

---

## Phase 2: Vercel Account & Project Setup

1. **Account**: Login to [Vercel](https://vercel.com).
2. **Token Generation**:
   - Go to **Account Settings** -> **Tokens**.
   - Create a new token named `GITHUB_ACTIONS_DEPLOY`.
   - **Save this immediately**; it will be used as `VERCEL_TOKEN` in GitHub Secrets.
3. **Org ID & Project ID**:
   - Install Vercel CLI locally: `npm i -g vercel`
   - Run `vercel link` in your project folder.
   - This creates a `.vercel` folder containing your `projectId` and `orgId`.

---

## Phase 3: GitHub Repository Setup

1. **Create Repo**: Create a new private repository on GitHub.
2. **Link Local Project**:
   ```bash
   git remote add origin https://github.com/username/repo-name.git
   git branch -M main
   git push -u origin main
   ```
3. **Configure GitHub Secrets**:
   Navigate to **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**:

| Secret Name         | Value                                                     |
| :------------------ | :-------------------------------------------------------- |
| `DATABASE_URL`      | Your Neon **Pooled** connection string                    |
| `DIRECT_URL`        | Your Neon **Unpooled** connection string (for migrations) |
| `VERCEL_TOKEN`      | The token generated in Phase 2                            |
| `VERCEL_ORG_ID`     | Found in `.vercel/project.json`                           |
| `VERCEL_PROJECT_ID` | Found in `.vercel/project.json`                           |

---

## Phase 4: Environment Configuration

### Local Setup (`.env.local`)

Create a `.env.local` for development:

```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/db?sslmode=disable"
PORT=3000
JWT_SECRET="generate_me_below"
```

### Secure Secret Generation

If you don't have `openssl` installed, you can use Node.js (which you already have):

**Option A: Using Node.js (Cross-platform)**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option B: Using OpenSSL**

```bash
openssl rand -base64 32
```

### Vercel Dashboard

Add the production variables in the Vercel dashboard under **Project Settings** -> **Environment Variables**.

> [!WARNING]
> Ensure `DATABASE_URL` in production includes `?sslmode=require`.

---

## Phase 5: Database Connection Implementation

Use a connection pool to handle serverless scaling.

### Example (Node.js/Prisma)

```javascript
// src/lib/db.js
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export default pool;
```

> [!IMPORTANT]
> If using Prisma, your `schema.prisma` **MUST** be updated to handle Neon's connection pooling:

```prisma
// backend/prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // Pooled connection (for Vercel runtime)
  directUrl = env("DIRECT_URL")     // Direct connection (for migrations)
}
```

---

## Phase 6: CI/CD Pipeline Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Production Deployment
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v3
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Phase 7: Deployment & Verification

1. **Manual Deploy**: Run `vercel --prod` to test the build process locally.
2. **Verify Endpoints**:
   - Create a `/api/health` route that queries the DB:
   ```javascript
   // Example express route
   app.get("/api/health", async (req, res) => {
     const result = await pool.query("SELECT 1");
     res.json({ status: "ok", db: result.rowCount === 1 });
   });
   ```
3. **Troubleshooting**:
   - **SSL Error**: Ensure `?sslmode=require` is in the URL.
   - **Vercel Build Fail**: Check if `npm run build` works locally first.

---

## ✅ Verification Checklist

- [ ] Local dev server connects to local/dev DB.
- [ ] `.gitignore` prevents `.env` from being pushed.
- [ ] GitHub Actions successfully triggers on push to `main`.
- [ ] Vercel dashboard shows all environment variables active.
- [ ] Production URL `/api/health` returns `{ "status": "ok", "db": true }`.
- [ ] No secrets are visible via `git grep` or accidental console logs.

---

## ⚠️ Common Pitfalls

- **404: NOT_FOUND**:
  - This happens if your `vercel.json` routes point to `frontend/dist/`. Vercel's build process extracts the contents of `dist` into the root of the project source, so the correct destination is `frontend/`.
- **Vercel CLI Warnings**:
  - _Build not running on Vercel_: This is normal for local builds; it just means Vercel's internal system variables (like `VERCEL_URL`) aren't automatically injected.
  - _Due to `builds` existing..._: This is also normal. It means your `vercel.json` is taking priority over the Vercel Dashboard settings (which is what we want for this monorepo).
- **Node Version Mismatch**: Ensure `engines` in `package.json` matches Vercel's Node version.
