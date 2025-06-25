import { NextResponse } from 'next/server'

export async function GET() {
  // Check environment variables without exposing their values
  const envStatus = {
    TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: !!process.env.TELEGRAM_CHAT_ID,
    TELEGRAM_WEBHOOK_SECRET: !!process.env.TELEGRAM_WEBHOOK_SECRET,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV
  }

  const missingVars = Object.entries(envStatus)
    .filter(([key, exists]) => key !== 'NODE_ENV' && key !== 'VERCEL_ENV' && !exists)
    .map(([key]) => key)

  return NextResponse.json({
    status: missingVars.length === 0 ? 'ready' : 'missing_config',
    environment: {
      node_env: process.env.NODE_ENV,
      vercel_env: process.env.VERCEL_ENV,
      deployment_id: process.env.VERCEL_DEPLOYMENT_ID?.substring(0, 8)
    },
    telegram_bot_config: envStatus,
    missing_variables: missingVars,
    timestamp: new Date().toISOString(),
    ready_for_webhook: missingVars.length === 0
  })
} 