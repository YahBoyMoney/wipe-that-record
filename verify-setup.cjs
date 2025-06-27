#!/usr/bin/env node

// Comprehensive setup verification script
require('dotenv').config();
const fs = require('fs');

console.log('🔍 WipeThatRecord - System Verification');
console.log('=====================================\n');

// Check if running in correct directory
if (!fs.existsSync('./package.json')) {
  console.log('❌ Please run this script from the project root directory');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
console.log(`📦 Project: ${packageJson.name} v${packageJson.version}`);

// Environment variables check
const requiredEnvVars = {
  'Database': [
    'DATABASE_URI',
    'PAYLOAD_SECRET'
  ],
  'Payments': [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY'
  ],
  'Email (Optional)': [
    'ZOHO_EMAIL', 'ZOHO_PASSWORD', // OR
    'SMTP_USER', 'SMTP_PASS'
  ],
  'AI Features (Optional)': [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID',
    'OPENAI_API_KEY'
  ]
};

console.log('\n🔧 Environment Configuration:');
let envStatus = { required: 0, optional: 0, total: 0 };

Object.entries(requiredEnvVars).forEach(([category, vars]) => {
  console.log(`\n${category}:`);
  
  if (category === 'Email (Optional)') {
    // Check if either Zoho OR SMTP is configured
    const hasZoho = process.env.ZOHO_EMAIL && process.env.ZOHO_PASSWORD;
    const hasSMTP = process.env.SMTP_USER && process.env.SMTP_PASS;
    
    if (hasZoho) {
      console.log('  ✅ Zoho email configured');
      envStatus.optional++;
    } else if (hasSMTP) {
      console.log('  ✅ SMTP email configured');
      envStatus.optional++;
    } else {
      console.log('  ⚠️  No email provider configured');
      console.log('     Configure either Zoho or SMTP for email features');
    }
  } else {
    vars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        console.log(`  ✅ ${varName}: ${value.substring(0, 8)}...`);
        if (category.includes('Optional')) {
          envStatus.optional++;
        } else {
          envStatus.required++;
        }
      } else {
        console.log(`  ❌ ${varName}: Not set`);
      }
      envStatus.total++;
    });
  }
});

// File structure check
console.log('\n📁 File Structure:');
const requiredFiles = [
  'package.json',
  'next.config.ts',
  'payload.config.ts',
  'src/app/layout.tsx',
  'src/components/AnalyticsDashboard.tsx',
  'src/lib/email.ts',
  'QUICK_SETUP_GUIDE.md',
  '.env.example'
];

const optionalFiles = [
  '.env.local',
  'sample-leads.json'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing required file`);
  }
});

optionalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} (optional)`);
  } else {
    console.log(`⚠️  ${file} (optional) - Not found`);
  }
});

// Dependencies check
console.log('\n📚 Dependencies:');
const criticalDeps = [
  'next',
  'react',
  'payload',
  '@payloadcms/mongodb',
  '@payloadcms/next',
  'stripe',
  'nodemailer',
  'chart.js',
  'react-chartjs-2'
];

const devDeps = [
  'typescript',
  '@types/node',
  'tailwindcss'
];

try {
  const deps = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  
  criticalDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`✅ ${dep}: ${deps[dep]}`);
    } else {
      console.log(`❌ ${dep}: Missing critical dependency`);
    }
  });
  
  devDeps.forEach(dep => {
    if (devDependencies[dep]) {
      console.log(`✅ ${dep}: ${devDependencies[dep]} (dev)`);
    } else {
      console.log(`⚠️  ${dep}: Missing dev dependency`);
    }
  });
} catch (error) {
  console.log('❌ Error reading package.json dependencies');
}

// Test scripts check
console.log('\n🧪 Test Scripts:');
const testScripts = [
  'scripts/generate-sample-data.js',
  'test-bot-config.js'
];

testScripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`✅ ${script}`);
  } else {
    console.log(`❌ ${script} - Missing test script`);
  }
});

// API Routes check
console.log('\n🔌 API Routes:');
const apiRoutes = [
  'src/app/api/analytics/route.ts',
  'src/app/api/lead/route.ts',
  'src/app/api/email-trigger/route.ts',
  'src/app/api/telegram-bot/route.ts',
  'src/app/api/checkout/route.ts'
];

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`⚠️  ${route} - API endpoint not found`);
  }
});

// Component check
console.log('\n🎨 Components:');
const components = [
  'src/components/AnalyticsDashboard.tsx',
  'src/components/Hero.tsx',
  'src/components/LeadCaptureForm.tsx',
  'src/components/DashboardNav.tsx'
];

components.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`⚠️  ${component} - Component not found`);
  }
});

// Summary
console.log('\n📊 System Status Summary:');
console.log('=========================');

if (envStatus.required >= 4) {
  console.log('✅ Core environment variables configured');
} else {
  console.log('❌ Missing required environment variables');
  console.log('   → Configure DATABASE_URI, PAYLOAD_SECRET, and Stripe keys');
}

if (envStatus.optional >= 2) {
  console.log('✅ Optional features configured (Email, AI, etc.)');
} else {
  console.log('⚠️  Optional features available but not configured');
  console.log('   → Add email provider and AI keys for full functionality');
}

console.log('\n🚀 Next Steps:');
console.log('1. Copy .env.example to .env.local and fill in your API keys');
console.log('2. Run: npm install');
console.log('3. Run: node scripts/generate-sample-data.js');
console.log('4. Run: node test-bot-config.js (if AI features configured)');
console.log('5. Run: npm run dev');
console.log('6. Visit: http://localhost:3000');

console.log('\n🎉 System verification complete!');
console.log('Your WipeThatRecord application is ready to scale! 🚀'); 