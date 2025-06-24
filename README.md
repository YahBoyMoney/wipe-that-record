# 🏛️ Wipe That Record - California Expungement Service Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PayloadCMS](https://img.shields.io/badge/PayloadCMS-3.0-blue?style=for-the-badge&logo=payload)](https://payloadcms.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-purple?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **A comprehensive legal services platform helping Californians expunge their criminal records through a streamlined digital experience.**

## 🎯 **Overview**

**Wipe That Record** is a full-stack SaaS application that automates California's criminal record expungement process. Built with modern web technologies, it features a complete business intelligence dashboard, payment processing, and customer relationship management system.

### 🚀 **Live Demo**
- **Frontend**: [Coming Soon - Deployment in Progress]
- **Admin Dashboard**: [Payload CMS Admin Panel]

## ✨ **Key Features**

### 🏢 **Business Features**
- **Multi-Tier Service Model**: $50 DIY → $100 Expert Review → $1500 Full Service
- **Automated Lead Capture**: Smart forms with validation and progress tracking
- **Payment Processing**: Secure Stripe integration with webhook handling
- **Email Automation**: Customer journey email sequences
- **Analytics Dashboard**: Revenue tracking, conversion funnels, and KPIs

### 🔧 **Technical Features**
- **Headless CMS**: PayloadCMS for content management and admin interface
- **Type-Safe**: Full TypeScript implementation across frontend and backend
- **Database**: MongoDB with Mongoose ODM for scalable data management
- **Authentication**: Role-based access control for admin users
- **API Routes**: RESTful endpoints for all business operations
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js 15    │────│   PayloadCMS     │────│   MongoDB       │
│   Frontend       │    │   Admin/API      │    │   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Stripe API    │    │   Email Service  │    │   Analytics     │
│   Payments      │    │   Automation     │    │   Dashboard     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ **Tech Stack**

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom responsive components
- **Forms**: React Hook Form with Zod validation

### **Backend**
- **API**: Next.js API Routes
- **CMS**: PayloadCMS 3.0
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT with role-based access
- **File Storage**: PayloadCMS media handling

### **Integrations**
- **Payments**: Stripe API with webhooks
- **Email**: SMTP integration (configurable provider)
- **Analytics**: Custom dashboard with real-time metrics
- **Deployment**: Vercel-ready configuration

## 📊 **Business Intelligence Dashboard**

The admin dashboard provides comprehensive business insights:

### **📈 Key Metrics**
- **Revenue Tracking**: Daily, monthly, and yearly revenue
- **Conversion Funnel**: Lead → DIY → Review → Full Service
- **Customer Analytics**: AOV, LTV, and retention rates
- **Performance KPIs**: Email delivery rates and engagement

### **🎯 Features**
- Real-time revenue updates
- Lead source attribution
- Conversion rate optimization tools
- Customer journey mapping
- Automated reporting

## 🚀 **Quick Start**

### **Prerequisites**
```bash
Node.js 18+ 
MongoDB Atlas account
Stripe account (test/live keys)
```

### **Installation**
```bash
# Clone the repository
git clone https://github.com/YahBoMoney/wipe-that-record.git
cd wipe-that-record

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB Atlas and Stripe credentials

# Run development server
pnpm dev
```

### **Environment Variables**
Create a `.env.local` file in the root directory with the following variables:

```env
# Database - MongoDB Atlas connection string
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/wipe-that-record

# PayloadCMS - 32+ character secret key for JWT tokens
PAYLOAD_SECRET=your-secure-32-character-secret-key-here

# Application URLs
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Stripe Payment Integration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Email Service (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Marketing Integrations (Optional)
CONVERTKIT_API_KEY=your_convertkit_api_key
MAILCHIMP_API_KEY=your_mailchimp_api_key
ACTIVECAMPAIGN_API_KEY=your_activecampaign_api_key
```

### **Development Workflow**
```bash
# Start development server
pnpm dev

# Run automated tests
node scripts/test/lead-test.js

# Check environment configuration
curl http://localhost:3000/api/env-check

# Access admin panel
# Navigate to: http://localhost:3000/admin
```

### **Testing & Debugging**
```bash
# Test lead creation API
node scripts/test/lead-test.js

# Test specific endpoints
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com"}'

# Debug Payload initialization
curl http://localhost:3000/api/payload/test

# Verify environment variables
curl http://localhost:3000/api/env-check
```

### **Admin Panel Access**
- **URL**: `http://localhost:3000/admin`
- **Features**: Lead management, analytics dashboard, content management
- **Collections**: Users, Leads, Media
- **Dashboard**: Real-time business metrics and conversion tracking

## 🔧 **Development Features**

### **Payload CMS Integration**
- **Collections**: Fully typed TypeScript collections for Leads, Users, Media
- **Admin UI**: Beautiful admin interface at `/admin`
- **API Routes**: RESTful endpoints with automatic fallback to MongoDB
- **Real-time Sync**: Automatic database synchronization

### **Robust Error Handling**
- **Payload Fallback**: Automatic MongoDB fallback if Payload fails
- **Debug Logging**: Comprehensive logging for troubleshooting
- **Environment Validation**: Built-in environment variable checking
- **Graceful Degradation**: System continues operating even with partial failures

### **Automated Testing**
- **API Testing**: Comprehensive endpoint testing with `node scripts/test/lead-test.js`
- **Environment Validation**: Automatic environment variable verification
- **Integration Tests**: Full workflow testing from lead capture to database storage

## 🎨 **Screenshots**

### Landing Page
> Clean, professional interface with clear value proposition and pricing tiers

### Admin Dashboard  
> Comprehensive analytics with revenue tracking and conversion metrics

### Payment Flow
> Seamless Stripe integration with secure checkout experience

## 🔐 **Security Features**

- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **HTTPS Enforcement**: SSL/TLS encryption for all communications
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Protection**: Parameterized queries and ORM usage
- **XSS Prevention**: Content Security Policy and input sanitization
- **Rate Limiting**: API endpoint protection against abuse

## 📈 **Performance Optimization**

- **Static Site Generation**: Pre-rendered pages for optimal performance
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic bundle splitting and lazy loading
- **CDN Integration**: Vercel Edge Network for global distribution
- **Database Indexing**: Optimized MongoDB queries and indexes

## 🧪 **Testing Strategy**

```bash
# Run tests
npm run test

# Test coverage
npm run test:coverage

# End-to-end tests
npm run test:e2e
```

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
# Deploy to Vercel
npm run build
vercel --prod
```

### **Environment Setup**
1. Configure MongoDB Atlas connection
2. Set up Stripe webhook endpoints
3. Configure email service provider
4. Set production environment variables

## 📝 **API Documentation**

### **Core Endpoints**
```typescript
// Lead Management
POST /api/lead              // Create new lead
GET  /api/analytics         // Business analytics
POST /api/checkout/diy      // $50 DIY package
POST /api/checkout/upgrade  // $100/$1500 packages
POST /api/webhook           // Stripe webhook handler
```

### **Admin Endpoints**
```typescript
GET    /admin               // PayloadCMS admin panel
POST   /admin/api/leads     // Lead management
GET    /admin/api/analytics // Dashboard data
```

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 **Awards & Recognition**

- **Legal Tech Innovation**: Streamlining access to justice
- **Full-Stack Excellence**: Modern web development best practices
- **Business Impact**: Helping thousands clear their records

## 📞 **Contact & Support**

- **Business Inquiries**: contact@wipethatrecord.com
- **Technical Support**: support@wipethatrecord.com
- **Developer**: [YahBoMoney](https://github.com/YahBoMoney)

## 🔗 **Links**

- **Website**: [wipethatrecord.com](https://wipethatrecord.com)
- **Documentation**: [docs.wipethatrecord.com](https://docs.wipethatrecord.com)
- **API Reference**: [api.wipethatrecord.com](https://api.wipethatrecord.com)

---

<div align="center">

**⭐ Star this repository if it helped you build something amazing!**

Made with ❤️ for the California legal community

</div>
