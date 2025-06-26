const http = require('http');

const endpoints = [
  'http://localhost:3000',
  'http://localhost:3000/admin',
  'http://localhost:3000/admin-dashboard',
  'http://localhost:3000/api/dashboard-metrics',
];

function checkEndpoint(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve({ url, status: res.statusCode, success: res.statusCode < 400 });
    });
    
    req.on('error', (err) => {
      resolve({ url, status: 'ERROR', success: false, error: err.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ url, status: 'TIMEOUT', success: false });
    });
  });
}

async function checkAllEndpoints() {
  console.log('🔍 Checking WipeThatRecord Admin Panel Status...\n');
  
  for (const endpoint of endpoints) {
    const result = await checkEndpoint(endpoint);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.url} - ${result.status}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }
  
  console.log('\n📋 Access Points:');
  console.log('   • Main Site: http://localhost:3000');
  console.log('   • Admin Panel: http://localhost:3000/admin');
  console.log('   • Enhanced Dashboard: http://localhost:3000/admin-dashboard');
  console.log('   • API Dashboard Metrics: http://localhost:3000/api/dashboard-metrics');
}

checkAllEndpoints().catch(console.error); 