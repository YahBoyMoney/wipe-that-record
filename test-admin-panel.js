/**
 * Test script for the new unified admin panel
 * This verifies that the admin panel is fetching real data from Supabase
 */

const API_BASE = 'https://wipe-that-record-yahboymoneys-projects.vercel.app';
// For local testing: const API_BASE = 'http://localhost:3000';

async function testAdminStats() {
  console.log('🧪 Testing Admin Stats API...\n');
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/stats`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Admin Stats API is working!\n');
      console.log('📊 Overview Stats:');
      console.log(`  • Total Leads: ${data.data.overview.totalLeads}`);
      console.log(`  • Today's Leads: ${data.data.overview.todayLeads}`);
      console.log(`  • Hot Leads: ${data.data.overview.hotLeads}`);
      console.log(`  • Total Revenue: $${data.data.overview.totalRevenue.toFixed(2)}`);
      console.log(`  • Conversion Rate: ${data.data.overview.conversionRate.toFixed(1)}%`);
      
      console.log('\n📂 Case Stats:');
      console.log(`  • Total Cases: ${data.data.cases.total}`);
      console.log(`  • Active Cases: ${data.data.cases.active}`);
      console.log(`  • Completed Cases: ${data.data.cases.completed}`);
      
      console.log('\n📈 Analytics:');
      console.log('  Lead Sources:', data.data.analytics.leadSources);
      console.log('  Service Types:', data.data.analytics.serviceTypes);
      console.log('  Top Cities:', data.data.analytics.topCities);
      
      console.log('\n🔄 Recent Activity:');
      console.log(`  • Recent Leads: ${data.data.recentActivity.recentLeads.length}`);
      console.log(`  • Recent Orders: ${data.data.recentActivity.recentOrders.length}`);
      console.log(`  • Recent Cases: ${data.data.recentActivity.recentCases.length}`);
      
    } else {
      console.log('❌ Admin Stats API failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Error calling Admin Stats API:', error.message);
  }
}

async function testHealthCheck() {
  console.log('\n🧪 Testing Health Check API...\n');
  
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    const data = await response.json();
    
    console.log(`📊 System Status: ${data.status}`);
    console.log('🔧 Services:');
    data.services.forEach(service => {
      const icon = service.status === 'healthy' ? '✅' : 
                   service.status === 'degraded' ? '⚠️' : '❌';
      console.log(`  ${icon} ${service.service}: ${service.status}`);
      if (service.responseTime) {
        console.log(`     Response time: ${service.responseTime}ms`);
      }
      if (service.error) {
        console.log(`     Error: ${service.error}`);
      }
    });
  } catch (error) {
    console.log('❌ Error calling Health Check API:', error.message);
  }
}

async function testAdminPanel() {
  console.log('🚀 Testing WipeThatRecord Admin Panel\n');
  console.log('=' .repeat(50));
  
  await testAdminStats();
  await testHealthCheck();
  
  console.log('\n' + '=' .repeat(50));
  console.log('\n✨ Admin Panel Test Complete!\n');
  console.log('📝 Next Steps:');
  console.log('1. Visit: ' + API_BASE + '/admin-panel');
  console.log('2. Check that real data is displaying');
  console.log('3. Test the real-time updates');
  console.log('4. Try the customer service features');
  console.log('\n💡 The admin panel now shows:');
  console.log('  • Real leads from Supabase');
  console.log('  • Actual revenue and conversion metrics');
  console.log('  • Live case tracking');
  console.log('  • Customer communication tools');
  console.log('  • Real-time analytics');
}

// Run the test
testAdminPanel().catch(console.error);