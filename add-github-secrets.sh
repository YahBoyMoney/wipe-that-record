#!/bin/bash

echo "🔐 GitHub Secrets Setup for Vercel Auto-Deploy"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Project details
REPO_OWNER="YahBoyMoney"
REPO_NAME="wipe-that-record"
ORG_ID="team_KZeOOSj4LXdFqVUeEdm7SmFE"
PROJECT_ID="prj_rSUW9j5Pl9g04g82zJxDDVDEZlRK"

echo -e "${YELLOW}📋 Step 1: Get your GitHub Personal Access Token${NC}"
echo "1. Go to: https://github.com/settings/tokens/new"
echo "2. Name: 'Vercel Secrets Setup'"
echo "3. Select scopes: 'repo' (all repo permissions)"
echo "4. Click 'Generate token' and copy it"
echo ""
read -p "Paste your GitHub token here: " GITHUB_TOKEN

echo ""
echo -e "${YELLOW}📋 Step 2: Get your Vercel Token${NC}"
echo "1. Go to: https://vercel.com/account/tokens"
echo "2. Click 'Create Token'"
echo "3. Name it: 'GitHub Actions'"
echo "4. Copy the token"
echo ""
read -p "Paste your Vercel token here: " VERCEL_TOKEN

echo ""
echo -e "${GREEN}🚀 Adding secrets to GitHub...${NC}"

# Function to add secret
add_secret() {
    SECRET_NAME=$1
    SECRET_VALUE=$2
    
    echo -n "Adding $SECRET_NAME... "
    
    # Get public key
    KEY_DATA=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/public-key")
    
    KEY_ID=$(echo $KEY_DATA | python3 -c "import sys, json; print(json.load(sys.stdin)['key_id'])")
    PUBLIC_KEY=$(echo $KEY_DATA | python3 -c "import sys, json; print(json.load(sys.stdin)['key'])")
    
    # Encrypt secret
    ENCRYPTED=$(python3 -c "
import base64
from nacl import encoding, public

public_key = public.PublicKey('$PUBLIC_KEY', encoding.Base64Encoder())
sealed_box = public.SealedBox(public_key)
encrypted = sealed_box.encrypt('$SECRET_VALUE'.encode('utf-8'))
print(base64.b64encode(encrypted).decode('utf-8'))
" 2>/dev/null)
    
    if [ -z "$ENCRYPTED" ]; then
        # Fallback method using Node.js if Python nacl is not available
        ENCRYPTED=$(node -e "
        const sodium = require('tweetnacl');
        const sealedbox = require('tweetnacl-sealedbox-js');
        
        const publicKey = Buffer.from('$PUBLIC_KEY', 'base64');
        const secretValue = Buffer.from('$SECRET_VALUE');
        const encrypted = sealedbox.seal(secretValue, publicKey);
        console.log(Buffer.from(encrypted).toString('base64'));
        " 2>/dev/null)
    fi
    
    # Add secret
    curl -s -X PUT \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/$SECRET_NAME" \
        -d "{\"encrypted_value\":\"$ENCRYPTED\",\"key_id\":\"$KEY_ID\"}" > /dev/null
    
    echo -e "${GREEN}✓${NC}"
}

# Add secrets
add_secret "VERCEL_TOKEN" "$VERCEL_TOKEN"
add_secret "VERCEL_ORG_ID" "$ORG_ID"
add_secret "VERCEL_PROJECT_ID" "$PROJECT_ID"

echo ""
echo -e "${GREEN}✅ Secrets added successfully!${NC}"
echo ""
echo -e "${YELLOW}🎯 Step 3: Trigger deployment${NC}"
echo "Run this command to test auto-deploy:"
echo ""
echo "  echo '# Auto-deploy test' >> README.md && git add README.md && git commit -m 'Test auto-deploy' && git push"
echo ""
echo -e "${GREEN}📍 Your admin panel will be available at:${NC}"
echo "  https://wipe-that-record-yahboymoneys-projects.vercel.app/admin-panel"
echo ""