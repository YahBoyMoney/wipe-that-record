import { NextRequest, NextResponse } from 'next/server'
import { SalesAdvisorBot, sendTelegramMessage } from '@/lib/ai-sales-bot'

// Environment variables with proper fallbacks
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3000'

// Validate required environment variables
function validateEnvironment() {
  const missing = []
  if (!BOT_TOKEN) missing.push('TELEGRAM_BOT_TOKEN')
  if (!process.env.OPENAI_API_KEY) missing.push('OPENAI_API_KEY')
  
  return missing
}

export async function POST(request: NextRequest) {
  try {
    // Check environment setup
    const missingVars = validateEnvironment()
    if (missingVars.length > 0) {
      console.error('❌ Missing environment variables:', missingVars.join(', '))
      return NextResponse.json({ 
        error: 'Bot configuration incomplete',
        missing: missingVars 
      }, { status: 500 })
    }

    const update = await request.json()
    console.log('📱 Received Telegram update:', JSON.stringify(update, null, 2))
    
    // Handle incoming messages
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id
      const text = update.message.text.toLowerCase()
      const userName = update.message.from?.first_name || 'there'

      console.log(`📱 Telegram message from ${userName} (ID: ${chatId}): ${text}`)

      // Handle bot commands
      let response = ''

      if (text.startsWith('/start')) {
        response = `🎉 Welcome ${userName}! I'm your AI Sales Advisor for WipeThatRecord.

🚀 **Current Status**: $183K+/month revenue
🎯 **Goal**: Scale to $300K/month with AI insights!

📊 **Available Commands:**
/insights - Daily performance analysis with AI  
/wins - 5 AI-powered quick wins to boost revenue
/conversion - AI conversion rate optimization
/pricing - AI pricing strategy advice
/scale - AI scaling roadmap to $300K/month
/metrics - Real-time business KPIs
/help - Show all commands

💬 **Or ask me anything!** Examples:
• "How can I increase conversions?"
• "What's my best traffic source?"
• "Should I raise my prices?"
• "How do I get more DUI leads?"

🤖 **Powered by GPT-4** with real business data!

Ready to optimize? Try: /insights`

      } else if (text.startsWith('/insights')) {
        response = await handleAIRequest('daily_insight', chatId)

      } else if (text.startsWith('/wins')) {
        response = await handleAIRequest('quick_wins', chatId)

      } else if (text.startsWith('/conversion')) {
        response = await handleAIRequest('conversion_analysis', chatId)

      } else if (text.startsWith('/pricing')) {
        response = await handleAIRequest('pricing_optimization', chatId)

      } else if (text.startsWith('/scale')) {
        response = await handleAIRequest('scaling_advice', chatId)

      } else if (text.startsWith('/help')) {
        response = `🤖 **WipeThatRecord AI Sales Advisor**

📊 **COMMANDS:**
/insights - AI daily performance analysis
/wins - 5 AI-powered revenue wins  
/conversion - AI conversion optimization
/pricing - AI pricing strategy
/scale - AI scaling roadmap
/metrics - Real-time KPIs
/help - This help menu

💬 **AI CHAT:**
Just type your question! I'll analyze your real business data with GPT-4.

**Examples:**
• "How can I increase my conversion rate?"
• "What's my best traffic source this week?"
• "Should I raise my prices for Expert Review?"
• "How do I get more DUI leads in Orange County?"
• "Analyze my top performing campaigns"

🔥 **I help you scale from $183K to $300K/month!**

💡 **Tip**: I use real-time business data + GPT-4 to give specific, actionable advice for your California expungement service.

Ready to optimize? Try: /insights`

      } else if (text.startsWith('/metrics')) {
        response = await handleMetricsRequest(chatId)

      } else if (text.startsWith('/')) {
        response = `🤔 Unknown command: ${text}

Type /help to see all available commands!

💡 Or just ask me a question like:
• "How to increase revenue?"
• "Best converting traffic sources?"
• "Optimize my pricing strategy"`

      } else {
        // Handle custom queries with AI
        response = await handleCustomQuery(update.message.text, chatId, userName)
      }

      // Send response
      if (response) {
        try {
          await sendTelegramMessage(response, chatId.toString())
          console.log('✅ Response sent successfully to chat:', chatId)
        } catch (error) {
          console.error('❌ Failed to send response:', error)
        }
      }
    }

    return NextResponse.json({ ok: true, status: 'processed' })

  } catch (error) {
    console.error('❌ Telegram webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// Helper function to handle AI requests
async function handleAIRequest(action: string, chatId: number): Promise<string> {
  try {
    console.log(`🤖 Processing AI request: ${action}`)
    const url = `${SERVER_URL}/api/ai-advisor?action=${action}&chat_id=${chatId}`
    console.log(`🔗 Calling: ${url}`)
    
    const result = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!result.ok) {
      throw new Error(`API returned ${result.status}: ${result.statusText}`)
    }
    
    const data = await result.json()
    return data.insight || data.message || 'Unable to generate AI insights right now. Please try again.'
  } catch (error) {
    console.error(`❌ ${action} error:`, error)
    return `⚠️ AI advisor temporarily unavailable (${action}). The GPT-4 integration might be having issues. Please try again in a moment.

🔧 **Troubleshooting**: 
• Check if OPENAI_API_KEY is configured
• Try /metrics for basic stats
• Contact support if this persists`
  }
}

// Helper function to handle metrics requests
async function handleMetricsRequest(chatId: number): Promise<string> {
  try {
    console.log('📊 Fetching real-time metrics...')
    const result = await fetch(`${SERVER_URL}/api/ai-advisor`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!result.ok) {
      throw new Error(`Metrics API returned ${result.status}`)
    }
    
    const data = await result.json()
    
    if (data.metrics) {
      return `📊 **REAL-TIME BUSINESS METRICS**

💰 **REVENUE PERFORMANCE:**
• Today's Revenue: $${data.metrics.revenue?.toLocaleString() || 'N/A'}
• Conversion Rate: ${data.metrics.conversionRate ? (data.metrics.conversionRate * 100).toFixed(1) + '%' : 'N/A'}
• Average Order Value: $${data.metrics.avgOrderValue ? Math.round(data.metrics.avgOrderValue) : 'N/A'}

👥 **LEAD GENERATION:**
• Total Leads Today: ${data.metrics.leads || 'N/A'}

🎯 **SCALING TARGET:**
• Current: $183K/month
• Target: $300K/month  
• Gap: $117K/month

🤖 Use /insights for AI-powered analysis and recommendations!`
    } else {
      return 'Unable to fetch real-time metrics right now. Please try again.'
    }
  } catch (error) {
    console.error('❌ Metrics error:', error)
    return '⚠️ Having trouble getting real-time metrics. Please try again in a moment.'
  }
}

// Helper function to handle custom queries
async function handleCustomQuery(query: string, chatId: number, userName: string): Promise<string> {
  try {
    console.log('🤖 Processing custom AI query:', query)
    const result = await fetch(`${SERVER_URL}/api/ai-advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: query,
        chatId: chatId,
        userName: userName 
      })
    })
    
    if (!result.ok) {
      throw new Error(`Custom query API returned ${result.status}`)
    }
    
    const data = await result.json()
    return data.insight || data.message || `🤖 I understand you're asking: "${query}". 

Let me analyze your current business metrics with GPT-4...

⚠️ AI analysis temporarily unavailable. Try using specific commands like /insights or /wins for immediate data-driven advice.`
  } catch (error) {
    console.error('❌ Custom query error:', error)
    return `🤖 **Processing your question**: "${query}"

⚠️ GPT-4 integration temporarily unavailable. Please try:
• /insights - for AI business analysis
• /wins - for AI-powered quick wins
• /metrics - for current stats

Or ask me again in a moment! The AI will be back online shortly.`
  }
}

export async function GET(request: NextRequest) {
  // Enhanced webhook verification endpoint
  const missingVars = validateEnvironment()
  
  const status = {
    status: 'WipeThatRecord AI Sales Bot',
    version: '2.0 - Enhanced AI Integration',
    bot_token: BOT_TOKEN ? '✅ configured' : '❌ missing',
    openai_key: process.env.OPENAI_API_KEY ? '✅ configured' : '❌ missing',
    server_url: SERVER_URL,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    missing_variables: missingVars.length > 0 ? missingVars : null,
    ready: missingVars.length === 0
  }
  
  console.log('📊 Enhanced bot status check:', status)
  return NextResponse.json(status)
} 