#!/bin/bash

echo "🚀 Quick Vercel Deployment"
echo "========================="
echo ""
echo "Since we can't automatically add GitHub secrets, let's deploy directly to Vercel!"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "📝 Logging in to Vercel..."
echo "Choose 'Continue with GitHub' when prompted"
echo ""
vercel login

echo ""
echo "🚀 Deploying to production..."
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📍 Your admin panel should be available at:"
echo "  https://wipe-that-record-yahboymoneys-projects.vercel.app/admin-panel"
echo ""
echo "🔄 To enable auto-deploy for future pushes:"
echo "  1. Go to: https://vercel.com/yahboymoneys-projects/wipe-that-record/settings/git"
echo "  2. Make sure GitHub integration is connected"
echo "  3. Enable 'Auto-deploy on push'"
echo ""