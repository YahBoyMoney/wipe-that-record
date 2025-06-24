import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Environment check requested')
    
    const envVars = {
      DATABASE_URI: process.env.DATABASE_URI ? 
        `${process.env.DATABASE_URI.substring(0, 20)}...` : 'NOT SET',
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ? 
        `${process.env.PAYLOAD_SECRET.substring(0, 8)}...` : 'NOT SET',
      NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 
        `${process.env.STRIPE_SECRET_KEY.substring(0, 12)}...` : 'NOT SET',
      // Add timestamp for debugging
      TIMESTAMP: new Date().toISOString(),
      // Check if required vars are present
      REQUIRED_VARS_STATUS: {
        DATABASE_URI: !!process.env.DATABASE_URI,
        PAYLOAD_SECRET: !!process.env.PAYLOAD_SECRET,
        NEXT_PUBLIC_SERVER_URL: !!process.env.NEXT_PUBLIC_SERVER_URL
      }
    }
    
    console.log('✅ Environment variables checked')
    
    return NextResponse.json(envVars, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
    
  } catch (error) {
    console.error('❌ Error checking environment:', error)
    
    return NextResponse.json({ 
      error: 'Failed to check environment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 