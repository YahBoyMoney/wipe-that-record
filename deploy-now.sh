#!/bin/bash

echo "🚀 Manual Vercel Deployment Script"
echo "=================================="
echo ""
echo "This will deploy your admin panel directly to Vercel"
echo ""

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔐 Using existing Vercel project configuration..."
echo "Project ID: prj_rSUW9j5Pl9g04g82zJxDDVDEZlRK"
echo "Org ID: team_KZeOOSj4LXdFqVUeEdm7SmFE"
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building project..."
npm run build

echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📍 Your admin panel should be available at:"
echo "  https://wipe-that-record-yahboymoneys-projects.vercel.app/admin-panel"
echo ""
echo "🔍 Test URLs:"
echo "  Admin Panel: https://wipe-that-record-yahboymoneys-projects.vercel.app/admin-panel"
echo "  API Stats: https://wipe-that-record-yahboymoneys-projects.vercel.app/api/admin/stats"
echo "  Test Page: https://wipe-that-record-yahboymoneys-projects.vercel.app/test-deploy"
echo ""