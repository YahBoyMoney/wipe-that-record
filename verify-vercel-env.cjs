const https = require('https');

console.log('🔍 VERIFYING VERCEL ENVIRONMENT VARIABLES');
console.log('='.repeat(60));

// Test the bot status endpoint
function testBotStatus() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'wipe-that-record-16rrf66qy-yahboymoneys-projects.vercel.app',
      path: '/api/bot-status',
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
          headers: res.headers
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Test a simple API endpoint
function testSimpleAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'wipe-that-record-16rrf66qy-yahboymoneys-projects.vercel.app',
      path: '/api/test-db',
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function verifyEnvironment() {
  console.log('🧪 Testing production endpoints...\n');
  
  try {
    console.log('1️⃣ Testing /api/bot-status endpoint...');
    const botCheck = await testBotStatus();
    console.log(`Status: ${botCheck.statusCode}`);
    
    if (botCheck.statusCode === 200) {
      console.log('✅ Bot status endpoint accessible');
      try {
        const status = JSON.parse(botCheck.body);
        console.log('📊 Environment Status:', status.status);
        console.log('🔧 Missing Variables:', status.missing_variables.length ? status.missing_variables.join(', ') : 'None');
        console.log('🌍 Environment:', status.environment.vercel_env || 'unknown');
        console.log('🤖 Ready for Webhook:', status.ready_for_webhook ? 'YES' : 'NO');
        
        if (status.missing_variables.length > 0) {
          console.log('\n❌ ISSUE IDENTIFIED: Missing environment variables in production!');
          console.log('Missing:', status.missing_variables.join(', '));
        } else {
          console.log('\n✅ All environment variables are set correctly!');
        }
      } catch (e) {
        console.log('Response preview:', botCheck.body.substring(0, 300));
      }
    } else {
      console.log('❌ Bot status endpoint error:', botCheck.statusCode);
      console.log('Response preview:', botCheck.body.substring(0, 200));
    }
    
    console.log('\n2️⃣ Testing /api/test-db endpoint...');
    const dbTest = await testSimpleAPI();
    console.log(`Status: ${dbTest.statusCode}`);
    
    if (dbTest.statusCode === 200) {
      console.log('✅ Database endpoint working');
    } else {
      console.log('❌ Database endpoint error');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🔧 NEXT STEPS TO FIX THE ISSUE:');
  console.log('='.repeat(60));
  console.log('1. Go to: https://vercel.com/dashboard');
  console.log('2. Find your project: "wipe-that-record"');
  console.log('3. Go to: Settings → Environment Variables');
  console.log('4. Check if these variables exist:');
  console.log('   - TELEGRAM_BOT_TOKEN');
  console.log('   - TELEGRAM_CHAT_ID'); 
  console.log('   - TELEGRAM_WEBHOOK_SECRET');
  console.log('   - OPENAI_API_KEY');
  console.log('5. If missing, add them from TELEGRAM_BOT_ENV_VARS.txt');
  console.log('6. Make sure Environment = "Production"');
  console.log('7. After adding ALL variables, click "Redeploy"');
  console.log('\n💡 TIP: Environment variables must be set for "Production" environment!');
}

verifyEnvironment(); 