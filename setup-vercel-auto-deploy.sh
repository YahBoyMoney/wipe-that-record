#!/bin/bash

echo "🚀 Vercel Auto-Deploy Setup Script"
echo "=================================="
echo ""
echo "This script will help you set up automatic deployment to Vercel"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "📝 Step 1: Login to Vercel"
echo "-------------------------"
vercel login

echo ""
echo "🔗 Step 2: Link your project"
echo "----------------------------"
vercel link

echo ""
echo "🔑 Step 3: Get your tokens"
echo "--------------------------"
echo "Run these commands to get your tokens:"
echo ""
echo "1. Get your Vercel Token:"
echo "   Go to: https://vercel.com/account/tokens"
echo "   Create a new token and save it"
echo ""
echo "2. Get your Org ID and Project ID:"
echo "   Run: cat .vercel/project.json"
echo ""

# Check if .vercel/project.json exists
if [ -f ".vercel/project.json" ]; then
    echo "Your IDs:"
    cat .vercel/project.json
    echo ""
fi

echo "📋 Step 4: Add secrets to GitHub"
echo "--------------------------------"
echo "Go to: https://github.com/YahBoyMoney/wipe-that-record/settings/secrets/actions"
echo ""
echo "Add these secrets:"
echo "  - VERCEL_TOKEN (from step 3.1)"
echo "  - VERCEL_ORG_ID (from step 3.2)"
echo "  - VERCEL_PROJECT_ID (from step 3.2)"
echo ""

echo "🎯 Step 5: Test deployment"
echo "-------------------------"
echo "Run: vercel --prod"
echo ""

echo "✅ Setup complete!"
echo ""
echo "Your admin panel will be available at:"
echo "https://wipe-that-record-yahboymoneys-projects.vercel.app/admin-panel"