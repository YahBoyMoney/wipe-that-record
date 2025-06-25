#!/usr/bin/env node

// Test script for AI Sales Bot system
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

console.log('🤖 Testing WipeThatRecord AI Sales Bot System...\n')

async function testAIAdvisor() {
  console.log('1️⃣ Testing AI Advisor API...')
  
  try {
    // Test daily insights
    const response = await fetch(`${BASE_URL}/api/ai-advisor?action=daily_insight`)
    const data = await response.json()
    
    if (data.success && data.insight) {
      console.log('✅ AI Advisor working!')
      console.log('📊 Sample metrics:', data.metrics)
      console.log('💡 Insight preview:', data.insight.substring(0, 100) + '...')
    } else {
      console.log('❌ AI Advisor failed:', data.error)
    }
  } catch (error) {
    console.log('❌ AI Advisor error:', error.message)
  }
  
  console.log('')
}

async function testTelegramBot() {
  console.log('2️⃣ Testing Telegram Bot...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/telegram-bot`)
    const data = await response.json()
    
    if (data.status) {
      console.log('✅ Telegram Bot API working!')
      console.log('📱 Bot token:', data.bot_token)
      console.log('⏰ Last check:', data.timestamp)
    } else {
      console.log('❌ Telegram Bot failed')
    }
  } catch (error) {
    console.log('❌ Telegram Bot error:', error.message)
  }
  
  console.log('')
}

async function testCustomQuery() {
  console.log('3️⃣ Testing Custom AI Query...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/ai-advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: 'Give me 3 quick wins to increase revenue today' 
      })
    })
    const data = await response.json()
    
    if (data.success && data.insight) {
      console.log('✅ Custom AI Query working!')
      console.log('❓ Query:', data.query)
      console.log('💡 AI Response:', data.insight.substring(0, 150) + '...')
    } else {
      console.log('❌ Custom Query failed:', data.error)
    }
  } catch (error) {
    console.log('❌ Custom Query error:', error.message)
  }
  
  console.log('')
}

async function showSystemStatus() {
  console.log('📊 SYSTEM STATUS SUMMARY:')
  console.log('🌐 Base URL:', BASE_URL)
  console.log('🔑 Required Environment Variables:')
  console.log('  - OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing')
  console.log('  - TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing')
  console.log('  - TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID ? '✅ Set' : '❌ Missing')
  console.log('')
  
  console.log('🚀 HOW TO USE YOUR AI SALES BOT:')
  console.log('1. Open Telegram and search: @WipeMyRecordBot')
  console.log('2. Send: /start')
  console.log('3. Use commands like:')
  console.log('   /insights - Daily analysis')
  console.log('   /wins - Quick revenue wins')
  console.log('   /metrics - Current stats')
  console.log('4. Or ask questions like:')
  console.log('   "How can I increase my conversion rate?"')
  console.log('   "What\'s my best traffic source?"')
  console.log('')
}

async function runTests() {
  await testAIAdvisor()
  await testTelegramBot()
  await testCustomQuery()
  await showSystemStatus()
  
  console.log('🎉 AI Sales Bot System Test Complete!')
  console.log('Ready to make you more money! 💰')
}

runTests().catch(console.error) 