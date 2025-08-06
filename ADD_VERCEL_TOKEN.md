# ✅ Add Vercel Token to GitHub - Fixed Instructions

## Step 1: Create Vercel Token
1. Go to: https://vercel.com/account/tokens
2. Click **"Create Token"**
3. **Name it:** `vercel-deploy` (NOT "GitHub Actions" - GitHub blocks that)
4. Copy the token immediately (you won't see it again)

## Step 2: Add to GitHub Secrets

Go to: https://github.com/YahBoyMoney/wipe-that-record/settings/secrets/actions/new

### Add Secret 1:
- **Name:** `VERCEL_TOKEN`
- **Secret:** [paste your Vercel token]
- Click "Add secret"

### Add Secret 2:
- **Name:** `VERCEL_ORG_ID`
- **Secret:** `team_KZeOOSj4LXdFqVUeEdm7SmFE`
- Click "Add secret"

### Add Secret 3:
- **Name:** `VERCEL_PROJECT_ID`
- **Secret:** `prj_rSUW9j5Pl9g04g82zJxDDVDEZlRK`
- Click "Add secret"

## Step 3: Re-run the Workflow
1. Go to: https://github.com/YahBoyMoney/wipe-that-record/actions
2. Click on the latest workflow run
3. Click **"Re-run all jobs"**

## ✅ That's it!

Your admin panel will deploy automatically to:
https://wipe-that-record-yahboymoneys-projects.vercel.app/admin-panel

## Alternative Token Names (if needed):
- `vercel-deploy`
- `deployment-token`
- `ci-token`
- `automation-token`
- `vercel-api`

Just avoid using "github" in the name!