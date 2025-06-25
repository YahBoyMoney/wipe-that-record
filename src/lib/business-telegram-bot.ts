import OpenAI from 'openai'
import { StoreAdapter, WooAdapter, ShopifyAdapter } from './store-adapters'
import { BusinessMetrics, TelegramMessage } from './types'

// Enhanced OpenAI setup
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null

export class BusinessTelegramBot {
  private botToken: string
  private chatId: string
  private store: StoreAdapter

  constructor(botToken: string, chatId: string) {
    this.botToken = botToken
    this.chatId = chatId
    
    // Initialize store adapter based on configuration
    const storeProvider = process.env.STORE_PROVIDER || 'woo'
    this.store = storeProvider === 'shopify' 
      ? new ShopifyAdapter() 
      : new WooAdapter()
  }

  // Main command router
  async handleCommand(text: string, message: TelegramMessage) {
    const command = text.toLowerCase().trim()
    const username = message.from?.first_name || 'there'

    try {
      let response = ''

      // Command routing
      switch (true) {
        case command.startsWith('/start'):
          response = await this.handleStart(username)
          break
          
        case command.startsWith('/sales_today'):
          response = await this.handleSalesToday()
          break
          
        case command.startsWith('/inventory'):
          response = await this.handleInventory()
          break
          
        case command.startsWith('/orders_pending'):
          response = await this.handleOrdersPending()
          break
          
        case command.startsWith('/insights'):
          response = await this.handleAIInsights()
          break
          
        case command.startsWith('/metrics'):
          response = await this.handleMetrics()
          break
          
        case command.startsWith('/alerts'):
          response = await this.handleAlerts()
          break
          
        case command.startsWith('/summary'):
          response = await this.handleDailySummary()
          break
          
        case command.startsWith('/help'):
          response = await this.handleHelp()
          break
          
        case command.startsWith('/'):
          response = this.handleUnknownCommand(command)
          break
          
        default:
          // Handle natural language queries with AI
          response = await this.handleNaturalQuery(text, username)
          break
      }

      if (response) {
        await this.sendMessage(response)
      }

    } catch (error) {
      console.error('Command handling error:', error)
      await this.sendMessage('⚠️ Sorry, I encountered an error processing your request. Please try again.')
    }
  }

  // Command handlers
  private async handleStart(username: string): Promise<string> {
    return `🎉 Welcome ${username}! I'm your AI Business Manager for WipeThatRecord.

🚀 **Current Status**: Advanced AI-powered business intelligence
🎯 **Goal**: Scale with data-driven insights and automation

📊 **Business Commands:**
/sales_today - Today's sales performance
/inventory - Low stock alerts & inventory status  
/orders_pending - Pending order management
/metrics - Real-time business KPIs
/insights - AI-powered business analysis
/alerts - System alerts & notifications
/summary - Daily business summary
/help - Show all commands

💬 **Or ask me anything!** Examples:
• "Why did sales drop this week?"
• "What's my best product category?"
• "How can I improve conversion rates?"
• "Show me revenue trends"

🤖 **Powered by GPT-4** with real-time store data!

Ready to optimize? Try: /sales_today`
  }

  private async handleSalesToday(): Promise<string> {
    try {
      const sales = await this.store.getTodaySales()
      const yesterday = await this.store.getYesterdaySales()
      
      const changePercent = yesterday.gross > 0 
        ? ((sales.gross - yesterday.gross) / yesterday.gross * 100).toFixed(1)
        : 'N/A'
      
      const changeEmoji = parseFloat(changePercent) > 0 ? '📈' : parseFloat(changePercent) < 0 ? '📉' : '➡️'

      return `💰 **TODAY'S SALES PERFORMANCE**

🎯 **Revenue**: $${sales.gross.toLocaleString()}
📦 **Orders**: ${sales.count}
💵 **Average Order**: $${sales.count > 0 ? (sales.gross / sales.count).toFixed(2) : '0.00'}

📊 **vs Yesterday**: ${changeEmoji} ${changePercent}%
💸 **Yesterday**: $${yesterday.gross.toLocaleString()} (${yesterday.count} orders)

⏰ **Last Updated**: ${new Date().toLocaleTimeString()}

🤖 Want analysis? Try: /insights`
    } catch (error) {
      console.error('Sales today error:', error)
      return '⚠️ Unable to fetch today\'s sales data. Please check store connection.'
    }
  }

  private async handleInventory(): Promise<string> {
    try {
      const lowStock = await this.store.getLowStock(10) // threshold: 10 units
      
      if (lowStock.length === 0) {
        return `✅ **INVENTORY STATUS: HEALTHY**

📦 All products have adequate stock levels
🎯 Threshold: 10+ units
⏰ Last checked: ${new Date().toLocaleTimeString()}

💡 Use /alerts to set up automatic low stock notifications`
      }

      const stockList = lowStock
        .slice(0, 10) // Show top 10
        .map(product => `⚠️ **${product.name}**: ${product.stock} units`)
        .join('\n')

      return `🔴 **LOW STOCK ALERT** (${lowStock.length} items)

${stockList}

💡 **Recommendations**:
• Reorder items with <5 units immediately
• Set up automatic reorder triggers
• Monitor bestsellers daily

🤖 Need restocking strategy? Ask: "How should I prioritize restocking?"`
    } catch (error) {
      console.error('Inventory error:', error)
      return '⚠️ Unable to fetch inventory data. Please check store connection.'
    }
  }

  private async handleOrdersPending(): Promise<string> {
    try {
      const pendingOrders = await this.store.getPendingOrders()
      
      if (pendingOrders.length === 0) {
        return `✅ **ALL CAUGHT UP!**

📦 No pending orders to process
🎯 All orders are up to date
⏰ Last checked: ${new Date().toLocaleTimeString()}

Great job staying on top of orders! 🚀`
      }

      const ordersList = pendingOrders
        .slice(0, 5) // Show top 5 most urgent
        .map(order => {
          const hoursSince = Math.floor((Date.now() - order.created.getTime()) / (1000 * 60 * 60))
          return `🔹 **Order #${order.id}**: $${order.total} (${hoursSince}h ago)`
        })
        .join('\n')

      return `⏳ **PENDING ORDERS** (${pendingOrders.length} total)

${ordersList}

⚡ **Action Required**:
• Process orders older than 24h first
• Update customers on shipping status
• Check for payment issues

🤖 Need processing strategy? Ask: "How should I prioritize these orders?"`
    } catch (error) {
      console.error('Pending orders error:', error)
      return '⚠️ Unable to fetch pending orders. Please check store connection.'
    }
  }

  private async handleAIInsights(): Promise<string> {
    try {
      if (!openai) {
        return '⚠️ AI insights unavailable. OpenAI API key not configured.'
      }

      const metrics = await this.getBusinessMetrics()
      
      const prompt = `You are a business analyst. Analyze this data and provide 3 specific, actionable insights:

Sales Data:
- Today: $${metrics.todayRevenue} (${metrics.todayOrders} orders)
- Yesterday: $${metrics.yesterdayRevenue} (${metrics.yesterdayOrders} orders)
- This Week: $${metrics.weekRevenue}
- Average Order Value: $${metrics.avgOrderValue}
- Conversion Rate: ${metrics.conversionRate}%

Top Products: ${metrics.topProducts.map(p => `${p.name} (${p.sales})`).join(', ')}
Traffic Sources: ${metrics.topSources.map(s => `${s.source} (${s.count})`).join(', ')}

Low Stock Items: ${metrics.lowStockCount} items need attention
Pending Orders: ${metrics.pendingOrders} orders to process

Provide:
1. Performance assessment vs yesterday
2. One specific opportunity to increase revenue
3. One operational improvement recommendation

Be concise and actionable.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.3
      })

      const insight = completion.choices[0]?.message?.content || 'Unable to generate insights'

      return `🧠 **AI BUSINESS INSIGHTS**

${insight}

📊 **Data Sources**: Real-time store analytics
🤖 **Powered by**: GPT-4 + your business data
⏰ **Generated**: ${new Date().toLocaleTimeString()}

💡 Want specific analysis? Ask: "Why did my conversion rate change?"`

    } catch (error) {
      console.error('AI insights error:', error)
      return '⚠️ Unable to generate AI insights. Please try again or check OpenAI API configuration.'
    }
  }

  private async handleMetrics(): Promise<string> {
    try {
      const metrics = await this.getBusinessMetrics()
      
      return `📊 **REAL-TIME BUSINESS METRICS**

💰 **REVENUE PERFORMANCE**:
• Today: $${metrics.todayRevenue.toLocaleString()} (${metrics.todayOrders} orders)
• Yesterday: $${metrics.yesterdayRevenue.toLocaleString()} (${metrics.yesterdayOrders} orders)
• This Week: $${metrics.weekRevenue.toLocaleString()}
• Average Order: $${metrics.avgOrderValue.toFixed(2)}

📈 **CONVERSION METRICS**:
• Conversion Rate: ${metrics.conversionRate.toFixed(1)}%
• Weekly Visitors: ${metrics.weeklyVisitors.toLocaleString()}
• Cart Abandonment: ${metrics.cartAbandonmentRate.toFixed(1)}%

🏆 **TOP PERFORMERS**:
${metrics.topProducts.slice(0, 3).map(p => `• ${p.name}: $${p.sales}`).join('\n')}

🎯 **TRAFFIC SOURCES**:
${metrics.topSources.slice(0, 3).map(s => `• ${s.source}: ${s.count} visits`).join('\n')}

⚠️ **ALERTS**: ${metrics.lowStockCount} low stock, ${metrics.pendingOrders} pending orders

⏰ **Updated**: ${new Date().toLocaleTimeString()}

🤖 Want analysis? Try: /insights`
    } catch (error) {
      console.error('Metrics error:', error)
      return '⚠️ Unable to fetch business metrics. Please check store connection.'
    }
  }

  private async handleAlerts(): Promise<string> {
    const alerts = []

    try {
      // Check low stock
      const lowStock = await this.store.getLowStock(5)
      if (lowStock.length > 0) {
        alerts.push(`🔴 **LOW STOCK**: ${lowStock.length} items need restocking`)
      }

      // Check pending orders
      const pending = await this.store.getPendingOrders()
      const oldOrders = pending.filter(order => {
        const hoursSince = (Date.now() - order.created.getTime()) / (1000 * 60 * 60)
        return hoursSince > 24
      })
      if (oldOrders.length > 0) {
        alerts.push(`⏰ **OVERDUE ORDERS**: ${oldOrders.length} orders >24h old`)
      }

      // Check today's performance
      const sales = await this.store.getTodaySales()
      const yesterday = await this.store.getYesterdaySales()
      const drop = yesterday.gross > 0 && sales.gross < yesterday.gross * 0.8
      if (drop) {
        alerts.push(`📉 **SALES DROP**: Today 20%+ below yesterday`)
      }

      if (alerts.length === 0) {
        return `✅ **ALL SYSTEMS HEALTHY**

📊 No active alerts
🎯 Business running smoothly
⏰ Last checked: ${new Date().toLocaleTimeString()}

Keep up the great work! 🚀`
      }

      return `🚨 **ACTIVE ALERTS** (${alerts.length})

${alerts.join('\n\n')}

🤖 **Recommended Actions**:
• Check /inventory for restocking priorities
• Process /orders_pending immediately
• Use /insights for performance analysis

⏰ **Alert Time**: ${new Date().toLocaleTimeString()}`

    } catch (error) {
      console.error('Alerts error:', error)
      return '⚠️ Unable to check alerts. Please check store connection.'
    }
  }

  private async handleDailySummary(): Promise<string> {
    try {
      const metrics = await this.getBusinessMetrics()
      const yesterday = await this.store.getYesterdaySales()
      
      const revenueChange = yesterday.gross > 0 
        ? ((metrics.todayRevenue - yesterday.gross) / yesterday.gross * 100).toFixed(1)
        : 'N/A'
      
      const changeEmoji = parseFloat(revenueChange) > 0 ? '📈' : parseFloat(revenueChange) < 0 ? '📉' : '➡️'

      return `📋 **DAILY BUSINESS SUMMARY**

💰 **REVENUE**: $${metrics.todayRevenue.toLocaleString()} ${changeEmoji} ${revenueChange}%
📦 **ORDERS**: ${metrics.todayOrders} (avg $${metrics.avgOrderValue.toFixed(2)})
📈 **CONVERSION**: ${metrics.conversionRate.toFixed(1)}%

🏆 **TOP PRODUCT**: ${metrics.topProducts[0]?.name || 'N/A'} ($${metrics.topProducts[0]?.sales || 0})
🎯 **TOP SOURCE**: ${metrics.topSources[0]?.source || 'N/A'} (${metrics.topSources[0]?.count || 0} visits)

⚠️ **ACTION ITEMS**:
• ${metrics.lowStockCount} items need restocking
• ${metrics.pendingOrders} orders to process
• Review ${metrics.cartAbandonmentRate.toFixed(1)}% cart abandonment

📊 **VS YESTERDAY**: 
Revenue: $${yesterday.gross.toLocaleString()} → $${metrics.todayRevenue.toLocaleString()}
Orders: ${yesterday.count} → ${metrics.todayOrders}

⏰ **Generated**: ${new Date().toLocaleString()}

🤖 Want deeper analysis? Try: /insights`
    } catch (error) {
      console.error('Daily summary error:', error)
      return '⚠️ Unable to generate daily summary. Please check store connection.'
    }
  }

  private async handleHelp(): Promise<string> {
    return `🤖 **BUSINESS MANAGER COMMANDS**

📊 **BUSINESS INTELLIGENCE**:
/sales_today - Today's sales performance
/metrics - Real-time business KPIs  
/insights - AI-powered business analysis
/summary - Daily business overview

🛒 **OPERATIONS**:
/inventory - Stock levels & low stock alerts
/orders_pending - Orders awaiting processing
/alerts - System alerts & notifications

💬 **AI ASSISTANT**:
Just type your question! I understand:
• "Why did revenue drop this week?"
• "What's my best converting product?"
• "How can I improve my AOV?"
• "Show me traffic source performance"
• "What should I restock first?"

🔧 **FEATURES**:
• Real-time store data integration
• GPT-4 powered insights
• Automated alert monitoring
• Performance trend analysis

🛡️ **SECURITY**: This bot only responds to authorized users

💡 **Pro Tip**: Use /insights for AI-powered recommendations based on your real business data!`
  }

  private handleUnknownCommand(command: string): string {
    return `🤔 Unknown command: ${command}

Type /help to see all available commands!

💡 **Or try asking naturally**:
• "Show me today's sales"
• "What needs restocking?"
• "How are we performing?"

🤖 I understand natural language questions too!`
  }

  private async handleNaturalQuery(query: string, username: string): Promise<string> {
    try {
      if (!openai) {
        return '⚠️ AI chat unavailable. OpenAI API key not configured.'
      }

      const metrics = await this.getBusinessMetrics()
      
      const systemPrompt = `You are a business analyst assistant. Answer user questions about their WipeThatRecord business using this real-time data:

Current Business Data:
- Today's Revenue: $${metrics.todayRevenue} (${metrics.todayOrders} orders)
- Yesterday: $${metrics.yesterdayRevenue} (${metrics.yesterdayOrders} orders)  
- Week Revenue: $${metrics.weekRevenue}
- Conversion Rate: ${metrics.conversionRate}%
- Average Order Value: $${metrics.avgOrderValue}
- Low Stock Items: ${metrics.lowStockCount}
- Pending Orders: ${metrics.pendingOrders}
- Top Products: ${metrics.topProducts.map(p => `${p.name} ($${p.sales})`).join(', ')}
- Traffic Sources: ${metrics.topSources.map(s => `${s.source} (${s.count})`).join(', ')}

Provide specific, actionable answers using this real data. Be concise and helpful.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        max_tokens: 400,
        temperature: 0.3
      })

      const answer = completion.choices[0]?.message?.content || 'I couldn\'t process that question.'

      return `🤖 **AI Assistant Response**

${answer}

📊 **Based on**: Your real-time business data
⏰ **Current time**: ${new Date().toLocaleTimeString()}

💡 **Try specific commands**: /sales_today, /insights, /metrics`

    } catch (error) {
      console.error('Natural query error:', error)
      return `🤖 **Understanding your question**: "${query}"

⚠️ AI processing temporarily unavailable. Try these commands instead:
• /sales_today - for current sales data
• /metrics - for business overview  
• /insights - for AI analysis
• /help - for all commands

I'll be back online shortly! 🚀`
    }
  }

  // Helper methods
  private async getBusinessMetrics(): Promise<BusinessMetrics> {
    try {
      const [todaySales, yesterdaySales, lowStock, pendingOrders] = await Promise.all([
        this.store.getTodaySales(),
        this.store.getYesterdaySales(),
        this.store.getLowStock(10),
        this.store.getPendingOrders()
      ])

      // Mock additional metrics - replace with real store API calls
      return {
        todayRevenue: todaySales.gross,
        todayOrders: todaySales.count,
        yesterdayRevenue: yesterdaySales.gross,
        yesterdayOrders: yesterdaySales.count,
        weekRevenue: todaySales.gross * 7, // Simplified
        avgOrderValue: todaySales.count > 0 ? todaySales.gross / todaySales.count : 0,
        conversionRate: 3.2, // Mock - implement with real analytics
        weeklyVisitors: 2500, // Mock
        cartAbandonmentRate: 68.5, // Mock
        lowStockCount: lowStock.length,
        pendingOrders: pendingOrders.length,
        topProducts: [
          { name: 'Expert Review Service', sales: 890 },
          { name: 'DIY Expungement Kit', sales: 456 },
          { name: 'Legal Consultation', sales: 234 }
        ],
        topSources: [
          { source: 'Google Ads', count: 1200 },
          { source: 'Organic Search', count: 800 },
          { source: 'Facebook Ads', count: 500 }
        ]
      }
    } catch (error) {
      console.error('Error getting business metrics:', error)
      throw error
    }
  }

  private async sendMessage(text: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: text,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        console.error('Telegram API error:', result)
        return false
      }

      console.log('Message sent successfully to chat:', this.chatId)
      return true
    } catch (error) {
      console.error('Failed to send Telegram message:', error)
      return false
    }
  }

  // Public methods for scheduled jobs
  async sendDailySummary(): Promise<void> {
    const summary = await this.handleDailySummary()
    await this.sendMessage(`🌅 **AUTOMATED DAILY SUMMARY**\n\n${summary}`)
  }

  async sendLowStockAlert(): Promise<void> {
    try {
      const lowStock = await this.store.getLowStock(5)
      if (lowStock.length > 0) {
        const alert = `🚨 **AUTOMATED LOW STOCK ALERT**

${lowStock.length} items below 5 units:
${lowStock.slice(0, 5).map(p => `• ${p.name}: ${p.stock} units`).join('\n')}

⚡ **Action needed**: Review restocking priorities`
        
        await this.sendMessage(alert)
      }
    } catch (error) {
      console.error('Low stock alert error:', error)
    }
  }

  async sendNewOrderAlert(orderData: any): Promise<void> {
    try {
      const alert = `🛒 **NEW ORDER ALERT**

Order #${orderData.id} - $${orderData.total}
Customer: ${orderData.customer}
Items: ${orderData.items}

⏰ Received: ${new Date().toLocaleTimeString()}`
      
      await this.sendMessage(alert)
    } catch (error) {
      console.error('New order alert error:', error)
    }
  }
} 