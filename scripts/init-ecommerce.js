import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up environment
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function setupEcommerceSystem() {
  console.log('🚀 Setting up WipeThatRecord E-Commerce System...');
  console.log('⏳ This may take a few moments...\n');
  
  try {
    // Check environment variables
    console.log('🔍 Checking environment configuration...');
    
    const requiredEnvVars = [
      'DATABASE_URI',
      'PAYLOAD_SECRET',
      'NEXT_PUBLIC_SERVER_URL'
    ];
    
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:');
      missing.forEach(envVar => console.error(`   • ${envVar}`));
      console.error('\nPlease check your .env.local file and ensure all required variables are set.');
      console.error('\n📝 Required environment variables:');
      console.error('DATABASE_URI=mongodb://localhost:27017/wipethatrecord');
      console.error('PAYLOAD_SECRET=your-secure-secret-key-here');
      console.error('NEXT_PUBLIC_SERVER_URL=http://localhost:3000');
      console.error('\n💡 Optional for enhanced features:');
      console.error('TELEGRAM_BOT_TOKEN=your-bot-token-here');
      console.error('TELEGRAM_CHAT_ID=your-chat-id-here');
      console.error('OPENAI_API_KEY=your-openai-api-key-here');
      console.error('STRIPE_SECRET_KEY=your-stripe-secret-key-here');
      process.exit(1);
    }
    
    console.log('✅ Environment configuration looks good!\n');
    
    // Import and run initialization (using dynamic import for ES modules)
    console.log('📦 Initializing database collections...');
    const { initializeSampleData } = await import('../src/lib/init-sample-data.js');
    
    await initializeSampleData();
    
    console.log('\n🎉 WipeThatRecord E-Commerce System Setup Complete!');
    console.log('');
    console.log('🔗 Quick Links:');
    console.log(`   • Admin Dashboard: ${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin`);
    console.log(`   • Enhanced Dashboard: ${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin (after login)`);
    console.log(`   • API Health Check: ${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/dashboard-metrics`);
    console.log('');
    console.log('📊 Your system now includes:');
    console.log('   • ✅ Products Collection (5 California expungement services)');
    console.log('   • ✅ Orders Collection (3 sample orders with different statuses)');
    console.log('   • ✅ Analytics Collection (5 sample events for business intelligence)');
    console.log('   • ✅ Enhanced Admin Dashboard (real-time metrics)');
    console.log('   • ✅ Dashboard Metrics API (for external integrations)');
    console.log('');
    console.log('🤖 Telegram Bot Integration:');
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      console.log('   • ✅ Bot configured and ready for real-time business intelligence');
      console.log('   • ✅ Real-time sales, inventory, and customer analytics');
      console.log('   • ✅ Business intelligence and automated alerts');
    } else {
      console.log('   • ⚠️ Bot not configured (add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID)');
      console.log('   • ℹ️ Still functional without bot - use dashboard for metrics');
    }
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('   1. Start your development server: npm run dev');
    console.log('   2. Visit /admin to explore your e-commerce dashboard');
    console.log('   3. Test your services and place sample orders');
    console.log('   4. Configure your Telegram bot for business intelligence');
    console.log('   5. Customize products and services for your business');
    console.log('');
    console.log('💡 Pro Tips:');
    console.log('   • Use /admin/collections/products to manage your services');
    console.log('   • Monitor real-time metrics in the enhanced dashboard');
    console.log('   • Check /admin/collections/analytics for business insights');
    console.log('   • Visit /admin/collections/orders to manage customer orders');
    console.log('   • Your system is ready for production customization!');
    console.log('');
    console.log('🔧 System Features Ready:');
    console.log('   • ✅ Product Management (services, pricing, inventory)');
    console.log('   • ✅ Order Processing (payments, status tracking, fulfillment)');
    console.log('   • ✅ Customer Management (leads, analytics, communication)');
    console.log('   • ✅ Business Intelligence (real-time metrics, alerts)');
    console.log('   • ✅ Payment Processing (Stripe ready)');
    console.log('   • ✅ Email Automation (sequences, notifications)');
    console.log('   • ✅ Analytics Tracking (events, conversions, revenue)');
    console.log('');
    console.log('📈 California Expungement Services Ready:');
    console.log('   • DIY Expungement Kit ($97) - Digital download');
    console.log('   • Expert Document Review ($197) - Attorney service');
    console.log('   • Full Service Expungement ($1,497) - Complete handling');
    console.log('   • Legal Consultation ($147) - 30-minute expert advice');
    console.log('   • Rush Processing ($297) - 7-day expedited service');
    
  } catch (error) {
    console.error('\n❌ Setup failed with error:');
    console.error(error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   • Ensure your database is running and accessible');
    console.error('   • Check that all environment variables are set correctly');
    console.error('   • Verify your PAYLOAD_SECRET is set');
    console.error('   • Make sure DATABASE_URI points to a valid MongoDB instance');
    console.error('   • Try: mongod (to start MongoDB)');
    console.error('   • Try: npm install (to ensure dependencies)');
    console.error('\n📞 Common Solutions:');
    console.error('   • MongoDB not running: sudo service mongod start');
    console.error('   • Permission issues: sudo chown -R $USER:$USER ~/.npm');
    console.error('   • Port conflicts: kill -9 $(lsof -ti:3000)');
    console.error('   • Missing dependencies: rm -rf node_modules && npm install');
    console.error('\n📚 Need help? Check the documentation or contact support.');
    process.exit(1);
  }
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n⏹️ Setup interrupted by user. Exiting...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️ Setup terminated. Exiting...');
  process.exit(0);
});

// Run setup
setupEcommerceSystem(); 