import { NextRequest, NextResponse } from 'next/server'
import { SalesAdvisorBot, sendTelegramMessage } from '@/lib/ai-sales-bot'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7971902459:AAEXaewD3p1obQWU2GvCSBCjQ3XkGgpw9Lo'

export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    
    // Handle incoming messages
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id
      const text = update.message.text.toLowerCase()
      const userName = update.message.from?.first_name || 'there'

      console.log(`📱 Telegram message from ${userName}: ${text}`)

      // Handle bot commands
      let response = ''

      if (text.startsWith('/start')) {
        response = `🎉 Welcome ${userName}! I'm your AI Sales Advisor for WipeThatRecord.

I help you maximize your $183K+/month revenue with data-driven insights!

📊 Available Commands:
/insights - Daily performance analysis  
/wins - 5 quick wins to boost revenue
/conversion - Analyze conversion rates
/pricing - Pricing optimization advice
/scale - Scaling roadmap to $300K/month
/help - Show all commands

💡 Or just ask me anything about your business metrics!`

      } else if (text.startsWith('/insights')) {
        // Get daily insights from AI advisor
        const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ai-advisor?action=daily_insight`, {
          method: 'GET'
        })
        const data = await result.json()
        response = data.insight || 'Unable to fetch insights right now.'

      } else if (text.startsWith('/wins')) {
        const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ai-advisor?action=quick_wins`, {
          method: 'GET'
        })
        const data = await result.json()
        response = data.insight || 'Unable to fetch quick wins right now.'

      } else if (text.startsWith('/conversion')) {
        const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ai-advisor?action=conversion_analysis`, {
          method: 'GET'
        })
        const data = await result.json()
        response = data.insight || 'Unable to analyze conversions right now.'

      } else if (text.startsWith('/pricing')) {
        const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ai-advisor?action=pricing_optimization`, {
          method: 'GET'
        })
        const data = await result.json()
        response = data.insight || 'Unable to analyze pricing right now.'

      } else if (text.startsWith('/scale')) {
        const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ai-advisor?action=scaling_advice`, {
          method: 'GET'
        })
        const data = await result.json()
        response = data.insight || 'Unable to provide scaling advice right now.'

      } else if (text.startsWith('/help')) {
        response = `🤖 WipeThatRecord AI Sales Advisor

📊 COMMANDS:
/insights - Daily performance analysis
/wins - 5 quick revenue wins  
/conversion - Conversion rate analysis
/pricing - Pricing optimization
/scale - Scaling roadmap
/metrics - Quick stats summary
/help - This help menu

💬 CUSTOM QUERIES:
Just type your question! Examples:
• "How can I increase my conversion rate?"
• "What's my best traffic source?"
• "Should I raise my prices?"
• "How do I get more DUI leads?"

🔥 I'm here to help you maximize revenue!`

      } else if (text.startsWith('/metrics')) {
        const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ai-advisor`, {
          method: 'GET'
        })
        const data = await result.json()
        
        if (data.metrics) {
          response = `📊 TODAY'S METRICS:

💰 Revenue: $${data.metrics.revenue.toLocaleString()}
👥 Leads: ${data.metrics.leads}
📈 Conversion: ${(data.metrics.conversionRate * 100).toFixed(1)}%
💵 Avg Order: $${Math.round(data.metrics.avgOrderValue)}

Use /insights for detailed analysis!`
        } else {
          response = 'Unable to fetch metrics right now.'
        }

      } else if (text.startsWith('/')) {
        response = `🤔 Unknown command. Type /help to see all available commands!`

      } else {
        // Handle custom queries with AI
        const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ai-advisor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: update.message.text })
        })
        const data = await result.json()
        response = data.insight || `I understand you're asking: "${update.message.text}". Let me analyze your current metrics and get back to you with insights!`
      }

      // Send response
      await sendTelegramMessage(response, chatId.toString())
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Webhook verification endpoint
  return NextResponse.json({ 
    status: 'WipeThatRecord AI Sales Bot is running',
    bot_token: BOT_TOKEN ? 'configured' : 'missing',
    timestamp: new Date().toISOString()
  })
} 