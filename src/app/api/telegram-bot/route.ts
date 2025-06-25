import { NextRequest, NextResponse } from 'next/server'
import { BusinessTelegramBot } from '../../../lib/business-telegram-bot'

// Enhanced security and environment validation
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET
const ALLOWED_CHAT_IDS = process.env.TELEGRAM_CHAT_ID?.split(',').map(id => id.trim()) || []

// Validate critical environment variables
function validateEnvironment() {
  const missing = []
  if (!BOT_TOKEN) missing.push('TELEGRAM_BOT_TOKEN')
  if (!WEBHOOK_SECRET) missing.push('TELEGRAM_WEBHOOK_SECRET')
  if (!process.env.OPENAI_API_KEY) missing.push('OPENAI_API_KEY')
  if (ALLOWED_CHAT_IDS.length === 0) missing.push('TELEGRAM_CHAT_ID')
  
  return missing
}

// Verify Telegram webhook authenticity
function verifyTelegramRequest(request: NextRequest): boolean {
  const telegramSecret = request.headers.get('x-telegram-bot-api-secret-token')
  return telegramSecret === WEBHOOK_SECRET
}

// Security: Verify request is from authorized chat
function isAuthorizedChat(chatId: string): boolean {
  return ALLOWED_CHAT_IDS.includes(chatId.toString())
}

export async function POST(request: NextRequest) {
  try {
    // Environment validation
    const missingVars = validateEnvironment()
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars)
      return NextResponse.json(
        { error: 'Bot configuration incomplete', missing: missingVars },
        { status: 500 }
      )
    }

    // Security: Verify webhook authenticity
    if (!verifyTelegramRequest(request)) {
      console.error('Unauthorized webhook request - invalid secret token')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Parse webhook payload
    const update = await request.json()
    console.log('Received Telegram update:', JSON.stringify(update, null, 2))

    // Extract message details
    const message = update.message
    if (!message) {
      console.log('No message in update, ignoring')
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id.toString()
    const text = message.text || ''
    const username = message.from?.username || 'Unknown'

    // Security: Verify authorized chat
    if (!isAuthorizedChat(chatId)) {
      console.error(`Unauthorized chat attempt from ${chatId} (${username})`)
      await sendUnauthorizedMessage(chatId)
      return NextResponse.json({ ok: true })
    }

    // Initialize business bot (BOT_TOKEN is guaranteed to exist due to validation above)
    const bot = new BusinessTelegramBot(BOT_TOKEN!, chatId)

    // Route commands
    await bot.handleCommand(text, message)

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle unauthorized access attempts
async function sendUnauthorizedMessage(chatId: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN!}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🚫 *Access Denied*\n\nThis bot is restricted to authorized users only.',
        parse_mode: 'Markdown'
      })
    })
    console.log('Sent unauthorized message:', await response.text())
  } catch (error) {
    console.error('Failed to send unauthorized message:', error)
  }
}

// Handle GET requests for status/health checks
export async function GET(request: NextRequest) {
  const missingVars = validateEnvironment()
  
  if (missingVars.length > 0) {
    return NextResponse.json({
      status: 'error',
      message: 'Bot configuration incomplete',
      missing: missingVars
    }, { status: 500 })
  }

  return NextResponse.json({
    status: 'healthy',
    bot: '@WipeMyRecordBot',
    webhook: 'configured',
    environment: 'production',
    timestamp: new Date().toISOString()
  })
} 