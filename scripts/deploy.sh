#!/bin/bash

echo "🚀 JUSAS Deployment Script"
echo "=========================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel if not already
echo "Checking Vercel login..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel..."
    vercel login
fi

# Build the project
echo "Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Deploy to preview
echo "Deploying to preview environment..."
vercel

# Ask about production deployment
read -p "Deploy to production? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Deploying to production..."
    vercel --prod
fi

echo ""
echo "✅ Deployment complete!"
echo "Check Vercel dashboard for deployment status."
