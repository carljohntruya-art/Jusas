# Phase 4: GitHub Push & Vercel Deployment Guide

## Overview

This guide provides step-by-step instructions for pushing your JUSAS project to GitHub and deploying to Vercel.

---

## Prerequisites Check

Before proceeding, verify:

- ✅ Phases 1-3 completed (Git initialized, code committed)
- ✅ GitHub account with repository created: `https://github.com/carljohntruya-art/Jusas`
- ✅ Vercel account created at [vercel.com](https://vercel.com)

---

## Step 1: Connect to GitHub Repository

### 1.1 Add GitHub Remote

```bash
git remote add origin https://github.com/carljohntruya-art/Jusas.git

# Verify remote was added
git remote -v
```

**Expected output:**

```
origin  https://github.com/carljohntruya-art/Jusas.git (fetch)
origin  https://github.com/carljohntruya-art/Jusas.git (push)
```

### 1.2 Push to GitHub

```bash
# Push main branch to GitHub
git push -u origin main
```

**If you encounter authentication issues:**

- **HTTPS**: You'll need a Personal Access Token (PAT) from GitHub Settings > Developer settings > Personal access tokens
- **SSH**: Set up SSH keys following [GitHub's SSH guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

### 1.3 Verify on GitHub

1. Visit `https://github.com/carljohntruya-art/Jusas`
2. Confirm files are visible
3. Check that README.md displays correctly

---

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended for First Deployment)

#### 2.1 Import Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your **GitHub account** and choose **`Jusas`** repository
5. Click **"Import"**

#### 2.2 Configure Project Settings

**Framework Preset:** Other (or leave as detected)

**Root Directory:** Leave as `./` (root)

**Build Command:**

```bash
npm run build
```

**Output Directory:**

```
frontend/dist
```

**Install Command:**

```bash
npm install
```

#### 2.3 Add Environment Variables

Click **"Environment Variables"** and add these:

| Name             | Value                          | Notes                                       |
| ---------------- | ------------------------------ | ------------------------------------------- |
| `NODE_ENV`       | `production`                   | Required                                    |
| `DATABASE_URL`   | `postgresql://...`             | Get from Vercel Postgres (see Step 3)       |
| `DIRECT_URL`     | `postgresql://...`             | Get from Vercel Postgres                    |
| `JWT_SECRET`     | `<generate-64-char-string>`    | Use a password generator                    |
| `JWT_EXPIRE`     | `7d`                           | Token expiration                            |
| `FRONTEND_URL`   | `https://jusas.vercel.app`     | Your Vercel URL (update after first deploy) |
| `API_URL`        | `https://jusas.vercel.app/api` | Your API URL                                |
| `GCASH_NUMBER`   | `0917-XXX-XXXX`                | Your GCash number                           |
| `CONTACT_NUMBER` | `0918-XXX-XXXX`                | Business contact                            |
| `BUSINESS_NAME`  | `JUSAS Tropical Smoothies`     | Business name                               |

**To generate JWT_SECRET:**

```bash
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

#### 2.4 Deploy

Click **"Deploy"** and wait for build to complete (~2-5 minutes)

---

### Option B: Vercel CLI

#### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 2.2 Login

```bash
vercel login
```

Follow prompts to authenticate

#### 2.3 Deploy to Preview

```bash
vercel
```

This creates a preview deployment for testing

#### 2.4 Deploy to Production

```bash
vercel --prod
```

#### 2.5 Add Environment Variables via CLI

```bash
# Add each variable
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
# ... repeat for all variables
```

---

## Step 3: Set Up Vercel Postgres Database

### 3.1 Create Database

1. In Vercel dashboard, go to your project
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Choose region (same as deployment for best performance)
6. Database name: `jusas-database`
7. Click **"Create"**

### 3.2 Connect Database to Project

1. Click **"Connect to Project"**
2. Select your **Jusas** project
3. Vercel will automatically add `DATABASE_URL` and `DIRECT_URL` to environment variables

### 3.3 Run Database Migrations

After database is connected, run migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
cd backend
npx prisma migrate deploy
npx prisma db seed
```

**Or via Vercel dashboard:**

1. Go to **Settings** → **Functions**
2. Create a one-time serverless function to run migrations
3. Or use Vercel's built-in database migration feature

---

## Step 4: Verify Deployment

### 4.1 Check Deployment Status

1. Go to Vercel dashboard → **Deployments**
2. Click on latest deployment
3. Check **Build Logs** for any errors

### 4.2 Test Endpoints

**Homepage:**

```bash
curl https://jusas.vercel.app
```

**API Health Check:**

```bash
curl https://jusas.vercel.app/api
```

Should return: `{"message": "Jusas Tropical Smoothie API is running 🌴"}`

**Products Endpoint:**

```bash
curl https://jusas.vercel.app/api/products
```

### 4.3 Manual Testing Checklist

Open `https://jusas.vercel.app` and test:

**Customer Flow:**

- [ ] Homepage loads with correct styling
- [ ] Products display correctly
- [ ] User registration works
- [ ] User login works
- [ ] Add to cart (requires login)
- [ ] Checkout process
- [ ] Order placement (GCash/COD)

**Admin Flow:**

- [ ] Admin login (`admin@smoothie.local` / `Admin123!`)
- [ ] Dashboard displays
- [ ] Product management (CRUD)
- [ ] Order management
- [ ] Analytics display

---

## Step 5: Set Up CI/CD (Automatic Deployments)

### 5.1 Connect GitHub to Vercel

This should be automatic if you imported via GitHub, but verify:

1. Go to **Project Settings** → **Git**
2. Confirm GitHub repository is connected
3. Check **Production Branch** is set to `main`

### 5.2 Configure Auto-Deploy

Under **Git** settings:

- ✅ **Auto-deploy:** Enabled
- ✅ **Deploy on Push:** main branch
- ✅ **Deploy Preview:** Pull requests

### 5.3 Test Auto-Deploy

Make a small change and push:

```bash
# Make a minor change to README
echo "Deployed at $(date)" >> README.md
git add README.md
git commit -m "Test auto-deploy"
git push origin main
```

Watch Vercel dashboard for automatic deployment

---

## Step 6: Post-Deployment Configuration

### 6.1 Set Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### 6.2 Update README with Live URL

```bash
# Edit README.md to update the Live Demo section
# Replace placeholder URLs with actual deployment URL
```

### 6.3 Configure Monitoring

1. Go to **Analytics** tab
2. Enable **Web Analytics**
3. Enable **Speed Insights**

---

## Troubleshooting

### Build Fails

- Check **Build Logs** in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `vercel-build` scripts exist

### Database Connection Errors

- Verify `DATABASE_URL` is set in environment variables
- Check database region matches deployment region
- Run `npx prisma generate` in build command

### CORS Errors

- Verify `FRONTEND_URL` environment variable
- Check backend CORS configuration uses env var

### 404 on API Routes

- Verify `vercel.json` routes configuration
- Check backend is building successfully
- Ensure `api/index.js` exports app correctly

---

## Success Criteria

✅ GitHub repository has all code
✅ Vercel deployment successful
✅ Database connected and seeded
✅ Homepage loads at `https://jusas.vercel.app`
✅ API responds at `https://jusas.vercel.app/api`
✅ User registration/login works
✅ Admin dashboard accessible
✅ Auto-deploy on push works

---

## Next Steps After Deployment

1. **Update live URLs** in README.md
2. **Create demo video** showcasing features
3. **Monitor analytics** for errors
4. **Set up error tracking** (e.g., Sentry)
5. **Configure uptime monitoring** (e.g., UptimeRobot)

---

## Support Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs <deployment-url>

# Rollback to previous deployment
vercel rollback

# Re-deploy with force rebuild
vercel --prod --force
```
