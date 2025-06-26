# 🚀 WipeThatRecord E-Commerce System Setup Guide

Complete California expungement services e-commerce platform with real-time business intelligence.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- Git for version control
- Code editor (VS Code recommended)

## 🏗️ System Architecture

Your WipeThatRecord system includes:

- **📦 Products Collection**: Manage expungement services and pricing
- **📋 Orders Collection**: Track customer orders and case progress  
- **📊 Analytics Collection**: Business intelligence and event tracking
- **👥 Leads Collection**: Customer management and lead tracking
- **🎛️ Enhanced Dashboard**: Real-time business metrics
- **🤖 Telegram Bot**: AI-powered business intelligence
- **💳 Payment Processing**: Stripe integration ready
- **📧 Email Automation**: Customer communication sequences

## ⚡ Quick Start (5 Minutes)

### 1. Environment Configuration

Create `.env.local` in your project root:

```bash
# REQUIRED - Core Configuration
DATABASE_URI=mongodb://localhost:27017/wipethatrecord
PAYLOAD_SECRET=your-super-secure-secret-key-32-chars-minimum
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# OPTIONAL - Telegram Bot Business Intelligence  
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
TELEGRAM_CHAT_ID=your-telegram-chat-id-here

# OPTIONAL - AI Insights
OPENAI_API_KEY=sk-your-openai-api-key-here

# OPTIONAL - Payment Processing
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 2. Initialize the System

```bash
# Install dependencies (if not already installed)
npm install

# Initialize your e-commerce system with sample data
node scripts/init-ecommerce.js

# Start the development server
npm run dev
```

### 3. Access Your Dashboard

Visit `http://localhost:3000/admin` and log in with:
- **Email**: `admin@wipethatrecord.com`
- **Password**: (set in your environment)

## 🏆 What You Get Out of the Box

### **📦 California Expungement Services** 
- **DIY Expungement Kit** ($97) - Digital download with forms and instructions
- **Expert Document Review** ($197) - Attorney review and guidance  
- **Full Service Expungement** ($1,497) - Complete legal handling
- **Legal Consultation** ($147) - 30-minute expert advice
- **Rush Processing** ($297) - 7-day expedited service

### **📊 Business Intelligence Dashboard**
- Real-time revenue tracking
- Order status management
- Inventory/capacity monitoring  
- Customer analytics
- Performance alerts
- Top product insights

### **🤖 Telegram Bot Features** (if configured)
- `/sales_today` - Revenue performance vs yesterday
- `/products` - Service inventory and capacity status
- `/orders_pending` - Orders requiring attention
- `/metrics` - Complete business KPI dashboard
- `/insights` - AI-powered business analysis
- `/alerts` - System notifications and warnings
- Natural language queries: "How are sales today?"

## 🔧 Advanced Configuration

### Telegram Bot Setup

1. **Create Bot**: Message `@BotFather` on Telegram
   ```
   /newbot
   Choose a name: WipeThatRecord Business Bot
   Choose username: @YourBusinessBot
   ```

2. **Get Chat ID**: 
   ```bash
   # Send a message to your bot, then visit:
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```

3. **Add to Environment**:
   ```bash
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHI...
   TELEGRAM_CHAT_ID=123456789
   ```

### Stripe Payment Processing

1. **Create Stripe Account**: Visit `https://stripe.com`

2. **Get API Keys**: Dashboard → Developers → API Keys

3. **Add to Environment**:
   ```bash
   STRIPE_SECRET_KEY=sk_test_51ABC...
   STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...
   ```

### OpenAI Business Intelligence

1. **Get API Key**: Visit `https://platform.openai.com`

2. **Add to Environment**:
   ```bash
   OPENAI_API_KEY=sk-1234567890abcdef...
   ```

## 📊 Dashboard Features

### **Overview Tab**
- Revenue metrics with growth indicators
- Order volume tracking
- Product performance analytics
- Customer acquisition metrics
- Real-time alerts and notifications

### **Products Management**  
- Service catalog management
- Pricing and inventory control
- SEO optimization settings
- Performance analytics per service

### **Orders Processing**
- Order status tracking
- Payment processing status
- Case progress management
- Customer communication tools

### **Analytics Intelligence**
- Event tracking and reporting
- Conversion funnel analysis
- Revenue by service category
- Customer behavior insights

## 🚀 Deployment to Production

### Environment Updates
```bash
# Production Database
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/production

# Production Domain
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com

# Production Stripe Keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Security
NODE_ENV=production
PAYLOAD_SECRET=super-secure-64-character-secret-for-production
```

### Deployment Platforms
- **Vercel**: `vercel --prod`
- **Railway**: `railway up`
- **Digital Ocean**: App Platform deployment
- **AWS**: Elastic Beanstalk or Lambda

## 🔍 Troubleshooting

### Common Issues

**❌ Database Connection Failed**
```bash
# Start MongoDB
sudo service mongod start
# or
mongod

# Check connection
mongosh mongodb://localhost:27017/wipethatrecord
```

**❌ Port Already in Use**
```bash
# Kill process on port 3000
kill -9 $(lsof -ti:3000)
```

**❌ Dependencies Issues**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**❌ Telegram Bot Not Responding**
- Verify bot token is correct
- Check chat ID format
- Ensure bot is added to the chat
- Test with `/start` command

### Environment Variable Validation

```bash
# Check required variables are set
echo $DATABASE_URI
echo $PAYLOAD_SECRET
echo $NEXT_PUBLIC_SERVER_URL
```

## 📈 Business Optimization

### Marketing Integration
- **Google Analytics**: Add tracking ID to environment
- **Facebook Pixel**: Configure conversion tracking
- **Email Sequences**: Set up SMTP for automation
- **Lead Magnets**: Configure download funnels

### Service Customization
- **Pricing Strategy**: Adjust based on market analysis
- **Service Packages**: Bundle offerings for higher value
- **Rush Services**: Premium pricing for urgent cases
- **Consultation Funnels**: Use consultations to upsell

### Performance Monitoring
- **Revenue Tracking**: Daily/weekly/monthly trends
- **Conversion Optimization**: Landing page analytics
- **Customer Lifecycle**: From lead to repeat customer
- **Service Capacity**: Attorney/staff resource planning

## 🤝 Support & Community

### Documentation
- **Payload CMS**: https://payloadcms.com/docs
- **Next.js**: https://nextjs.org/docs
- **Stripe**: https://stripe.com/docs
- **Telegram Bot API**: https://core.telegram.org/bots

### Getting Help
- Check console logs for errors
- Review environment variables
- Test database connectivity
- Verify API endpoints
- Monitor dashboard metrics

## 🎯 Success Checklist

- [ ] ✅ Database connected and collections created
- [ ] ✅ Sample products and orders populated
- [ ] ✅ Admin dashboard accessible
- [ ] ✅ Dashboard metrics loading correctly
- [ ] ✅ Telegram bot responding (if configured)
- [ ] ✅ Payment processing ready (if configured)
- [ ] ✅ AI insights working (if configured)
- [ ] ✅ Email system functional (if configured)

## 🚀 Ready to Scale Your California Expungement Business!

Your WipeThatRecord e-commerce system is now fully operational with:

- **Complete service management**
- **Real-time business intelligence** 
- **Automated customer processing**
- **Integrated payment handling**
- **AI-powered insights and alerts**

Start taking orders, track your metrics, and scale your California expungement services business with confidence!

---

**Questions?** Check the troubleshooting section above or review the console logs for specific error messages. 