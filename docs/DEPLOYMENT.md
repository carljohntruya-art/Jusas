# JUSAS Deployment Guide

## Overview

This document outlines the deployment process for the JUSAS Tropical Smoothie E-commerce application.

## Prerequisites

- Node.js 18+ installed
- Git installed
- Vercel account
- GitHub account

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/carljohntruya-art/Jusas.git
cd Jusas
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend and backend dependencies
npm run install:all
```

### 3. Environment Setup

```bash
# Copy example environment files
cp backend/.env.example backend/.env.local
cp frontend/.env.example frontend/.env.local

# Edit environment variables
# Backend: Update DATABASE_URL, JWT_SECRET, etc.
# Frontend: Update VITE_API_URL, etc.
```

### 4. Database Setup

```bash
# Navigate to backend
cd backend

# Run database migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Return to root
cd ..
```

### 5. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

## Production Deployment

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

### Environment Variables in Production

Set these in Vercel dashboard:

- DATABASE_URL
- JWT_SECRET
- FRONTEND_URL
- API_URL

## Database Migration for Production

```bash
npx prisma migrate deploy
npx prisma db seed
```

## Troubleshooting

- Build errors: Check Node.js version (requires 18+)
- Database connection: Verify DATABASE_URL format
- CORS issues: Check FRONTEND_URL matches deployed URL
