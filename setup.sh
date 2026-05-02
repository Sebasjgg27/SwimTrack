#!/bin/bash

# SwimTrack Setup Script
# Run this script to set up the development environment

echo "🟦 SwimTrack Setup"
echo "=================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "   Please install Node.js from https://nodejs.org/"
    echo "   Or use Homebrew: brew install node"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check for .env.local
if [ ! -f .env.local ]; then
    echo ""
    echo "⚠️  No .env.local file found."
    echo "   Please create it with your Supabase credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "   See .env.example for the template."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your Supabase project and run supabase/schema.sql"
echo "2. Update .env.local with your Supabase credentials"
echo "3. Run: npm run dev"
echo "4. Open http://localhost:3000"