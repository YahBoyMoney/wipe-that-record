import { NextRequest, NextResponse } from 'next/server'
import { BusinessTelegramBot } from '@/lib/business-telegram-bot'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron request
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_IDS = process.env.TELEGRAM_CHAT_ID?.split(',').map(id => id.trim()) || []

    if (!BOT_TOKEN || CHAT_IDS.length === 0) {
      console.error('Missing Telegram configuration for cron job')
      return NextResponse.json({ 
        error: 'Telegram not configured',
        missing: !BOT_TOKEN ? 'TELEGRAM_BOT_TOKEN' : 'TELEGRAM_CHAT_ID'
      }, { status: 500 })
    }

    console.log('🌅 Running daily summary cron job...')

    // Send daily summary to each configured chat
    const results = []
    for (const chatId of CHAT_IDS) {
      try {
        const bot = new BusinessTelegramBot(BOT_TOKEN, chatId)
        await bot.sendDailySummary()
        results.push({ chatId, status: 'sent' })
        console.log(`✅ Daily summary sent to chat ${chatId}`)
      } catch (error) {
        console.error(`❌ Failed to send daily summary to chat ${chatId}:`, error)
        results.push({ chatId, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Daily summary cron completed',
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Daily summary cron error:', error)
    return NextResponse.json({
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Handle manual trigger via POST (for testing)
export async function POST(request: NextRequest) {
  try {
    // Allow manual triggering for testing
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_IDS = process.env.TELEGRAM_CHAT_ID?.split(',').map(id => id.trim()) || []

    if (!BOT_TOKEN || CHAT_IDS.length === 0) {
      return NextResponse.json({ 
        error: 'Telegram not configured',
        missing: !BOT_TOKEN ? 'TELEGRAM_BOT_TOKEN' : 'TELEGRAM_CHAT_ID'
      }, { status: 500 })
    }

    console.log('📋 Manual daily summary trigger...')

    const results = []
    for (const chatId of CHAT_IDS) {
      try {
        const bot = new BusinessTelegramBot(BOT_TOKEN, chatId)
        await bot.sendDailySummary()
        results.push({ chatId, status: 'sent' })
      } catch (error) {
        results.push({ chatId, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Manual daily summary sent',
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Manual daily summary error:', error)
    return NextResponse.json({
      error: 'Manual trigger failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 