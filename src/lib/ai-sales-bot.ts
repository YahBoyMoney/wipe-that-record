import OpenAI from 'openai'

// Enhanced OpenAI setup with better error handling
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
- Services: DIY Kit ($97), Expert Review ($297), Full Service ($497)
- Target Market: California criminal record expungement
- High-converting segments: DUI-urgent, SoCal tech professionals, job seekers
- Current performance: Scaling from $183K to $300K/month target
- Promo codes: SAVE10-30, FRESH48 (25% off), FIRST50 ($50 off)

YOUR ROLE:
- Analyze real daily metrics and spot revenue opportunities
- Give tactical, actionable advice to increase conversions
- Identify underperforming areas and suggest specific fixes
- Recommend A/B tests and optimizations with expected impact
- Alert about urgent opportunities or issues that need immediate action
- Use real data to provide specific, actionable insights

COMMUNICATION STYLE:
- Expert, direct, focused on revenue growth
- Use emojis strategically for clarity
- Provide specific numbers and actionable steps
- Be helpful and results-oriented
- Format responses for easy reading in Telegram

ALWAYS include specific metrics, percentages, and dollar amounts when available.
`

  async generateInsight(metrics: BusinessMetrics, query?: string): Promise<string> {
    try {
      // Check if OpenAI is available
      if (!openai) {
        return `🔧 **AI Analysis Unavailable**

❌ OpenAI API not configured. Please set OPENAI_API_KEY environment variable.

📊 **Current Metrics (Real-time):**
• Revenue Today: $${metrics.todayRevenue.toLocaleString()}
• Leads: ${metrics.todayLeads}
• Conversion: ${(metrics.conversionRate * 100).toFixed(1)}%
• AOV: $${Math.round(metrics.avgOrderValue)}

🚀 **Quick Manual Insights:**
• Target: Need +$${Math.round((300000 - 183000)/30).toLocaleString()}/day to hit $300K/month
• Lead Quality: ${metrics.leadQuality.hotLeads} hot leads (${Math.round(metrics.leadQuality.hotLeads/metrics.todayLeads*100)}% of today's traffic)
• Top Source: ${metrics.topSources[0]?.source || 'N/A'} (${metrics.topSources[0]?.count || 0} leads)

Use /metrics for detailed breakdown!`
      }

      const context = this.buildContext(metrics)
      const prompt = query || "Analyze today's performance and give me 3 tactical recommendations to increase revenue with specific expected impact."

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.SYSTEM_PROMPT },
          { role: "user", content: `${context}\n\nQuery: ${prompt}` }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })

      const aiResponse = completion.choices[0]?.message?.content || "Unable to generate AI insight"
      
      // Add real-time metrics footer
      return `${aiResponse}

📊 **Data Source**: Real-time business metrics
🤖 **AI Model**: GPT-4 + Live Data
🕐 **Updated**: ${new Date().toLocaleTimeString()}`

    } catch (error) {
      console.error('AI Insight Error:', error)
      
      // Provide fallback analysis with real metrics
      return `🔧 **AI Temporarily Unavailable**

📊 **Manual Analysis (Real Data):**

💰 **Revenue**: $${metrics.todayRevenue.toLocaleString()} today
👥 **Leads**: ${metrics.todayLeads} (Quality: ${metrics.leadQuality.avgScore.toFixed(0)}/100)
📈 **Conversion**: ${(metrics.conversionRate * 100).toFixed(1)}% 
💵 **AOV**: $${Math.round(metrics.avgOrderValue)}

🎯 **Quick Wins Based on Data:**
${metrics.conversionRate < 0.8 ? '⚠️ Conversion below 80% - Check pricing/messaging' : '✅ Conversion rate healthy'}
${metrics.leadQuality.hotLeads > 15 ? `🔥 ${metrics.leadQuality.hotLeads} hot leads today - Priority follow-up!` : ''}
${metrics.todayRevenue > 5000 ? '🚀 Strong revenue day - Scale this traffic source!' : ''}

Check your OpenAI API key and try again for full AI analysis.`
    }
  }

  private buildContext(metrics: BusinessMetrics): string {
    return `
🎯 **DAILY PERFORMANCE SNAPSHOT:**

💰 **REVENUE & CONVERSIONS:**
• Today's Revenue: $${metrics.todayRevenue.toLocaleString()}
• Total Leads: ${metrics.todayLeads}
• Conversion Rate: ${(metrics.conversionRate * 100).toFixed(1)}%
• Average Order Value: $${Math.round(metrics.avgOrderValue)}
• Revenue per Lead: $${metrics.todayLeads > 0 ? Math.round(metrics.todayRevenue/metrics.todayLeads) : 0}

🔥 **LEAD QUALITY BREAKDOWN:**
• Hot Leads (75+ score): ${metrics.leadQuality.hotLeads} (${metrics.todayLeads > 0 ? Math.round(metrics.leadQuality.hotLeads/metrics.todayLeads*100) : 0}%)
• Warm Leads (50-74): ${metrics.leadQuality.warmLeads} (${metrics.todayLeads > 0 ? Math.round(metrics.leadQuality.warmLeads/metrics.todayLeads*100) : 0}%)
• Cold Leads (<50): ${metrics.leadQuality.coldLeads} (${metrics.todayLeads > 0 ? Math.round(metrics.leadQuality.coldLeads/metrics.todayLeads*100) : 0}%)
• Average Lead Score: ${metrics.leadQuality.avgScore.toFixed(1)}/100

📊 **TOP TRAFFIC SOURCES:**
${metrics.topSources.map((s, i) => `${i+1}. ${s.source}: ${s.count} leads (${metrics.todayLeads > 0 ? Math.round(s.count/metrics.todayLeads*100) : 0}%)`).join('\n')}

🎯 **CAMPAIGN PERFORMANCE:**
• SoCal: ${metrics.campaigns.socal.leads} leads → $${metrics.campaigns.socal.revenue.toLocaleString()} (${metrics.campaigns.socal.leads > 0 ? Math.round(metrics.campaigns.socal.revenue/metrics.campaigns.socal.leads) : 0}/lead)
• DUI: ${metrics.campaigns.dui.leads} leads → $${metrics.campaigns.dui.revenue.toLocaleString()} (${metrics.campaigns.dui.leads > 0 ? Math.round(metrics.campaigns.dui.revenue/metrics.campaigns.dui.leads) : 0}/lead)
• Misdemeanor: ${metrics.campaigns.misdemeanor.leads} leads → $${metrics.campaigns.misdemeanor.revenue.toLocaleString()} (${metrics.campaigns.misdemeanor.leads > 0 ? Math.round(metrics.campaigns.misdemeanor.revenue/metrics.campaigns.misdemeanor.leads) : 0}/lead)

💼 **RECENT ORDERS (Last 5):**
${metrics.recentOrders.slice(0, 5).map((order, i) => 
  `${i+1}. $${order.amount} - ${order.product} - ${order.county} - ${order.source}`
).join('\n')}

🚨 **ACTIVE ALERTS:**
${metrics.alerts.map(alert => `${this.getAlertEmoji(alert.type)} ${alert.message} → ${alert.action}`).join('\n')}

📈 **SCALING CONTEXT:**
• Current Monthly: $183,000
• Target Monthly: $300,000
• Gap: $117,000/month ($3,900/day needed)
• Today vs Target: ${metrics.todayRevenue >= 3900 ? '✅ On track' : '⚠️ Below target'}
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
    return this.generateInsight(metrics, "Give me 5 specific quick wins I can implement TODAY to boost conversions and revenue. Include expected impact and implementation steps.")
  }

  async analyzeConversionDrop(metrics: BusinessMetrics): Promise<string> {
    if (metrics.conversionRate < 0.6) {
      return this.generateInsight(metrics, `My conversion rate is ${(metrics.conversionRate * 100).toFixed(1)}% which is below 60%. Diagnose the issue and give me immediate fixes with expected improvement.`)
    }
    return this.generateInsight(metrics, "Analyze my conversion performance and suggest optimizations to get above 80% conversion rate.")
  }

  async optimizePricing(metrics: BusinessMetrics): Promise<string> {
    return this.generateInsight(metrics, `Current AOV is $${Math.round(metrics.avgOrderValue)}. Analyze my pricing strategy: DIY ($97), Expert Review ($297), Full Service ($497). Should I adjust prices, create new promo codes, or bundle services differently to increase revenue?`)
  }

  async scalingAdvice(metrics: BusinessMetrics): Promise<string> {
    return this.generateInsight(metrics, `Current performance: $${metrics.todayRevenue.toLocaleString()}/day, ${metrics.todayLeads} leads, ${(metrics.conversionRate * 100).toFixed(1)}% conversion. I need to scale from $183K to $300K/month. Give me a specific 90-day roadmap with milestones and expected ROI.`)
  }
}

// Enhanced Telegram Bot Helper with better error handling
export async function sendTelegramMessage(message: string, chatId?: string): Promise<boolean> {
  try {
    // Use environment variables with secure fallback
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = chatId || process.env.TELEGRAM_CHAT_ID

    if (!BOT_TOKEN) {
      console.error('❌ TELEGRAM_BOT_TOKEN not configured')
      return false
    }

    if (!CHAT_ID) {
      console.error('❌ No Telegram Chat ID provided')
      return false
    }

    // Split long messages to avoid Telegram's 4096 character limit
    const maxLength = 4000
    const messages = message.length > maxLength 
      ? [message.substring(0, maxLength) + '... (truncated)', message.substring(maxLength)]
      : [message]

    for (const msg of messages) {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: msg,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      })

      const result = await response.json()
      
      if (!result.ok) {
        console.error('Telegram API error:', result)
        return false
      }
    }

    return true
  } catch (error) {
    console.error('❌ Telegram send error:', error)
    return false
  }
}

// Test function for bot configuration
export async function testBotConfiguration(): Promise<{success: boolean, message: string}> {
  const missing = []
  
  if (!process.env.TELEGRAM_BOT_TOKEN) missing.push('TELEGRAM_BOT_TOKEN')
  if (!process.env.OPENAI_API_KEY) missing.push('OPENAI_API_KEY')
  
  if (missing.length > 0) {
    return {
      success: false,
      message: `❌ Missing environment variables: ${missing.join(', ')}`
    }
  }
  
  return {
    success: true,
    message: '✅ Bot configuration is complete'
  }
} 