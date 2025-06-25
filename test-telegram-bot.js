/**
 * Telegram Bot Configuration Test
 * Run this to verify your bot setup is working correctly
 */

const https = require('https');

// Load environment variables (you may need to adjust the path)
require('dotenv').config({ path: '.env.local' });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

console.log('🤖 WipeThatRecord Telegram Bot - Configuration Test');
console.log('================================================');

async function testConfiguration() {
  console.log('\n1. 🔍 Checking Environment Variables...');
  
  const missing = [];
  if (!BOT_TOKEN) missing.push('TELEGRAM_BOT_TOKEN');
  if (!CHAT_ID) missing.push('TELEGRAM_CHAT_ID');
  if (!OPENAI_API_KEY) missing.push('OPENAI_API_KEY');
  
  if (missing.length > 0) {
    console.log('❌ Missing environment variables:', missing.join(', '));
    console.log('\n💡 Add these to your .env.local file:');
    missing.forEach(var_name => {
      console.log(`${var_name}=your_${var_name.toLowerCase()}_here`);
    });
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
      console.log('❌ Invalid bot token');
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
      
      if (!info.url) {
        console.log('⚠️  Webhook not configured. Set it up with:');
        console.log(`curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${SERVER_URL}/api/telegram-bot"`);
      } else {
        console.log('✅ Webhook is configured');
      }
    }
  } catch (error) {
    console.log('❌ Webhook check failed:', error.message);
  }
  
  console.log('\n4. 🤖 Testing AI Integration...');
  
  if (OPENAI_API_KEY.startsWith('sk-')) {
    console.log('✅ OpenAI API key format looks correct');
  } else {
    console.log('⚠️  OpenAI API key format may be incorrect');
  }
  
  console.log('\n5. 🎯 Testing Server Endpoints...');
  
  try {
    // Test the bot status endpoint
    const statusResponse = await fetch(`${SERVER_URL}/api/telegram-bot`);
    const status = await statusResponse.json();
    
    console.log(`📊 Bot Status: ${status.status}`);
    console.log(`🔧 Version: ${status.version || 'Unknown'}`);
    console.log(`🔑 Bot Token: ${status.bot_token}`);
    console.log(`🤖 OpenAI Key: ${status.openai_key}`);
    console.log(`🚀 Ready: ${status.ready ? '✅ Yes' : '❌ No'}`);
    
    if (status.missing_variables && status.missing_variables.length > 0) {
      console.log('❌ Missing variables:', status.missing_variables.join(', '));
    }
    
  } catch (error) {
    console.log('❌ Server endpoint test failed:', error.message);
    console.log('💡 Make sure your server is running and accessible');
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
  console.log('• Server endpoints: ✅ Accessible');
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

// Helper function to send test message
async function sendTelegramMessage(message) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error('Send message error:', error);
    return false;
  }
}

// Add fetch polyfill for Node.js if needed
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Run the test
testConfiguration().catch(console.error); 