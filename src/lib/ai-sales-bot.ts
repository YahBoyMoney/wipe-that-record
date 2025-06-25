import OpenAI from 'openai'

// Handle missing API key gracefully during build
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null

interface BusinessMetrics {
  todayRevenue: number
  todayLeads: number
  conversionRate: number
  avgOrderValue: number
  topSources: Array<{source: string, count: number}>
  recentOrders: Array<any>
  leadQuality: {
    hotLeads: number
    warmLeads: number
    coldLeads: number
    avgScore: number
  }
  campaigns: {
    socal: { leads: number, revenue: number }
    dui: { leads: number, revenue: number }
    misdemeanor: { leads: number, revenue: number }
  }
  alerts: Array<{
    type: 'opportunity' | 'warning' | 'success'
    message: string
    action: string
  }>
}

export class SalesAdvisorBot {
  private SYSTEM_PROMPT = `
You are an AI sales advisor for WipeThatRecord, a California expungement service generating $183K+/month.

BUSINESS CONTEXT:
- Services: DIY ($97), Expert Review ($297), Full Service ($497)
- Target: California criminal record expungement
- High-converting segments: DUI-urgent, SoCal tech professionals, job seekers
- Current conversion rate: 93% with proper scoring
- Promo codes: SAVE10-30, FRESH48 (25% off), FIRST50 ($50 off)

YOUR ROLE:
- Analyze daily metrics and spot revenue opportunities
- Give tactical, actionable advice to increase conversions
- Identify underperforming areas and suggest fixes
- Recommend A/B tests and optimizations
- Alert about urgent opportunities or issues

TONE: Expert, direct, focused on revenue. Use emojis strategically. Be helpful as fuck.
`

  async generateInsight(metrics: BusinessMetrics, query?: string): Promise<string> {
    try {
      // Check if OpenAI is available
      if (!openai) {
        return "🔧 AI advisor not configured. Please set your OPENAI_API_KEY environment variable."
      }

      const context = this.buildContext(metrics)
      const prompt = query || "Analyze today's performance and give me 3 tactical recommendations to increase revenue."

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.SYSTEM_PROMPT },
          { role: "user", content: `${context}\n\nQuery: ${prompt}` }
        ],
        max_tokens: 800,
        temperature: 0.3
      })

      return completion.choices[0]?.message?.content || "Unable to generate insight"
    } catch (error) {
      console.error('AI Insight Error:', error)
      return "🔧 AI advisor temporarily unavailable. Check your OpenAI API key."
    }
  }

  private buildContext(metrics: BusinessMetrics): string {
    return `
DAILY PERFORMANCE:
💰 Revenue: $${metrics.todayRevenue.toLocaleString()}
👥 Leads: ${metrics.todayLeads}
📈 Conversion Rate: ${(metrics.conversionRate * 100).toFixed(1)}%
💵 Avg Order Value: $${metrics.avgOrderValue}

LEAD QUALITY:
🔥 Hot Leads (75+ score): ${metrics.leadQuality.hotLeads}
🟡 Warm Leads (50-74): ${metrics.leadQuality.warmLeads}
❄️ Cold Leads (<50): ${metrics.leadQuality.coldLeads}
📊 Avg Lead Score: ${metrics.leadQuality.avgScore}/100

TOP TRAFFIC SOURCES:
${metrics.topSources.map(s => `• ${s.source}: ${s.count} leads`).join('\n')}

CAMPAIGN PERFORMANCE:
🌴 SoCal: ${metrics.campaigns.socal.leads} leads → $${metrics.campaigns.socal.revenue}
🍺 DUI: ${metrics.campaigns.dui.leads} leads → $${metrics.campaigns.dui.revenue}
⚖️ Misdemeanor: ${metrics.campaigns.misdemeanor.leads} leads → $${metrics.campaigns.misdemeanor.revenue}

RECENT ORDERS (last 5):
${metrics.recentOrders.slice(0, 5).map(order => 
  `• $${order.amount} - ${order.product} - ${order.county || 'Unknown'} - ${order.source || 'Direct'}`
).join('\n')}

ACTIVE ALERTS:
${metrics.alerts.map(alert => `${this.getAlertEmoji(alert.type)} ${alert.message}`).join('\n')}
`
  }

  private getAlertEmoji(type: string): string {
    switch (type) {
      case 'opportunity': return '🚀'
      case 'warning': return '⚠️'
      case 'success': return '🎉'
      default: return 'ℹ️'
    }
  }

  async getQuickWins(metrics: BusinessMetrics): Promise<string> {
    return this.generateInsight(metrics, "Give me 5 quick wins I can implement TODAY to boost conversions and revenue.")
  }

  async analyzeConversionDrop(metrics: BusinessMetrics): Promise<string> {
    if (metrics.conversionRate < 0.8) {
      return this.generateInsight(metrics, "My conversion rate dropped below 80%. Diagnose the issue and give me immediate fixes.")
    }
    return "✅ Conversion rate is healthy. Focus on traffic scaling."
  }

  async optimizePricing(metrics: BusinessMetrics): Promise<string> {
    return this.generateInsight(metrics, "Analyze my pricing strategy. Should I adjust prices, create new promo codes, or bundle services differently?")
  }

  async scalingAdvice(metrics: BusinessMetrics): Promise<string> {
    return this.generateInsight(metrics, "I want to scale from current performance to $300K/month. What's my roadmap?")
  }
}

// Telegram Bot Helper
export async function sendTelegramMessage(message: string, chatId?: string): Promise<boolean> {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7971902459:AAEXaewD3p1obQWU2GvCSBCjQ3XkGgpw9Lo'
    const CHAT_ID = chatId || process.env.TELEGRAM_CHAT_ID

    if (!CHAT_ID) {
      console.error('No Telegram Chat ID configured')
      return false
    }

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })

    const result = await response.json()
    return result.ok
  } catch (error) {
    console.error('Telegram send error:', error)
    return false
  }
} 