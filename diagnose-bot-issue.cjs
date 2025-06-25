const https = require('https');

// Bot configuration
const BOT_TOKEN = '7971902459:AAEXaewD3p1obQWU2GvCSBCjQ3XkGgpw9Lo';
const CHAT_ID = '1884717726';
const PRODUCTION_URL = 'https://wipe-that-record-16rrf66qy-yahboymoneys-projects.vercel.app';

console.log('🔍 COMPREHENSIVE BOT DIAGNOSTIC');
console.log('='.repeat(60));

// Test 1: Bot API connectivity
function testBotAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getMe`,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Test 2: Check webhook status
function getWebhookInfo() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getWebhookInfo`,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Test 3: Test webhook endpoint directly
function testWebhookEndpoint() {
  return new Promise((resolve, reject) => {
    const testPayload = JSON.stringify({
      update_id: 999999,
      message: {
        message_id: 999999,
        from: {
          id: parseInt(CHAT_ID),
          is_bot: false,
          first_name: "Test",
          username: "testuser"
        },
        chat: {
          id: parseInt(CHAT_ID),
          first_name: "Test",
          username: "testuser",
          type: "private"
        },
        date: Math.floor(Date.now() / 1000),
        text: "/start"
      }
    });

    const options = {
      hostname: 'wipe-that-record-16rrf66qy-yahboymoneys-projects.vercel.app',
      path: '/api/telegram-bot',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testPayload),
        'X-Telegram-Bot-Api-Secret-Token': 'ab892875674f21776ee41925af3c75126dc29391ccc462ece8c8a9d3fc9821d5'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.write(testPayload);
    req.end();
  });
}

// Test 4: Send a direct message to trigger webhook
function sendTestMessage() {
  return new Promise((resolve, reject) => {
    const message = {
      chat_id: CHAT_ID,
      text: '🔧 Testing bot after environment setup - ' + new Date().toLocaleTimeString()
    };

    const postData = JSON.stringify(message);
    
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Test 5: Check production environment
function checkProductionEndpoint() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'wipe-that-record-16rrf66qy-yahboymoneys-projects.vercel.app',
      path: '/api/env-check',
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

// Run comprehensive diagnostic
async function runDiagnostic() {
  console.log('🔍 Starting comprehensive bot diagnostic...\n');

  try {
    // Test 1: Bot API
    console.log('1️⃣ Testing Bot API Connection...');
    const botInfo = await testBotAPI();
    if (botInfo.ok) {
      console.log('✅ Bot API: Working');
      console.log(`   Bot: @${botInfo.result.username} - ${botInfo.result.first_name}`);
    } else {
      console.log('❌ Bot API: Failed -', botInfo.description);
    }

    // Test 2: Webhook Status
    console.log('\n2️⃣ Checking Webhook Status...');
    const webhookInfo = await getWebhookInfo();
    if (webhookInfo.ok) {
      console.log('✅ Webhook Info Retrieved:');
      console.log(`   URL: ${webhookInfo.result.url}`);
      console.log(`   Pending Updates: ${webhookInfo.result.pending_update_count}`);
      console.log(`   Last Error: ${webhookInfo.result.last_error_message || 'None'}`);
      console.log(`   Last Error Date: ${webhookInfo.result.last_error_date ? new Date(webhookInfo.result.last_error_date * 1000) : 'Never'}`);
      console.log(`   Max Connections: ${webhookInfo.result.max_connections}`);
    } else {
      console.log('❌ Webhook Info: Failed -', webhookInfo.description);
    }

    // Test 3: Production Environment Check
    console.log('\n3️⃣ Testing Production Environment...');
    try {
      const envCheck = await checkProductionEndpoint();
      console.log(`✅ Production Status: ${envCheck.statusCode}`);
      if (envCheck.body) {
        console.log(`   Response: ${envCheck.body.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log('❌ Production Environment: Error -', error.message);
    }

    // Test 4: Direct Webhook Test
    console.log('\n4️⃣ Testing Webhook Endpoint Directly...');
    try {
      const webhookTest = await testWebhookEndpoint();
      console.log(`   Status: ${webhookTest.statusCode} ${webhookTest.statusMessage}`);
      console.log(`   Response: ${webhookTest.body.substring(0, 200)}...`);
      
      if (webhookTest.statusCode === 200) {
        console.log('✅ Webhook Endpoint: Working');
      } else if (webhookTest.statusCode === 401) {
        console.log('❌ Webhook Endpoint: Unauthorized - Environment variables missing');
      } else if (webhookTest.statusCode === 500) {
        console.log('❌ Webhook Endpoint: Server Error - Check deployment logs');
      } else {
        console.log(`❌ Webhook Endpoint: Error ${webhookTest.statusCode}`);
      }
    } catch (error) {
      console.log('❌ Webhook Test: Failed -', error.message);
    }

    // Test 5: Send Test Message
    console.log('\n5️⃣ Sending Test Message...');
    const messageResult = await sendTestMessage();
    if (messageResult.ok) {
      console.log('✅ Test Message: Sent successfully');
      console.log('   Now send "/start" to the bot in Telegram');
    } else {
      console.log('❌ Test Message: Failed -', messageResult.description);
    }

  } catch (error) {
    console.error('❌ Diagnostic Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('='.repeat(60));
  console.log('If webhook endpoint returns 401: Environment variables not set properly');
  console.log('If webhook endpoint returns 500: Check Vercel function logs');
  console.log('If pending updates > 0: Bot is receiving messages but not processing');
  console.log('If no errors but no responses: Check OpenAI API key');
}

runDiagnostic(); 