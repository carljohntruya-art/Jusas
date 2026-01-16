#!/bin/bash

echo "🚀 JUSAS Project Setup"
echo "======================"

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Copy environment examples
echo "Setting up environment variables..."
if [ ! -f "backend/.env.local" ]; then
    cp backend/.env.example backend/.env.local
    echo "Created backend/.env.local (edit with your configuration)"
fi

if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.example frontend/.env.local
    echo "Created frontend/.env.local (edit with your configuration)"
fi

# Check if Prisma is installed
echo "Checking Prisma setup..."
if [ ! -f "backend/prisma/schema.prisma" ]; then
    echo "❌ Prisma schema not found"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env.local with your database configuration"
echo "2. Edit frontend/.env.local with your API URL"
echo "3. Run database setup: cd backend && npx prisma migrate dev"
echo "4. Seed database: cd backend && npx prisma db seed"
echo "5. Start development: npm run dev"
echo ""
