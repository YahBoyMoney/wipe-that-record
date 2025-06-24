import { getPayload } from 'payload'
import { NextRequest } from 'next/server'
import config from '../../../../../payload.config'

let payload: any = null

async function initPayload() {
  if (!payload) {
    console.log('🔄 Initializing Payload...')
    payload = await getPayload({ config })
    console.log('✅ Payload initialized successfully')
    console.log('📋 Registered collections:', payload.collections.map((c: any) => c.slug))
  }
  return payload
}

export async function GET(req: NextRequest) {
  try {
    const payloadInstance = await initPayload()
    
    // Handle the request with Payload's handler
    const url = new URL(req.url)
    const path = url.pathname.replace('/api/payload', '')
    
    return new Response('Payload admin route - use /admin for admin UI', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error('❌ Payload GET route error:', error)
    return new Response('Payload initialization failed', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payloadInstance = await initPayload()
    
    return new Response('Payload admin route - use /admin for admin UI', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error('❌ Payload POST route error:', error)
    return new Response('Payload initialization failed', { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payloadInstance = await initPayload()
    
    return new Response('Payload admin route - use /admin for admin UI', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error('❌ Payload PUT route error:', error)
    return new Response('Payload initialization failed', { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payloadInstance = await initPayload()
    
    return new Response('Payload admin route - use /admin for admin UI', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error('❌ Payload PATCH route error:', error)
    return new Response('Payload initialization failed', { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payloadInstance = await initPayload()
    
    return new Response('Payload admin route - use /admin for admin UI', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error('❌ Payload DELETE route error:', error)
    return new Response('Payload initialization failed', { status: 500 })
  }
} 