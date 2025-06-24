#!/usr/bin/env node

// Test email functionality
async function testEmail() {
  try {
    // Load environment variables
    const { config } = await import('dotenv')
    config({ path: '.env.local' })
  } catch (e) {
    console.log('💡 No dotenv found, using environment variables directly')
  }

  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  console.log('📧 Testing Email Functionality')
  console.log('🔧 SEND_EMAILS:', process.env.SEND_EMAILS || 'not set')

  // Test lead creation which should trigger email
  const testLead = {
    fullName: 'Email Test User',
    email: 'admin@wipethatrecord.com', // Use your actual email to receive the test
    phone: '555-123-4567',
    convictionType: 'DUI',
    urgency: 'immediate',
    budget: 'flexible',
    paid: true // This should trigger a DIY confirmation email
  }

  try {
    let fetch
    try {
      const fetchModule = await import('node-fetch')
      fetch = fetchModule.default
    } catch (e) {
      console.error('❌ node-fetch not found. Please install with: npm install node-fetch')
      process.exit(1)
    }

    console.log('📤 Creating test lead that should trigger email...')
    console.log('📧 Email will be sent to:', testLead.email)
    
    const response = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testLead)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API call failed:', errorText)
      return
    }

    const result = await response.json()
    console.log('✅ Lead created:', result.leadId)
    console.log('📧 Email should be sent shortly...')
    console.log('📋 Check your email inbox at:', testLead.email)

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure your Next.js server is running with: pnpm dev')
    }
  }
}

testEmail().catch(error => {
  console.error('❌ Email test failed:', error)
  process.exit(1)
}) 