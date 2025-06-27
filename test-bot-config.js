#!/usr/bin/env node

// Test script to verify Telegram bot and OpenAI configuration
require('dotenv').config();

const requiredEnvVars = [
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID', 
  'OPENAI_API_KEY'
];

console.log('🔧 Testing Bot Configuration...\n');

// Check environment variables
console.log('📋 Environment Variables:');
const missingVars = [];
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 8)}...`);
  } else {
    console.log(`❌ ${varName}: Not set`);
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log(`\n❌ Missing required environment variables: ${missingVars.join(', ')}`);
  console.log('\n📝 To fix this, add to your .env.local file:');
  missingVars.forEach(varName => {
    console.log(`${varName}=your_${varName.toLowerCase()}_here`);
  });
  process.exit(1);
}

// Test Telegram Bot API
async function testTelegramBot() {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  try {
    console.log('\n🤖 Testing Telegram Bot API...');
    
    // Test bot info
    const botInfoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const botInfo = await botInfoResponse.json();
    
    if (botInfo.ok) {
      console.log(`✅ Bot connected: @${botInfo.result.username}`);
    } else {
      console.log('❌ Bot connection failed:', botInfo.description);
      return false;
    }
    
    // Test sending message
    const testMessage = `🧪 Test message from WipeThatRecord bot\nTime: ${new Date().toLocaleString()}`;
    const sendResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: testMessage,
        parse_mode: 'Markdown'
      })
    });
    
    const sendResult = await sendResponse.json();
    if (sendResult.ok) {
      console.log('✅ Test message sent successfully');
    } else {
      console.log('❌ Failed to send test message:', sendResult.description);
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Telegram API error:', error.message);
    return false;
  }
}

// Test OpenAI API
async function testOpenAI() {
  try {
    console.log('\n🧠 Testing OpenAI API...');
    
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Test message - respond with "OpenAI working"' }],
      max_tokens: 10
    });
    
    const response = completion.choices[0]?.message?.content || '';
    console.log(`✅ OpenAI API working: "${response}"`);
    return true;
  } catch (error) {
    console.log('❌ OpenAI API error:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('\n🚀 Running comprehensive tests...\n');
  
  const telegramTest = await testTelegramBot();
  const openaiTest = await testOpenAI();
  
  console.log('\n📊 Test Results:');
  console.log(`🤖 Telegram Bot: ${telegramTest ? '✅ Working' : '❌ Failed'}`);
  console.log(`🧠 OpenAI API: ${openaiTest ? '✅ Working' : '❌ Failed'}`);
  
  if (telegramTest && openaiTest) {
    console.log('\n🎉 All systems operational! Your bot is ready to use.');
    console.log('\n💡 Next steps:');
    console.log('1. Message your bot to test AI insights');
    console.log('2. Try commands like /metrics or /insights');
    console.log('3. Ask natural language questions');
  } else {
    console.log('\n⚠️  Some systems need attention. Check the errors above.');
    
    if (!telegramTest) {
      console.log('\n🔧 Telegram Bot fixes:');
      console.log('- Verify TELEGRAM_BOT_TOKEN is correct');
      console.log('- Verify TELEGRAM_CHAT_ID is your actual chat ID');
      console.log('- Start a chat with your bot first');
    }
    
    if (!openaiTest) {
      console.log('\n🔧 OpenAI API fixes:');
      console.log('- Verify OPENAI_API_KEY is correct and active');
      console.log('- Check your OpenAI account has credits');
      console.log('- Ensure API key has GPT-4 access');
    }
  }
}

runTests().catch(console.error);