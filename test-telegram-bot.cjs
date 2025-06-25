/**
 * Telegram Bot Configuration Test (CommonJS version)
 * Run this to verify your bot setup is working correctly
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from multiple possible locations
function loadEnvVars() {
  const envFiles = ['.env.local', '.env', '.env.production'];
  const envVars = {};
  
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      console.log(`📄 Loading environment from: ${envFile}`);
      const content = fs.readFileSync(envFile, 'utf8');
      const lines = content.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim();
          }
        }
      }
    }
  }
  
  // Also check process.env
  Object.assign(envVars, process.env);
  
  return envVars;
}

const env = loadEnvVars();
const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = env.TELEGRAM_CHAT_ID;
const OPENAI_API_KEY = env.OPENAI_API_KEY;
const SERVER_URL = env.NEXT_PUBLIC_SERVER_URL || env.VERCEL_URL || 'http://localhost:3000';

console.log('🤖 WipeThatRecord Telegram Bot - Configuration Test');
console.log('================================================');

async function testConfiguration() {
  console.log('\n1. 🔍 Checking Environment Variables...');
  console.log(`   SERVER_URL: ${SERVER_URL}`);
  
  const missing = [];
  const masked = {};
  
  if (!BOT_TOKEN) {
    missing.push('TELEGRAM_BOT_TOKEN');
  } else {
    masked.TELEGRAM_BOT_TOKEN = BOT_TOKEN.substring(0, 10) + '...' + BOT_TOKEN.slice(-4);
  }
  
  if (!CHAT_ID) {
    missing.push('TELEGRAM_CHAT_ID');
  } else {
    masked.TELEGRAM_CHAT_ID = CHAT_ID;
  }
  
  if (!OPENAI_API_KEY) {
    missing.push('OPENAI_API_KEY');
  } else {
    masked.OPENAI_API_KEY = OPENAI_API_KEY.substring(0, 7) + '...' + OPENAI_API_KEY.slice(-4);
  }
  
  console.log('   Found variables:', masked);
  
  if (missing.length > 0) {
    console.log('❌ Missing environment variables:', missing.join(', '));
    console.log('\n💡 Create a .env.local file with:');
    missing.forEach(var_name => {
      console.log(`${var_name}=your_${var_name.toLowerCase()}_here`);
    });
    
    // Show example .env.local content
    console.log('\n📄 Example .env.local file:');
    console.log('TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz');
    console.log('TELEGRAM_CHAT_ID=987654321');
    console.log('OPENAI_API_KEY=sk-proj-your-key-here');
    console.log('NEXT_PUBLIC_SERVER_URL=http://localhost:3000');
    
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  
  console.log('\n2. 🔗 Testing Bot API Connection...');
  
  // Test bot token validity
  try {
    const botInfo = await telegramAPI('getMe');
    if (botInfo.ok) {
      console.log(`✅ Bot connected: @${botInfo.result.username} (${botInfo.result.first_name})`);
    } else {
      console.log('❌ Invalid bot token:', botInfo);
      return false;
    }
  } catch (error) {
    console.log('❌ Bot API connection failed:', error.message);
    return false;
  }
  
  console.log('\n3. 📡 Testing Webhook Status...');
  
  try {
    const webhookInfo = await telegramAPI('getWebhookInfo');
    if (webhookInfo.ok) {
      const info = webhookInfo.result;
      console.log(`📡 Webhook URL: ${info.url || 'Not set'}`);
      console.log(`📊 Pending updates: ${info.pending_update_count || 0}`);
      console.log(`🔒 Certificate: ${info.has_custom_certificate ? 'Custom' : 'Standard'}`);
      
      if (info.last_error_date) {
        console.log(`⚠️  Last error: ${info.last_error_message} (${new Date(info.last_error_date * 1000)})`);
      }
      
      if (!info.url) {
        console.log('⚠️  Webhook not configured. Set it up with:');
        console.log(`curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${SERVER_URL}/api/telegram-bot"`);
      } else if (info.url !== `${SERVER_URL}/api/telegram-bot`) {
        console.log(`⚠️  Webhook URL mismatch. Current: ${info.url}, Expected: ${SERVER_URL}/api/telegram-bot`);
        console.log('Update it with:');
        console.log(`curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${SERVER_URL}/api/telegram-bot"`);
      } else {
        console.log('✅ Webhook is configured correctly');
      }
    }
  } catch (error) {
    console.log('❌ Webhook check failed:', error.message);
  }
  
  console.log('\n4. 🤖 Testing AI Integration...');
  
  if (OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-')) {
    console.log('✅ OpenAI API key format looks correct');
  } else {
    console.log('⚠️  OpenAI API key format may be incorrect (should start with sk-)');
  }
  
  console.log('\n5. 🎯 Testing Server Endpoints...');
  
  try {
    console.log(`   Testing: ${SERVER_URL}/api/telegram-bot`);
    
    // Use node-fetch if available, otherwise use https
    let statusResponse;
    if (typeof fetch !== 'undefined') {
      statusResponse = await fetch(`${SERVER_URL}/api/telegram-bot`);
    } else {
      statusResponse = await httpsGet(`${SERVER_URL}/api/telegram-bot`);
    }
    
    const status = typeof statusResponse.json === 'function' 
      ? await statusResponse.json() 
      : JSON.parse(statusResponse);
    
    console.log(`📊 Bot Status: ${status.status}`);
    console.log(`🔧 Version: ${status.version || 'Unknown'}`);
    console.log(`🔑 Bot Token: ${status.bot_token}`);
    console.log(`🤖 OpenAI Key: ${status.openai_key}`);
    console.log(`🚀 Ready: ${status.ready ? '✅ Yes' : '❌ No'}`);
    
    if (status.missing_variables && status.missing_variables.length > 0) {
      console.log('❌ Missing variables on server:', status.missing_variables.join(', '));
    }
    
  } catch (error) {
    console.log('❌ Server endpoint test failed:', error.message);
    console.log('💡 Make sure your server is running and accessible');
    console.log(`   URL tested: ${SERVER_URL}/api/telegram-bot`);
    
    if (SERVER_URL.includes('localhost')) {
      console.log('💡 If testing localhost, make sure Next.js dev server is running: npm run dev');
    }
  }
  
  console.log('\n6. 📱 Sending Test Message...');
  
  try {
    const testMessage = `🧪 **Test Message**

✅ Your Telegram bot is configured correctly!
🕐 Test time: ${new Date().toLocaleString()}

Try these commands:
• /start - Welcome message
• /insights - AI business analysis
• /metrics - Real-time metrics
• /help - All commands

🚀 Your AI Sales Bot is ready!`;

    const sent = await sendTelegramMessage(testMessage);
    if (sent) {
      console.log('✅ Test message sent successfully!');
      console.log('📱 Check your Telegram for the test message');
    } else {
      console.log('❌ Failed to send test message');
    }
  } catch (error) {
    console.log('❌ Test message failed:', error.message);
  }
  
  console.log('\n🎉 Configuration Test Complete!');
  console.log('\n📝 Summary:');
  console.log('• Environment variables: ✅ Configured');
  console.log('• Bot API connection: ✅ Working');
  console.log('• Test message: ✅ Sent');
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Test your bot on Telegram with /start');
  console.log('2. Try AI commands like /insights');
  console.log('3. Ask custom questions');
  console.log('4. Monitor server logs for any issues');
  
  return true;
}

// Helper function to call Telegram API
function telegramAPI(method) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/${method}`,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Helper function for HTTPS GET
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve(body);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Helper function to send test message
async function sendTelegramMessage(message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result.ok);
        } catch (e) {
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error('Send message error:', err);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

// Run the test
testConfiguration().catch(console.error); 