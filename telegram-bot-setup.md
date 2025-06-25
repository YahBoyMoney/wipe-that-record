# 🤖 Telegram AI Sales Bot Setup Guide

## Overview
Your Telegram bot has been **completely fixed and enhanced** with:
- ✅ Proper environment variable handling
- ✅ GPT-4 AI integration for business insights
- ✅ Real-time business metrics from your database
- ✅ Enhanced error handling and logging
- ✅ Security improvements (no hardcoded keys)
- ✅ Better message formatting and user experience

## 📋 Prerequisites

1. **Telegram Account**
2. **OpenAI API Account** (for GPT-4 integration)
3. **Your Next.js app deployed** (Vercel recommended)
4. **Database access** (for real business metrics)

## 🚀 Step-by-Step Setup

### 1. Create Telegram Bot

1. **Message @BotFather on Telegram**
   ```
   /newbot
   ```

2. **Choose bot name and username**
   ```
   Name: WipeThatRecord AI Sales Bot
   Username: @YourBotUsernameBot
   ```

3. **Save your Bot Token** 
   ```
   Example: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

### 2. Get Your Chat ID

**Option A: Use @userinfobot**
1. Message `@userinfobot` on Telegram
2. It will reply with your Chat ID

**Option B: Use your bot**
1. Start your bot with `/start`
2. Check server logs for your Chat ID

### 3. Configure Environment Variables

**Copy the environment template:**
```bash
cp .env.example .env.local
```

**Fill in your actual values:**
```env
# Required for bot functionality
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=987654321

# Required for AI insights
OPENAI_API_KEY=sk-proj-your-openai-key-here

# Your domain (auto-detected on Vercel)
NEXT_PUBLIC_SERVER_URL=https://yourdomain.vercel.app
```

### 4. Deploy Your Changes

**If using Vercel:**
```bash
# Add environment variables to Vercel
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID  
vercel env add OPENAI_API_KEY

# Deploy
vercel --prod
```

**If running locally:**
```bash
npm run dev
```

### 5. Set Up Telegram Webhook

**Replace `<YOUR_BOT_TOKEN>` and `<YOUR_DOMAIN>` with actual values:**

```bash
# Set webhook URL
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_DOMAIN>/api/telegram-bot"

# Example:
curl -X POST "https://api.telegram.org/bot1234567890:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://yourdomain.vercel.app/api/telegram-bot"
```

### 6. Test Your Bot

1. **Check bot status:**
   ```
   Visit: https://yourdomain.vercel.app/api/telegram-bot
   ```

   **Expected response:**
   ```json
   {
     "status": "WipeThatRecord AI Sales Bot",
     "version": "2.0 - Enhanced AI Integration", 
     "bot_token": "✅ configured",
     "openai_key": "✅ configured",
     "ready": true
   }
   ```

2. **Test on Telegram:**
   ```
   /start
   /insights
   /metrics
   ```

## 🎯 Available Commands

Your bot now supports these enhanced commands:

### **Core Commands**
- `/start` - Welcome message and overview
- `/help` - Complete command list
- `/metrics` - Real-time business KPIs

### **AI-Powered Analysis**
- `/insights` - Daily performance analysis with GPT-4
- `/wins` - 5 AI-generated quick wins 
- `/conversion` - AI conversion optimization advice
- `/pricing` - AI pricing strategy recommendations
- `/scale` - AI scaling roadmap to $300K/month

### **Custom Queries**
Just type any question like:
- "How can I increase conversions?"
- "What's my best traffic source?"
- "Should I raise my prices?"
- "How do I get more DUI leads?"

## 🔧 Troubleshooting

### Bot Not Responding?

1. **Check environment variables:**
   ```bash
   # Visit your status endpoint
   https://yourdomain.vercel.app/api/telegram-bot
   ```

2. **Verify webhook is set:**
   ```bash
   curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
   ```

3. **Check Vercel logs:**
   ```bash
   vercel logs
   ```

### Common Issues & Solutions

**❌ "Bot configuration incomplete"**
- Missing TELEGRAM_BOT_TOKEN or OPENAI_API_KEY
- Add them to your environment variables

**❌ "AI advisor temporarily unavailable"**
- OpenAI API key invalid or quota exceeded
- Check your OpenAI account and billing

**❌ "Having trouble getting metrics"**
- Database connection issue
- Check your DATABASE_URI configuration

**❌ Bot responds but no AI insights**
- OpenAI API quota or rate limits
- GPT-4 API access needed (not just GPT-3.5)

## 📊 What's Fixed

### Before (Issues):
- ❌ Hardcoded API keys in code
- ❌ Environment variables not properly handled
- ❌ "undefined/api/ai-advisor" URL errors
- ❌ No proper error handling
- ❌ Basic responses without AI integration

### After (Fixed):
- ✅ Secure environment variable management
- ✅ Proper URL construction with fallbacks
- ✅ Enhanced error handling and logging
- ✅ Full GPT-4 AI integration with real business data
- ✅ Real-time metrics from your database
- ✅ Professional message formatting
- ✅ Long message handling (Telegram 4096 char limit)

## 🚀 Next Steps

1. **Test all commands** to ensure everything works
2. **Monitor logs** for any issues during operation
3. **Customize AI prompts** in `src/lib/ai-sales-bot.ts` if needed
4. **Set up monitoring** for bot uptime

## 💡 Pro Tips

- The bot now uses **real business data** from your database
- **GPT-4 integration** provides intelligent, contextual responses
- **Automatic message splitting** handles long AI responses
- **Enhanced error handling** provides helpful troubleshooting info
- **Security improved** - no more hardcoded secrets

Your Telegram bot should now be **fully functional** with AI-powered business insights! 🎉 