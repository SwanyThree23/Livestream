#!/bin/bash

# SwanyThree Ultimate - Quick Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🚀 SwanyThree Ultimate - Quick Setup"
echo "===================================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required. You have $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo "✅ Root dependencies installed"
echo ""

# Setup backend
echo "🔧 Setting up backend..."
cd apps/backend

if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit apps/backend/.env with your credentials"
    echo ""
fi

echo "📦 Installing backend dependencies..."
npm install
echo "✅ Backend setup complete"
echo ""

# Setup frontend
echo "🎨 Setting up frontend..."
cd ../frontend

if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit apps/frontend/.env with your API URL"
    echo ""
fi

echo "📦 Installing frontend dependencies..."
npm install
echo "✅ Frontend setup complete"
echo ""

# Return to root
cd ../..

echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit apps/backend/.env with your credentials:"
echo "   - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY"
echo "   - JWT_SECRET (min 32 characters)"
echo "   - ANTHROPIC_API_KEY"
echo ""
echo "2. Edit apps/frontend/.env with your API URL"
echo ""
echo "3. Setup your Supabase database:"
echo "   - Run apps/backend/schema.sql in Supabase SQL Editor"
echo "   - (Optional) Run apps/backend/seed.sql for test data"
echo ""
echo "4. Start development servers:"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:5173 in your browser"
echo ""
echo "📖 For detailed instructions, see README.md"
echo ""
