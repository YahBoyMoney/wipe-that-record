# Enable Automatic Deployment on Vercel

## Quick Setup (2 minutes)

### Step 1: Connect GitHub to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `wipe-that-record`

2. **Connect GitHub Repository**
   - Go to **Settings** → **Git**
   - Click **Connect Git Repository**
   - Select: `YahBoyMoney/wipe-that-record`
   - Choose branch: `main`

### Step 2: Enable Auto-Deploy

In Vercel Project Settings:

1. **Settings** → **Git**
2. Enable **"Automatically deploy from branches"**
3. Set Production Branch: `main`
4. Enable **"Auto-deploy on push"** ✅

### Step 3: Configure Build Settings

1. **Settings** → **General**
2. Set Build Command: `npm run build`
3. Set Output Directory: `.next`
4. Install Command: `npm install`

### Step 4: Environment Variables

Make sure these are set in **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### Step 5: Trigger Deployment

Option A - From Vercel:
1. Click **Deployments** tab
2. Click **Redeploy** on latest commit
3. Select **Use existing build cache**: No

Option B - From GitHub:
1. Make any small change
2. Push to main branch
3. Vercel will auto-deploy

## Verify Auto-Deploy is Working

1. Check Vercel Dashboard for build status
2. Look for webhook in GitHub:
   - Go to: https://github.com/YahBoyMoney/wipe-that-record/settings/hooks
   - You should see a Vercel webhook

## If Auto-Deploy Isn't Working

### Fix 1: Re-connect Repository
```bash
# In Vercel Dashboard
Settings → Git → Disconnect
Then reconnect the repository
```

### Fix 2: Check GitHub Permissions
- Ensure Vercel app has access to your repository
- Go to: https://github.com/settings/installations
- Find Vercel and check permissions

### Fix 3: Manual Trigger
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Test Your Admin Panel

Once deployed, visit:
- Admin Panel: https://wipe-that-record-yahboymoneys-projects.vercel.app/admin-panel
- Test Page: https://wipe-that-record-yahboymoneys-projects.vercel.app/test-deploy
- API: https://wipe-that-record-yahboymoneys-projects.vercel.app/api/admin/stats

## Current Status
- ✅ Code pushed to GitHub
- ✅ Build errors fixed
- ⏳ Waiting for auto-deploy setup
- 📍 Admin panel ready at `/admin-panel`