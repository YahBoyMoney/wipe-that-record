#!/usr/bin/env node

// Use dynamic import for node-fetch since this is an ES module
async function runTest() {
  let fetch
  try {
    const fetchModule = await import('node-fetch')
    fetch = fetchModule.default
  } catch (e) {
    console.error('❌ node-fetch not found. Please install with: npm install node-fetch')
    process.exit(1)
  }

  // Try to load environment variables if available
  try {
    const { config } = await import('dotenv')
    config({ path: '.env.local' })
  } catch (e) {
    console.log('💡 No dotenv found, using environment variables directly')
  }

  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  console.log('🧪 Starting Lead API Test')
  console.log('📍 Testing endpoint:', `${BASE_URL}/api/lead`)

  async function testLeadAPI() {
    const testLead = {
      fullName: 'John Test Doe',
      email: `test.${Date.now()}@example.com`,
      phone: '555-123-4567',
      convictionType: 'DUI',
      convictionYear: '2020',
      urgency: 'immediate',
      budget: 'flexible',
      previousAttempts: 'never',
      interests: 'employment opportunities',
      employmentGoals: 'Get a better job',
      source: 'organic',
      deviceType: 'desktop',
      timeOnSite: '300000',
      pagesViewed: 5,
      leadMagnet: 'free-consultation'
    }

    try {
      console.log('📤 Sending test lead data...')
      console.log('📋 Test data:', JSON.stringify(testLead, null, 2))
      
      const response = await fetch(`${BASE_URL}/api/lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testLead)
      })

      console.log('📨 Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Response not OK:', errorText)
        process.exit(1)
      }

      const result = await response.json()
      console.log('📨 Response body:', JSON.stringify(result, null, 2))

      // Assert status 201
      if (response.status !== 201) {
        console.error(`❌ Expected status 201, got ${response.status}`)
        process.exit(1)
      }

      // Assert response has ID
      if (!result.leadId && !result.id) {
        console.error('❌ Response missing leadId or id field')
        console.log('Response:', result)
        process.exit(1)
      }

      // Assert success flag
      if (!result.success) {
        console.error('❌ Response missing success flag')
        process.exit(1)
      }

      console.log('✅ Test passed!')
      console.log(`✅ Lead created with ID: ${result.leadId || result.id}`)
      console.log(`✅ Lead score: ${result.leadScore}`)
      console.log(`✅ Lead segment: ${result.leadSegment}`)
      console.log(`✅ Method used: ${result.method}`)
      
      return result

    } catch (error) {
      console.error('❌ Test failed with error:', error.message)
      
      if (error.code === 'ECONNREFUSED') {
        console.error('💡 Make sure your Next.js server is running with: pnpm dev')
      }
      
      process.exit(1)
    }
  }

  async function testEnvCheck() {
    try {
      console.log('\n🔍 Testing environment check endpoint...')
      
      const response = await fetch(`${BASE_URL}/api/env-check`)
      
      if (!response.ok) {
        console.error('❌ Env check failed:', response.status)
        return
      }
      
      const envData = await response.json()
      console.log('✅ Environment check passed')
      console.log('📋 Environment status:', envData.REQUIRED_VARS_STATUS)
      
      // Check if required vars are present
      const required = envData.REQUIRED_VARS_STATUS
      if (!required.DATABASE_URI || !required.PAYLOAD_SECRET) {
        console.warn('⚠️  Some required environment variables are missing')
      }
      
    } catch (error) {
      console.error('❌ Env check error:', error.message)
    }
  }

  // Run tests
  console.log('🚀 Running comprehensive API tests...\n')
  
  // Test environment first
  await testEnvCheck()
  
  console.log('\n' + '='.repeat(50))
  
  // Test lead creation
  await testLeadAPI()
  
  console.log('\n🎉 All tests completed successfully!')
}

runTest().catch(error => {
  console.error('❌ Test suite failed:', error)
  process.exit(1)
})
